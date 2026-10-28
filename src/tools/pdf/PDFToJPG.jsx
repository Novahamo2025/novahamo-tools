import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;

export default function PDFToJPG() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const renderPages = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setImages([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pagesCount = pdf.numPages;
      const rendered = [];

      for (let i = 1; i <= Math.min(pagesCount, 20); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        rendered.push({
          pageNumber: i,
          dataUrl,
        });
      }

      setImages(rendered);
    } catch (err) {
      setError(`Failed to extract pages: ${err.message}`);
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
          onChange={e => { setFile(e.target.files?.[0]); setImages([]); setError(''); }}
        />
        <p className="form-hint">Converts each page of your PDF into high-resolution JPG images.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={renderPages} disabled={!file || loading}>
          {loading ? 'Converting PDF Pages...' : 'Convert to JPG Images'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setImages([]); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {images.length > 0 && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Rendered Pages ({images.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {images.map(img => (
              <div key={img.pageNumber} className="card" style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                <img src={img.dataUrl} alt={`Page ${img.pageNumber}`} style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 'var(--space-2) 0' }}>
                  Page {img.pageNumber}
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = img.dataUrl;
                    a.download = `page_${img.pageNumber}.jpg`;
                    a.click();
                  }}
                >
                  <Download size={14} /> Download JPG
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
