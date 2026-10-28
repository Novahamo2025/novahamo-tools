import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

const SOCIAL_PRESETS = [
  { platform: 'Twitter / X', name: 'Header Banner', w: 1500, h: 500 },
  { platform: 'Twitter / X', name: 'In-Stream Post', w: 1200, h: 675 },
  { platform: 'LinkedIn', name: 'Personal Profile Banner', w: 1584, h: 396 },
  { platform: 'LinkedIn', name: 'Company Page Cover', w: 1128, h: 191 },
  { platform: 'Facebook', name: 'Page Cover Photo', w: 820, h: 312 },
  { platform: 'Facebook', name: 'Feed Post Image', w: 1200, h: 630 },
  { platform: 'Pinterest', name: 'Standard Pin (2:3)', w: 1000, h: 1500 },
];

export default function SocialImageConverter() {
  const [file, setFile] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [fit, setFit] = useState('cover');
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

    const target = SOCIAL_PRESETS[selectedIdx];
    const canvas = canvasRef.current;
    canvas.width = target.w;
    canvas.height = target.h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = fit === 'cover'
      ? Math.max(canvas.width / img.width, canvas.height / img.height)
      : Math.min(canvas.width / img.width, canvas.height / img.height);

    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (canvas.width - dw) / 2;
    const dy = (canvas.height - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  const current = SOCIAL_PRESETS[selectedIdx];

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Target Platform & Dimension</label>
          <select className="select-field" value={selectedIdx} onChange={e => setSelectedIdx(Number(e.target.value))}>
            {SOCIAL_PRESETS.map((p, i) => (
              <option key={i} value={i}>{p.platform}: {p.name} ({p.w}×{p.h})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fit Mode</label>
          <select className="select-field" value={fit} onChange={e => setFit(e.target.value)}>
            <option value="cover">Crop to Fit Canvas (No letterbox)</option>
            <option value="contain">Fit Whole Image (White letterbox)</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Convert to {current.w}×{current.h}</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Converted" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = `${current.platform.toLowerCase()}_${current.w}x${current.h}.jpg`;
              a.click();
            }}><Download size={16} /> Download {current.w}×{current.h} Image</button>
          </div>
        </div>
      )}
    </div>
  );
}
