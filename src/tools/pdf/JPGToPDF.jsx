import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function JPGToPDF() {
  const [files, setFiles] = useState([]);
  const [orientation, setOrientation] = useState('p'); // 'p' (portrait) or 'l' (landscape)
  const [pageSize, setPageSize] = useState('a4');
  const [loading, setLoading] = useState(false);

  const convertToPDF = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      const doc = new jsPDF(orientation, 'pt', pageSize);

      for (let i = 0; i < files.length; i++) {
        if (i > 0) doc.addPage(pageSize, orientation);

        const file = files[i];
        const img = await new Promise((res, rej) => {
          const image = new Image();
          image.onload = () => res(image);
          image.onerror = rej;
          image.src = URL.createObjectURL(file);
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const scale = Math.min((pageWidth - 40) / img.width, (pageHeight - 40) / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.92);

        doc.addImage(imgData, 'JPEG', x, y, w, h);
      }

      doc.save('converted_images.pdf');
    } catch (err) {
      alert('Error creating PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload JPG / PNG Images (One or Multiple)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="input-field"
          onChange={e => setFiles(Array.from(e.target.files || []))}
        />
        {files.length > 0 && <p className="form-hint">{files.length} images selected</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Page Orientation</label>
          <select className="select-field" value={orientation} onChange={e => setOrientation(e.target.value)}>
            <option value="p">Portrait</option>
            <option value="l">Landscape</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Page Size</label>
          <select className="select-field" value={pageSize} onChange={e => setPageSize(e.target.value)}>
            <option value="a4">Standard A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convertToPDF} disabled={files.length === 0 || loading}>
          {loading ? 'Compiling PDF...' : `Convert ${files.length} Images to PDF`}
        </button>
        <button className="btn btn-ghost" onClick={() => setFiles([])}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
}
