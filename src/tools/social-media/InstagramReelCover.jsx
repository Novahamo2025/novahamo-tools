import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function InstagramReelCover() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('REEL TITLE HERE');
  const [fontSize, setFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [overlayDarkness, setOverlayDarkness] = useState(0.35);
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
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Fill cover scale
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (canvas.width - dw) / 2;
    const dy = (canvas.height - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);

    // Dimming overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayDarkness})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw central text in the grid-safe area (center 1080x1080)
    if (title.trim()) {
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10;
      ctx.fillText(title, canvas.width / 2, canvas.height / 2);
    }

    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video Frame / Photo</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Cover Catchphrase / Title</label>
          <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Background Dimming: {Math.round(overlayDarkness * 100)}%</label>
          <input type="range" min={0} max={0.8} step={0.05} value={overlayDarkness} onChange={e => setOverlayDarkness(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Generate 1080×1920 Cover</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Reel Cover" style={{ maxWidth: 300, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'reel_cover.jpg';
              a.click();
            }}><Download size={16} /> Download Reel Cover (JPG)</button>
          </div>
        </div>
      )}
    </div>
  );
}
