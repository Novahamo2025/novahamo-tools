import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PDFPageNumber() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('page_of_total'); // 'page_of_total', 'simple', 'dash'
  const [position, setPosition] = useState('bottom_center'); // 'bottom_center', 'bottom_right', 'bottom_left'
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const addNumbers = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const pageNum = idx + 1;
        let str = `Page ${pageNum} of ${total}`;
        if (format === 'simple') str = `${pageNum}`;
        if (format === 'dash') str = `- ${pageNum} -`;

        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(str, 10);

        let x = width / 2 - textWidth / 2;
        if (position === 'bottom_right') x = width - textWidth - 30;
        if (position === 'bottom_left') x = 30;

        const y = 25; // bottom margin

        page.drawText(str, {
          x,
          y,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(`Error adding numbers: ${err.message}`);
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
          <label className="form-label">Numbering Format</label>
          <select className="select-field" value={format} onChange={e => setFormat(e.target.value)}>
            <option value="page_of_total">Page X of Y (e.g. Page 1 of 10)</option>
            <option value="simple">Simple Number (e.g. 1)</option>
            <option value="dash">Dashed (e.g. - 1 -)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Placement Position</label>
          <select className="select-field" value={position} onChange={e => setPosition(e.target.value)}>
            <option value="bottom_center">Bottom Center</option>
            <option value="bottom_right">Bottom Right Corner</option>
            <option value="bottom_left">Bottom Left Corner</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={addNumbers} disabled={!file || loading}>
          {loading ? 'Numbering Pages...' : 'Add Page Numbers'}
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
            a.download = 'numbered_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Numbered PDF
          </button>
        </div>
      )}
    </div>
  );
}
