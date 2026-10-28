import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function PhotoBrightnessContrast() {
  const [file, setFile] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [resultUrl, setResultUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const loadImg = (f) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(f); });

  const preview = async () => {
    if (!file) return;
    const img = await loadImg(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
    ctx.drawImage(img, 0, 0);
    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group"><label className="form-label">Upload Image</label><input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setPreviewUrl(null); setResultUrl(null); }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group"><label className="form-label">Brightness: {brightness}%</label><input type="range" min="0" max="300" value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%' }} /></div>
        <div className="form-group"><label className="form-label">Contrast: {contrast}%</label><input type="range" min="0" max="300" value={contrast} onChange={e => setContrast(Number(e.target.value))} style={{ width: '100%' }} /></div>
        <div className="form-group"><label className="form-label">Saturation: {saturate}%</label><input type="range" min="0" max="300" value={saturate} onChange={e => setSaturate(Number(e.target.value))} style={{ width: '100%' }} /></div>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={preview} disabled={!file}>Apply & Preview</button>
        <button className="btn btn-ghost" onClick={() => { setBrightness(100); setContrast(100); setSaturate(100); setPreviewUrl(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {previewUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={previewUrl} alt="Adjusted" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'adjusted.jpg'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
