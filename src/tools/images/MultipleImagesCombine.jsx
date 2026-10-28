import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function MultipleImagesCombine() {
  const [files, setFiles] = useState([]);
  const [direction, setDirection] = useState('horizontal');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const loadImg = (file) => new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => resolve(img); img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const combine = async () => {
    if (files.length < 2) return;
    const images = await Promise.all(files.map(loadImg));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (direction === 'horizontal') {
      canvas.width = images.reduce((s, i) => s + i.width, 0);
      canvas.height = Math.max(...images.map(i => i.height));
      let x = 0;
      images.forEach(img => { ctx.drawImage(img, x, 0); x += img.width; });
    } else {
      canvas.width = Math.max(...images.map(i => i.width));
      canvas.height = images.reduce((s, i) => s + i.height, 0);
      let y = 0;
      images.forEach(img => { ctx.drawImage(img, 0, y); y += img.height; });
    }
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Images (2 or more)</label>
        <input type="file" accept="image/*" multiple className="input-field" onChange={e => setFiles(Array.from(e.target.files || []))} />
        {files.length > 0 && <p className="form-hint">{files.length} files selected</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Direction</label>
        <select className="select-field" value={direction} onChange={e => setDirection(e.target.value)}>
          <option value="horizontal">Horizontal (side by side)</option>
          <option value="vertical">Vertical (stacked)</option>
        </select>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={combine} disabled={files.length < 2}>Combine Images</button>
        <button className="btn btn-ghost" onClick={() => { setFiles([]); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Combined" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'combined.png'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}>
            <Download size={16} /> Download
          </button>
        </div>
      )}
    </div>
  );
}
