import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function YouTubeThumbnailResizer() {
  const [file, setFile] = useState(null);
  const [fit, setFit] = useState('cover'); // 'cover' or 'contain'
  const [bgColor, setBgColor] = useState('#000000');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const process = async () => {
    if (!file) return;
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    const canvas = canvasRef.current;
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = fit === 'cover'
      ? Math.max(canvas.width / img.width, canvas.height / img.height)
      : Math.min(canvas.width / img.width, canvas.height / img.height);

    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (canvas.width - dw) / 2;
    const dy = (canvas.height - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    setResultUrl(canvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
        <p className="form-hint">Resizes your image strictly to YouTube standard 16:9 ratio (1280×720 pixels).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Fit Mode</label>
          <select className="select-field" value={fit} onChange={e => setFit(e.target.value)}>
            <option value="cover">Crop to 16:9 (No bars)</option>
            <option value="contain">Fit Full Image (Add black bars)</option>
          </select>
        </div>
        {fit === 'contain' && (
          <div className="form-group">
            <label className="form-label">Bar Color</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
          </div>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Resize to 1280×720</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="1280x720 Thumbnail" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'youtube_thumbnail_1280x720.jpg';
              a.click();
            }}><Download size={16} /> Download 1280×720 Thumbnail</button>
          </div>
        </div>
      )}
    </div>
  );
}
