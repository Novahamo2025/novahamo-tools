import { useState } from 'react';
import { RotateCw, Download, RotateCcw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function PDFPageRotator() {
  const [file, setFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [pageScope, setPageScope] = useState('all'); // 'all' or 'odd' or 'even'
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const rotatePDF = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const pageNum = idx + 1;
        let shouldRotate = false;
        if (pageScope === 'all') shouldRotate = true;
        if (pageScope === 'odd' && pageNum % 2 !== 0) shouldRotate = true;
        if (pageScope === 'even' && pageNum % 2 === 0) shouldRotate = true;

        if (shouldRotate) {
          const currentRot = page.getRotation().angle;
          page.setRotation(degrees((currentRot + rotationAngle) % 360));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(`Error rotating PDF: ${err.message}`);
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Rotation Angle</label>
          <select className="select-field" value={rotationAngle} onChange={e => setRotationAngle(Number(e.target.value))}>
            <option value={90}>Rotate 90° Clockwise</option>
            <option value={180}>Rotate 180° Flip</option>
            <option value={270}>Rotate 270° (90° Counter-Clockwise)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Pages to Rotate</label>
          <select className="select-field" value={pageScope} onChange={e => setPageScope(e.target.value)}>
            <option value="all">All Pages</option>
            <option value="odd">Odd Pages Only (1, 3, 5...)</option>
            <option value="even">Even Pages Only (2, 4, 6...)</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={rotatePDF} disabled={!file || loading}>
          {loading ? 'Processing Pages...' : 'Rotate PDF Pages'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            PDF rotated successfully!
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'rotated_' + (file?.name || 'document.pdf');
              a.click();
            }}>
              <Download size={16} /> Download Rotated PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
