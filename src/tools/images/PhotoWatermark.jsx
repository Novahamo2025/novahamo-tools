import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function PhotoWatermark() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('NovaHamo');
  const [fontSize, setFontSize] = useState(40);
  const [color, setColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState('center');
  const [resultUrl, setResultUrl] = useState(null);

  const loadImg = (f) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(f); });

  const apply = async () => {
    if (!file || !text.trim()) return;
    const img = await loadImg(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    const metrics = ctx.measureText(text);
    let x = canvas.width / 2, y = canvas.height / 2;
    if (position === 'top-left') { x = metrics.width / 2 + 20; y = fontSize + 20; }
    else if (position === 'top-right') { x = canvas.width - metrics.width / 2 - 20; y = fontSize + 20; }
    else if (position === 'bottom-left') { x = metrics.width / 2 + 20; y = canvas.height - 20; }
    else if (position === 'bottom-right') { x = canvas.width - metrics.width / 2 - 20; y = canvas.height - 20; }
    else if (position === 'diagonal') {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
      setResultUrl(canvas.toDataURL('image/png'));
      return;
    }
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group"><label className="form-label">Watermark Text</label><input type="text" className="input-field" value={text} onChange={e => setText(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Font Size</label><input type="number" className="input-field" min={10} max={200} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></div>
        <div className="form-group"><label className="form-label">Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '100%', height: 40 }} /></div>
        <div className="form-group"><label className="form-label">Opacity: {Math.round(opacity * 100)}%</label><input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={{ width: '100%' }} /></div>
        <div className="form-group"><label className="form-label">Position</label>
          <select className="select-field" value={position} onChange={e => setPosition(e.target.value)}>
            <option value="center">Center</option><option value="top-left">Top Left</option><option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option><option value="diagonal">Diagonal</option>
          </select>
        </div>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={apply} disabled={!file || !text.trim()}>Add Watermark</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Watermarked" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'watermarked.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
