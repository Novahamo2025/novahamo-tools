import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

const PRESETS = [
  { label: 'India (3.5×4.5 cm)', w: 413, h: 531 },
  { label: 'US (2×2 inch)', w: 600, h: 600 },
  { label: 'UK (3.5×4.5 cm)', w: 413, h: 531 },
  { label: 'Custom', w: 0, h: 0 },
];

export default function PassportPhoto() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState(0);
  const [customW, setCustomW] = useState(413);
  const [customH, setCustomH] = useState(531);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copies, setCopies] = useState(4);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const loadImg = (f) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(f); });

  const generate = async () => {
    if (!file) return;
    const img = await loadImg(file);
    const p = PRESETS[preset];
    const pw = p.w || customW, ph = p.h || customH;
    const cols = Math.ceil(Math.sqrt(copies));
    const rows = Math.ceil(copies / cols);
    const gap = 20;
    const canvas = canvasRef.current;
    canvas.width = cols * pw + (cols + 1) * gap;
    canvas.height = rows * ph + (rows + 1) * gap;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < copies; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const x = gap + c * (pw + gap), y = gap + r * (ph + gap);
      const scale = Math.min(pw / img.width, ph / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, x + (pw - dw) / 2, y + (ph - dh) / 2, dw, dh);
    }
    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
        ⚠️ Photo presets are configurable suggestions. Verify official requirements for your specific application.
      </p>
      <div className="form-group">
        <label className="form-label">Upload Photo</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Size Preset</label>
          <select className="select-field" value={preset} onChange={e => setPreset(Number(e.target.value))}>
            {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
        </div>
        {preset === 3 && <>
          <div className="form-group">
            <label className="form-label">Width (px)</label>
            <input type="number" className="input-field" value={customW} onChange={e => setCustomW(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (px)</label>
            <input type="number" className="input-field" value={customH} onChange={e => setCustomH(Number(e.target.value))} />
          </div>
        </>}
        <div className="form-group">
          <label className="form-label">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 40 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Copies</label>
          <input type="number" className="input-field" min={1} max={12} value={copies} onChange={e => setCopies(Number(e.target.value))} />
        </div>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate} disabled={!file}>Generate Sheet</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Passport Photos" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'passport-photos.jpg'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
