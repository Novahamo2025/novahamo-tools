import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function ProfilePictureCropper() {
  const [file, setFile] = useState(null);
  const [shape, setShape] = useState('circle'); // 'circle' or 'square'
  const [zoom, setZoom] = useState(1);
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

    const size = 512;
    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    const baseScale = Math.max(size / img.width, size / img.height);
    const finalScale = baseScale * zoom;
    const dw = img.width * finalScale;
    const dh = img.height * finalScale;
    const dx = (size - dw) / 2;
    const dy = (size - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Avatar / Profile Photo</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Avatar Shape Mask</label>
          <select className="select-field" value={shape} onChange={e => setShape(e.target.value)}>
            <option value="circle">Circular Avatar (Transparent Background)</option>
            <option value="square">Standard 1:1 Square</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Zoom Scale: {zoom.toFixed(1)}x</label>
          <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!file}>Crop 512×512 Profile Picture</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); setZoom(1); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img
            src={resultUrl}
            alt="Profile Picture"
            style={{
              width: 200,
              height: 200,
              borderRadius: shape === 'circle' ? '50%' : 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              margin: '0 auto',
              border: '2px solid var(--color-border)',
            }}
          />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = `avatar_${shape}.png`;
              a.click();
            }}><Download size={16} /> Download 512×512 Avatar (PNG)</button>
          </div>
        </div>
      )}
    </div>
  );
}
