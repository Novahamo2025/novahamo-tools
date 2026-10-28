import { useState, useRef } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { formatFileSize } from '../../utils/download';

export default function ImageOverlay() {
  const [baseFile, setBaseFile] = useState(null);
  const [overlayFile, setOverlayFile] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [overlayScale, setOverlayScale] = useState(50);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const loadImg = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const process = async () => {
    if (!baseFile || !overlayFile) return;
    const base = await loadImg(baseFile);
    const overlay = await loadImg(overlayFile);
    const canvas = canvasRef.current;
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(base, 0, 0);
    ctx.globalAlpha = opacity;
    const ow = base.width * (overlayScale / 100);
    const oh = (overlay.height / overlay.width) * ow;
    ctx.drawImage(overlay, posX, posY, ow, oh);
    ctx.globalAlpha = 1;
    setResultUrl(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a'); a.href = resultUrl; a.download = 'overlay-result.png'; a.click();
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Base Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setBaseFile(e.target.files?.[0])} />
      </div>
      <div className="form-group">
        <label className="form-label">Overlay Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setOverlayFile(e.target.files?.[0])} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Opacity: {Math.round(opacity * 100)}%</label>
          <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label className="form-label">X Position</label>
          <input type="number" className="input-field" value={posX} onChange={e => setPosX(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Y Position</label>
          <input type="number" className="input-field" value={posY} onChange={e => setPosY(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Overlay Size: {overlayScale}%</label>
          <input type="range" min="10" max="100" value={overlayScale} onChange={e => setOverlayScale(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={process} disabled={!baseFile || !overlayFile}>Apply Overlay</button>
        <button className="btn btn-ghost" onClick={() => { setBaseFile(null); setOverlayFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Result" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={download} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
