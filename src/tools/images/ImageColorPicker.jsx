import { useState, useRef, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function ImageColorPicker() {
  const [file, setFile] = useState(null);
  const [color, setColor] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const canvasRef = useRef(null);

  const loadImage = (f) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setImgLoaded(true);
    };
    img.src = URL.createObjectURL(f);
  };

  const pick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext('2d');
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    const hsl = rgbToHsl(r, g, b);
    setColor({ r, g, b, hex, hsl });
  }, []);

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  return (
    <div className="tool-workspace">
      <div className="form-group"><label className="form-label">Upload Image</label><input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); if (e.target.files?.[0]) loadImage(e.target.files[0]); }} /></div>
      {imgLoaded && <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>Click anywhere on the image to pick a color</p>}
      <canvas ref={canvasRef} onClick={pick} style={{ maxWidth: '100%', cursor: imgLoaded ? 'crosshair' : 'default', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: file ? 'block' : 'none' }} />
      {color && (
        <div className="tool-result">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ width: 60, height: 60, backgroundColor: color.hex, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
            <div>
              {[
                { label: 'HEX', value: color.hex },
                { label: 'RGB', value: `rgb(${color.r}, ${color.g}, ${color.b})` },
                { label: 'HSL', value: color.hsl },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                  <strong style={{ fontSize: '0.8125rem', width: 40 }}>{c.label}:</strong>
                  <code style={{ fontSize: '0.8125rem' }}>{c.value}</code>
                  <button className="btn btn-ghost btn-sm" onClick={() => copyToClipboard(c.value)} style={{ padding: 2 }}><Copy size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
