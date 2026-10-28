import { useState } from 'react';
import { Download, RotateCcw, Plus } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PDFEditor() {
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [annotationText, setAnnotationText] = useState('APPROVED');
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(700);
  const [fontSize, setFontSize] = useState(18);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const applyAnnotation = async () => {
    if (!file || !annotationText.trim()) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      const targetIdx = Math.max(0, Math.min(pages.length - 1, pageNumber - 1));
      const page = pages[targetIdx];

      page.drawText(annotationText, {
        x: posX,
        y: posY,
        size: fontSize,
        font,
        color: rgb(0.08, 0.5, 0.24), // NovaHamo green
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error editing PDF: ' + err.message);
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Annotation Text</label>
          <input
            type="text"
            className="input-field"
            value={annotationText}
            onChange={e => setAnnotationText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Target Page Number</label>
          <input
            type="number"
            min={1}
            className="input-field"
            value={pageNumber}
            onChange={e => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">X Position (pts from left)</label>
          <input
            type="number"
            className="input-field"
            value={posX}
            onChange={e => setPosX(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Y Position (pts from bottom)</label>
          <input
            type="number"
            className="input-field"
            value={posY}
            onChange={e => setPosY(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Font Size (pt)</label>
          <input
            type="number"
            className="input-field"
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={applyAnnotation} disabled={!file || !annotationText.trim() || loading}>
          {loading ? 'Embedding Annotation...' : 'Apply Text to PDF'}
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
            a.download = 'edited_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Edited PDF
          </button>
        </div>
      )}
    </div>
  );
}
