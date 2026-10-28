import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function ImageUpscaler() {
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(2);
  const [resultUrl, setResultUrl] = useState(null);
  const [origDimensions, setOrigDimensions] = useState(null);
  const [newDimensions, setNewDimensions] = useState(null);

  const apply = async () => {
    if (!file) return;
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    setOrigDimensions({ w: img.width, h: img.height });
    const targetW = img.width * scale;
    const targetH = img.height * scale;
    setNewDimensions({ w: targetW, h: targetH });

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>
      <div className="form-group">
        <label className="form-label">Scale Factor</label>
        <select className="select-field" value={scale} onChange={e => setScale(Number(e.target.value))}>
          <option value={2}>2x Upscale</option>
          <option value={3}>3x Upscale</option>
          <option value={4}>4x Upscale</option>
        </select>
        <p className="form-hint">Uses high-quality bicubic canvas interpolation. Note: this enhances canvas pixel resolution without generative hallucination.</p>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={apply} disabled={!file}>Upscale Image</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          {origDimensions && newDimensions && (
            <p style={{ marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Original: {origDimensions.w}×{origDimensions.h}px ➔ Upscaled: <strong>{newDimensions.w}×{newDimensions.h}px</strong>
            </p>
          )}
          <img src={resultUrl} alt="Upscaled" style={{ maxWidth: '100%', maxHeight: 450, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = `upscaled-${scale}x.png`;
              a.click();
            }}><Download size={16} /> Download High-Res</button>
          </div>
        </div>
      )}
    </div>
  );
}
