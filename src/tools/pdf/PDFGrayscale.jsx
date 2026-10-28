import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;

export default function PDFGrayscale() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');

  const convertToGrayscale = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const totalPages = pdf.numPages;

      let doc = null;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert canvas pixels to grayscale
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let j = 0; j < data.length; j += 4) {
          const avg = data[j] * 0.299 + data[j + 1] * 0.587 + data[j + 2] * 0.114;
          data[j] = avg;
          data[j + 1] = avg;
          data[j + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);

        const grayDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait';
        if (i === 1) {
          doc = new jsPDF({ orientation, unit: 'pt', format: [viewport.width, viewport.height] });
        } else {
          doc.addPage([viewport.width, viewport.height], orientation);
        }

        doc.addImage(grayDataUrl, 'JPEG', 0, 0, viewport.width, viewport.height);
        setProgress(Math.round((i / totalPages) * 100));
      }

      const pdfBlob = doc.output('blob');
      setResultUrl(URL.createObjectURL(pdfBlob));
    } catch (err) {
      setError('Conversion error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Color PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); setError(''); }}
        />
        <p className="form-hint">Converts color documents into true black &amp; white / grayscale vector imagery for economical printing.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convertToGrayscale} disabled={!file || loading}>
          {loading ? `Converting (${progress}%)...` : 'Convert to Grayscale'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'grayscale_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Grayscale PDF
          </button>
        </div>
      )}
    </div>
  );
}
