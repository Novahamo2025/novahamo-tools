import { useState } from 'react';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFPageRemover() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToRemove, setPagesToRemove] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setResultUrl(null);

    try {
      const buffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      setTotalPages(pdfDoc.getPageCount());
    } catch (err) {
      setError('Could not read PDF: ' + err.message);
    }
  };

  const removePages = async () => {
    setError('');
    if (!file || !pagesToRemove.trim()) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const total = pdfDoc.getPageCount();

      // Parse user input: e.g. "2, 4-6"
      const indicesToRemove = new Set();
      const parts = pagesToRemove.split(',').map(s => s.trim()).filter(Boolean);

      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
          if (!isNaN(start) && !isNaN(end)) {
            for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
              if (p >= 1 && p <= total) indicesToRemove.add(p - 1); // 0-based
            }
          }
        } else {
          const p = parseInt(part, 10);
          if (!isNaN(p) && p >= 1 && p <= total) {
            indicesToRemove.add(p - 1);
          }
        }
      }

      if (indicesToRemove.size === 0) {
        throw new Error('No valid page numbers found matching this document.');
      }
      if (indicesToRemove.size >= total) {
        throw new Error('Cannot delete all pages from the document.');
      }

      // Create new document keeping only non-deleted pages
      const newDoc = await PDFDocument.create();
      const keepIndices = [];
      for (let i = 0; i < total; i++) {
        if (!indicesToRemove.has(i)) {
          keepIndices.push(i);
        }
      }

      const copiedPages = await newDoc.copyPages(pdfDoc, keepIndices);
      copiedPages.forEach(page => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={handleFile}
        />
        {totalPages > 0 && (
          <p className="form-hint">Document has <strong>{totalPages}</strong> total pages.</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Page Numbers to Delete / Remove</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. 2, 4-6"
          value={pagesToRemove}
          onChange={e => setPagesToRemove(e.target.value)}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={removePages} disabled={!file || !pagesToRemove.trim() || loading}>
          <Trash2 size={16} /> {loading ? 'Removing Pages...' : 'Delete Selected Pages'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setTotalPages(0); setPagesToRemove(''); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'pages_removed_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Modified PDF
          </button>
        </div>
      )}
    </div>
  );
}
