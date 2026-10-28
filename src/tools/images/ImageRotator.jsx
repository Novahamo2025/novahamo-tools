import { useState } from 'react';
import { Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function ImageRotator() {
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const apply = async () => {
    if (!file) return;
    const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(file); });
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * cos + img.height * sin);
    canvas.height = Math.round(img.width * sin + img.height * cos);
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group"><label className="form-label">Upload Image</label><input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} /></div>
      <div className="form-group"><label className="form-label">Rotation: {rotation}°</label><input type="range" min="0" max="360" value={rotation} onChange={e => setRotation(Number(e.target.value))} style={{ width: '100%' }} /></div>
      <div className="tool-actions" style={{ marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-sm btn-secondary" onClick={() => setRotation((rotation + 90) % 360)}><RotateCw size={14} /> 90°</button>
        <button className="btn btn-sm btn-secondary" onClick={() => setRotation((rotation + 180) % 360)}>180°</button>
        <button className="btn btn-sm btn-secondary" onClick={() => setFlipH(!flipH)}><FlipHorizontal size={14} /> Flip H</button>
        <button className="btn btn-sm btn-secondary" onClick={() => setFlipV(!flipV)}><FlipVertical size={14} /> Flip V</button>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={apply} disabled={!file}>Apply</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); setRotation(0); setFlipH(false); setFlipV(false); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Rotated" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'rotated.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
