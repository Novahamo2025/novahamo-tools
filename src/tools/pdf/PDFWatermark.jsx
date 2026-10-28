import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export default function PDFWatermark() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.25);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const applyWatermark = async () => {
    if (!file || !text.trim()) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: width / 2 - textWidth / 2 + 30,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: rgb(0.8, 0.1, 0.1),
          opacity: opacity,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(`Error watermarking PDF: ${err.message}`);
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
          <label className="form-label">Watermark Text</label>
          <input
            type="text"
            className="input-field"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Font Size (pt)</label>
          <input
            type="number"
            className="input-field"
            min={20}
            max={100}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Opacity: {Math.round(opacity * 100)}%</label>
          <input
            type="range"
            min={0.05}
            max={0.8}
            step={0.05}
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={applyWatermark} disabled={!file || !text.trim() || loading}>
          {loading ? 'Applying Stamp...' : 'Add Watermark to All Pages'}
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
            a.download = 'watermarked_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Watermarked PDF
          </button>
        </div>
      )}
    </div>
  );
}
