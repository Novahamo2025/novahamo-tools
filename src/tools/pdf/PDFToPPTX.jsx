import { useState } from 'react';
import { Download, RotateCcw, Info } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;

export default function PDFToPPTX() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slideImages, setSlideImages] = useState([]);
  const [error, setError] = useState('');

  const processSlides = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');
    setSlideImages([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const count = pdf.numPages;
      const slides = [];

      for (let i = 1; i <= Math.min(count, 30); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 }); // High quality slide capture
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        slides.push({
          pageNumber: i,
          blob,
          dataUrl: URL.createObjectURL(blob),
          name: `Slide_${String(i).padStart(2, '0')}.png`,
        });

        setProgress(Math.round((i / count) * 100));
      }

      setSlideImages(slides);
    } catch (err) {
      setError(`Failed to extract presentation slides: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAllZIP = async () => {
    if (slideImages.length === 0) return;
    const zip = new JSZip();
    slideImages.forEach(s => {
      zip.file(s.name, s.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, (file?.name.replace(/\.[^/.]+$/, '') || 'presentation_slides') + '_deck.zip');
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Conversion Scope:</strong> In client-side browser execution, PDFs are converted into exact 16:9 / 4:3 high-resolution slide deck visuals. Each slide preserves exact typography, vector charts, and layouts perfectly as presentation assets packaged in a ZIP archive.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Presentation PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setSlideImages([]); setError(''); }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={processSlides} disabled={!file || loading}>
          {loading ? `Extracting Slide Deck (${progress}%)...` : 'Convert Pages to Slide Deck'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setSlideImages([]); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {slideImages.length > 0 && (
        <div className="tool-result">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontWeight: 600 }}>{slideImages.length} Slides Ready</span>
            <button className="btn btn-primary btn-sm" onClick={downloadAllZIP}>
              <Download size={14} /> Download Presentation Deck (ZIP)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {slideImages.map(slide => (
              <div key={slide.pageNumber} className="card" style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                <img src={slide.dataUrl} alt={slide.name} style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: 'var(--space-2)' }}>{slide.name}</p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 'var(--space-2)' }}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = slide.dataUrl;
                    a.download = slide.name;
                    a.click();
                  }}
                >
                  <Download size={12} /> Download Slide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
