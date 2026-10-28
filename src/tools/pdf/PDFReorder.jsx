import { useState } from 'react';
import { Download, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFReorder() {
  const [file, setFile] = useState(null);
  const [pageOrder, setPageOrder] = useState([]);
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
      const count = pdfDoc.getPageCount();
      const initialOrder = Array.from({ length: count }, (_, i) => i);
      setPageOrder(initialOrder);
    } catch (err) {
      setError('Could not load PDF: ' + err.message);
    }
  };

  const movePage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= pageOrder.length) return;
    const newOrder = [...pageOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setPageOrder(newOrder);
  };

  const saveReorderedPDF = async () => {
    if (!file || pageOrder.length === 0) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(sourcePdf, pageOrder);
      copiedPages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error creating PDF: ' + err.message);
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
        {pageOrder.length > 0 && (
          <p className="form-hint">Rearrange pages below using the Up and Down arrows.</p>
        )}
      </div>

      {pageOrder.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-3)', margin: 'var(--space-4) 0' }}>
          {pageOrder.map((pageIdx, currentPosition) => (
            <div key={currentPosition} className="card" style={{ padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Position {currentPosition + 1}</span>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Original Page {pageIdx + 1}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: 2 }}
                  disabled={currentPosition === 0}
                  onClick={() => movePage(currentPosition, currentPosition - 1)}
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: 2 }}
                  disabled={currentPosition === pageOrder.length - 1}
                  onClick={() => movePage(currentPosition, currentPosition + 1)}
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={saveReorderedPDF} disabled={pageOrder.length === 0 || loading}>
          {loading ? 'Reordering Document...' : 'Compile Reordered PDF'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setPageOrder([]); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'reordered_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Reordered PDF
          </button>
        </div>
      )}
    </div>
  );
}
