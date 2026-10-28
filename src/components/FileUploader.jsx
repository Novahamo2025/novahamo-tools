import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { formatFileSize } from '../utils/download';

export default function FileUploader({
  accept,
  multiple = false,
  maxSizeMB = 100,
  onFilesSelected,
  label = 'Upload File',
  description = 'Drag & drop your file here, or click to browse',
}) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    setError('');
    const newFiles = Array.from(fileList);

    // Validate file sizes
    const oversized = newFiles.find(f => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    const selectedFiles = multiple ? newFiles : [newFiles[0]];
    setFiles(selectedFiles);
    if (onFilesSelected) onFilesSelected(selectedFiles);
  }, [multiple, maxSizeMB, onFilesSelected]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const removeFile = useCallback((index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  }, [files, onFilesSelected]);

  const clearAll = useCallback(() => {
    setFiles([]);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFilesSelected) onFilesSelected([]);
  }, [onFilesSelected]);

  return (
    <div>
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <Upload size={40} className="upload-area-icon" style={{ margin: '0 auto var(--space-4)' }} />
        <p className="upload-area-text">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          {description}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {error && (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-3)' }}>
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          {files.map((file, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                <FileIcon size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.875rem', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="btn btn-ghost btn-sm"
                aria-label={`Remove ${file.name}`}
                style={{ padding: 'var(--space-1)', flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {multiple && files.length > 1 && (
            <button onClick={clearAll} className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-2)' }}>
              Clear all files
            </button>
          )}
        </div>
      )}
    </div>
  );
}
