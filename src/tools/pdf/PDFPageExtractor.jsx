import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFPageExtractor() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('1');
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
      setError('Could not load PDF: ' + err.message);
    }
  };

  const extractPages = async () => {
    setError('');
    if (!file || !pageRange.trim()) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const total = sourcePdf.getPageCount();

      const indicesToExtract = [];
      const parts = pageRange.split(',').map(s => s.trim()).filter(Boolean);

      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
          if (!isNaN(start) && !isNaN(end)) {
            for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
              if (p >= 1 && p <= total && !indicesToExtract.includes(p - 1)) {
                indicesToExtract.push(p - 1);
              }
            }
          }
        } else {
          const p = parseInt(part, 10);
          if (!isNaN(p) && p >= 1 && p <= total && !indicesToExtract.includes(p - 1)) {
            indicesToExtract.push(p - 1);
          }
        }
      }

      if (indicesToExtract.length === 0) {
        throw new Error('Please specify valid page numbers within the document range.');
      }

      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(sourcePdf, indicesToExtract);
      copied.forEach(p => newDoc.addPage(p));

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
        <label className="form-label">Pages to Extract (e.g. &quot;1-3, 5, 8&quot;)</label>
        <input
          type="text"
          className="input-field"
          value={pageRange}
          onChange={e => setPageRange(e.target.value)}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={extractPages} disabled={!file || !pageRange.trim() || loading}>
          {loading ? 'Extracting Pages...' : 'Extract & Create New PDF'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setTotalPages(0); setPageRange('1'); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'extracted_' + (file?.name || 'pages.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Extracted PDF
          </button>
        </div>
      )}
    </div>
  );
}
