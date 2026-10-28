import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function ImagePixelator() {
  const [file, setFile] = useState(null);
  const [pixelSize, setPixelSize] = useState(10);
  const [resultUrl, setResultUrl] = useState(null);

  const apply = async () => {
    if (!file) return;
    const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(file); });
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    const sw = Math.max(1, Math.floor(img.width / pixelSize));
    const sh = Math.max(1, Math.floor(img.height / pixelSize));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, sw, sh);
    ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group"><label className="form-label">Upload Image</label><input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} /></div>
      <div className="form-group"><label className="form-label">Pixel Size: {pixelSize}</label><input type="range" min="2" max="50" value={pixelSize} onChange={e => setPixelSize(Number(e.target.value))} style={{ width: '100%' }} /></div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={apply} disabled={!file}>Pixelate</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Pixelated" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'pixelated.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
