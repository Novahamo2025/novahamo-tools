import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

const LAYOUTS = {
  '2-h': { cols: 2, rows: 1, label: '2 Side by Side' },
  '2-v': { cols: 1, rows: 2, label: '2 Stacked' },
  '2x2': { cols: 2, rows: 2, label: '2×2 Grid' },
  '3-h': { cols: 3, rows: 1, label: '3 Horizontal' },
  '3x2': { cols: 3, rows: 2, label: '3×2 Grid' },
  '3x3': { cols: 3, rows: 3, label: '3×3 Grid' },
};

export default function ImageCollage() {
  const [files, setFiles] = useState([]);
  const [layout, setLayout] = useState('2x2');
  const [gap, setGap] = useState(10);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const loadImg = (file) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(file); });

  const create = async () => {
    if (files.length < 2) return;
    const images = await Promise.all(Array.from(files).map(loadImg));
    const { cols, rows } = LAYOUTS[layout];
    const cellW = 400, cellH = 400;
    const canvas = canvasRef.current;
    canvas.width = cols * cellW + (cols + 1) * gap;
    canvas.height = rows * cellH + (rows + 1) * gap;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx >= images.length) break;
        const img = images[idx];
        const x = gap + c * (cellW + gap);
        const y = gap + r * (cellH + gap);
        const scale = Math.min(cellW / img.width, cellH / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        ctx.drawImage(img, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
      }
    }
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Images</label>
        <input type="file" accept="image/*" multiple className="input-field" onChange={e => setFiles(e.target.files)} />
        {files.length > 0 && <p className="form-hint">{files.length} files selected</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Layout</label>
          <select className="select-field" value={layout} onChange={e => setLayout(e.target.value)}>
            {Object.entries(LAYOUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Gap: {gap}px</label>
          <input type="range" min="0" max="40" value={gap} onChange={e => setGap(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 40, border: 'none' }} />
        </div>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={create} disabled={files.length < 2}>Create Collage</button>
        <button className="btn btn-ghost" onClick={() => { setFiles([]); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Collage" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'collage.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
