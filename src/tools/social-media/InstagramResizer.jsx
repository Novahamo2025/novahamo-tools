import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

const INSTA_PRESETS = [
  { label: 'Square Post (1:1) — 1080×1080', w: 1080, h: 1080 },
  { label: 'Portrait Post (4:5) — 1080×1350', w: 1080, h: 1350 },
  { label: 'Landscape Post (1.91:1) — 1080×566', w: 1080, h: 566 },
  { label: 'Story / Reel (9:16) — 1080×1920', w: 1080, h: 1920 },
];

export default function InstagramResizer() {
  const [file, setFile] = useState(null);
  const [presetIdx, setPresetIdx] = useState(0);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' (pad) or 'cover' (crop)
  const [bgColor, setBgColor] = useState('#FFFFFF');
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

    const target = INSTA_PRESETS[presetIdx];
    const canvas = canvasRef.current;
    canvas.width = target.w;
    canvas.height = target.h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (fitMode === 'contain') {
      const scale = Math.min(target.w / img.width, target.h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (target.w - dw) / 2;
      const dy = (target.h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const scale = Math.max(target.w / img.width, target.h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (target.w - dw) / 2;
      const dy = (target.h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Photo</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Instagram Format</label>
          <select className="select-field" value={presetIdx} onChange={e => setPresetIdx(Number(e.target.value))}>
            {INSTA_PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Scaling / Fitting</label>
          <select className="select-field" value={fitMode} onChange={e => setFitMode(e.target.value)}>
            <option value="contain">Fit with Border (No cropping)</option>
            <option value="cover">Crop to Fill Screen</option>
          </select>
        </div>
        {fitMode === 'contain' && (
          <div className="form-group">
            <label className="form-label">Padding Border Color</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
          </div>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Resize for Instagram</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Instagram Resized" style={{ maxWidth: '100%', maxHeight: 450, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'instagram_post.jpg';
              a.click();
            }}><Download size={16} /> Download for Instagram</button>
          </div>
        </div>
      )}
    </div>
  );
}
