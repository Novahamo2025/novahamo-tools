import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function ImageBlur() {
  const [file, setFile] = useState(null);
  const [blur, setBlur] = useState(5);
  const [resultUrl, setResultUrl] = useState(null);

  const apply = async () => {
    if (!file) return;
    const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(file); });
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(img, 0, 0);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group"><label className="form-label">Upload Image</label><input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} /></div>
      <div className="form-group"><label className="form-label">Blur Intensity: {blur}px</label><input type="range" min="1" max="50" value={blur} onChange={e => setBlur(Number(e.target.value))} style={{ width: '100%' }} /></div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={apply} disabled={!file}>Apply Blur</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Blurred" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'blurred.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
