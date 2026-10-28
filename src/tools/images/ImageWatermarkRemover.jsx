import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';

export default function ImageWatermarkRemover() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const loadImg = (f) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(f); });

  const process = async () => {
    if (!file) return;
    const img = await loadImg(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // Basic approach: slight blur + color blending to reduce visible watermarks
    ctx.filter = 'blur(1px)';
    ctx.globalAlpha = 0.8;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <div>
          <strong>Important:</strong> This tool is for images you own or are authorized to edit.
          Browser-based watermark removal has significant limitations — it applies basic blending, not professional AI inpainting. Results will vary.
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Image (that you own)</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} />
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Process Image</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Processed" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'processed.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}>Download</button>
        </div>
      )}
    </div>
  );
}
