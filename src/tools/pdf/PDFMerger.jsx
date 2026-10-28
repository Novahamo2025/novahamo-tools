import { useState, useCallback } from 'react';
import { FileDown, Upload, Merge, RotateCcw, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsArrayBuffer(file);
});

export default function PDFMerger() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [mergedBytes, setMergedBytes] = useState(null);
  const [error, setError] = useState('');

  const handleFiles = useCallback((e) => {
    const selected = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf');
    if (selected.length === 0) {
      setError('Please select valid PDF files.');
      return;
    }
    setFiles(prev => [...prev, ...selected.map((f, i) => ({ id: Date.now() + i, file: f }))]);
    setError('');
    setMergedBytes(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []).filter(f => f.type === 'application/pdf');
    if (dropped.length === 0) {
      setError('Please drop valid PDF files.');
      return;
    }
    setFiles(prev => [...prev, ...dropped.map((f, i) => ({ id: Date.now() + i, file: f }))]);
    setError('');
    setMergedBytes(null);
  }, []);

  const moveUp = (idx) => {
    if (idx === 0) return;
    setFiles(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
    setMergedBytes(null);
  };

  const moveDown = (idx) => {
    setFiles(prev => {
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
    setMergedBytes(null);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setMergedBytes(null);
  };

  const merge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      const mergedDoc = await PDFDocument.create();
      for (const item of files) {
        const bytes = await readFileAsArrayBuffer(item.file);
        const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach(p => mergedDoc.addPage(p));
      }
      const data = await mergedDoc.save();
      setMergedBytes(data);
    } catch (err) {
      setError('Failed to merge PDFs: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!mergedBytes) return;
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setMergedBytes(null);
    setError('');
    setProcessing(false);
  };

  return (
    <div className="tool-workspace">
      <p className="tool-description">
        Merge multiple PDF files into a single document. Upload PDFs, reorder them as needed, then merge.
      </p>

      <div className="upload-area" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <Upload size={32} />
        <p>Drag & drop PDFs here, or click to browse</p>
        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFiles}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>

      {files.length > 0 && (
        <div className="card">
          <p className="form-label">Files to merge ({files.length}):</p>
          {files.map((item, idx) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-color, #eee)' }}>
              <span style={{ flex: 1 }}>{idx + 1}. {item.file.name}</span>
              <button className="btn btn-secondary" onClick={() => moveUp(idx)} disabled={idx === 0} title="Move up">
                <ArrowUp size={14} />
              </button>
              <button className="btn btn-secondary" onClick={() => moveDown(idx)} disabled={idx === files.length - 1} title="Move down">
                <ArrowDown size={14} />
              </button>
              <button className="btn btn-secondary" onClick={() => removeFile(idx)} title="Remove">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="tool-result" style={{ color: '#e74c3c' }}>{error}</div>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={merge} disabled={files.length < 2 || processing}>
          <Merge size={16} />
          {processing ? 'Merging...' : 'Merge PDFs'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {mergedBytes && (
        <div className="tool-result">
          <p>✅ PDFs merged successfully! Total size: {(mergedBytes.length / 1024).toFixed(1)} KB</p>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}>
              <FileDown size={16} />
              Download Merged PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
