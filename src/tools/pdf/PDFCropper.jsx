import { useState } from 'react';
import { Download, RotateCcw, Crop } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFCropper() {
  const [file, setFile] = useState(null);
  const [marginTop, setMarginTop] = useState(30);
  const [marginBottom, setMarginBottom] = useState(30);
  const [marginLeft, setMarginLeft] = useState(30);
  const [marginRight, setMarginRight] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const cropPDF = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const newX = marginLeft;
        const newY = marginBottom;
        const newWidth = Math.max(50, width - marginLeft - marginRight);
        const newHeight = Math.max(50, height - marginTop - marginBottom);

        page.setCropBox(newX, newY, newWidth, newHeight);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error cropping PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload PDF Document</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }}
        />
        <p className="form-hint">Adjust crop margins (in points) applied to all document pages.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Top Trim Margin (pts)</label>
          <input type="number" min={0} className="input-field" value={marginTop} onChange={e => setMarginTop(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Bottom Trim Margin (pts)</label>
          <input type="number" min={0} className="input-field" value={marginBottom} onChange={e => setMarginBottom(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Left Trim Margin (pts)</label>
          <input type="number" min={0} className="input-field" value={marginLeft} onChange={e => setMarginLeft(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Right Trim Margin (pts)</label>
          <input type="number" min={0} className="input-field" value={marginRight} onChange={e => setMarginRight(Number(e.target.value))} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={cropPDF} disabled={!file || loading}>
          <Crop size={16} /> {loading ? 'Cropping Margins...' : 'Crop PDF Pages'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'cropped_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Cropped PDF
          </button>
        </div>
      )}
    </div>
  );
}
