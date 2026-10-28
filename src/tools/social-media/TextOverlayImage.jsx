import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function TextOverlayImage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('Your Custom Caption');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [posX, setPosX] = useState(50); // in percent
  const [posY, setPosY] = useState(50); // in percent
  const [hasShadow, setHasShadow] = useState(true);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const render = async () => {
    if (!file) return;
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    const x = (canvas.width * posX) / 100;
    const y = (canvas.height * posY) / 100;

    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';

    if (hasShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = 'transparent';
    }

    ctx.fillText(text, x, y);
    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Background Photo</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div className="form-group">
        <label className="form-label">Overlay Text</label>
        <input type="text" className="input-field" value={text} onChange={e => setText(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Font Family</label>
          <select className="select-field" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
            <option value="sans-serif">Modern Sans-Serif</option>
            <option value="Georgia, serif">Classic Serif</option>
            <option value="Impact, sans-serif">Bold Impact</option>
            <option value="monospace">Monospace Code</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Font Size: {fontSize}px</label>
          <input type="range" min={16} max={150} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Horizontal Position: {posX}%</label>
          <input type="range" min={0} max={100} value={posX} onChange={e => setPosX(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Vertical Position: {posY}%</label>
          <input type="range" min={0} max={100} value={posY} onChange={e => setPosY(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={hasShadow} onChange={e => setHasShadow(e.target.checked)} />
          Apply contrast drop shadow for readability
        </label>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={render} disabled={!file || !text.trim()}>Render Text on Image</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Overlay Result" style={{ maxWidth: '100%', maxHeight: 450, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'captioned_image.png';
              a.click();
            }}><Download size={16} /> Download Captioned Image</button>
          </div>
        </div>
      )}
    </div>
  );
}
