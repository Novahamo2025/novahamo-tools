import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function YouTubeThumbnailMaker() {
  const [file, setFile] = useState(null);
  const [mainTitle, setMainTitle] = useState('HOW TO CODE');
  const [subTitle, setSubTitle] = useState('Step-by-step for beginners');
  const [accentColor, setAccentColor] = useState('#22C55E');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const process = async () => {
    const canvas = canvasRef.current;
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (file) {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = URL.createObjectURL(file);
      });
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    } else {
      // Dark gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E293B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Vignette / dark overlay on left side
    const shade = ctx.createLinearGradient(0, 0, canvas.width * 0.7, 0);
    shade.addColorStop(0, 'rgba(0,0,0,0.85)');
    shade.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Accent badge
    ctx.fillStyle = accentColor;
    ctx.fillRect(80, 180, 12, 180);

    // Main text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 78px sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 12;
    ctx.fillText(mainTitle, 110, 260);

    // Subtitle
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText(subTitle, 110, 330);

    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Background Photo (Optional)</label>
          <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} />
        </div>
        <div className="form-group">
          <label className="form-label">Main Headline</label>
          <input type="text" className="input-field" value={mainTitle} onChange={e => setMainTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle / Hook</label>
          <input type="text" className="input-field" value={subTitle} onChange={e => setSubTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Accent Color</label>
          <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process}>Generate YouTube Thumbnail</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Thumbnail Preview" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'youtube_thumbnail.jpg';
              a.click();
            }}><Download size={16} /> Download 1280×720 Thumbnail</button>
          </div>
        </div>
      )}
    </div>
  );
}
