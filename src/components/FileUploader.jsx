import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      setError(`File "${oversized.name}" exceeds the ${maxSizeMB}MB limit.`);
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
    <div style={{ width: '100%' }}>
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
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-primary-bg)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-3)',
          boxShadow: '0 4px 14px var(--color-primary-glow)',
          transition: 'transform var(--transition-spring)',
        }}>
          <Upload size={24} />
        </div>
        <p className="upload-area-text" style={{ fontSize: '1rem', fontWeight: 600 }}>
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          {description}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          Max file size: {maxSizeMB}MB
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
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="notification notification-error"
          style={{ marginTop: 'var(--space-3)' }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </motion.div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-2)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-bg)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileIcon size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--color-text)',
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
                  title="Remove file"
                  style={{ padding: 'var(--space-1)', minHeight: 32, minWidth: 32, flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {multiple && files.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <button
                onClick={clearAll}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}
              >
                Clear all files
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
