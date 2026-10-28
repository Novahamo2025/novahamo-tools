import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Crop, Move } from 'lucide-react';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(100);
  const [cropH, setCropH] = useState(100);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const canvasRef = useRef(null);
  const scale = useRef(1);

  const handleFile = useCallback(async (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    setError(''); setFile(f); setResult(null);
    try {
      const image = await loadImage(f);
      setImg(image);
      setCropX(0); setCropY(0);
      setCropW(image.width); setCropH(image.height);
    } catch { setError('Failed to load image.'); }
  }, []);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const maxW = Math.min(600, canvas.parentElement?.clientWidth || 600);
    scale.current = Math.min(1, maxW / img.width);
    canvas.width = img.width * scale.current;
    canvas.height = img.height * scale.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // Draw crop overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sx = cropX * scale.current, sy = cropY * scale.current;
    const sw = cropW * scale.current, sh = cropH * scale.current;
    ctx.clearRect(sx, sy, sw, sh);
    ctx.drawImage(img, cropX, cropY, cropW, cropH, sx, sy, sw, sh);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.setLineDash([]);
  }, [img, cropX, cropY, cropW, cropH]);

  const handleMouseDown = (e) => {
    if (!img) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale.current;
    const y = (e.clientY - rect.top) / scale.current;
    setDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !dragStart || !img) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(img.width, (e.clientX - rect.left) / scale.current));
    const y = Math.max(0, Math.min(img.height, (e.clientY - rect.top) / scale.current));
    const nx = Math.min(dragStart.x, x);
    const ny = Math.min(dragStart.y, y);
    setCropX(Math.round(nx));
    setCropY(Math.round(ny));
    setCropW(Math.round(Math.abs(x - dragStart.x)));
    setCropH(Math.round(Math.abs(y - dragStart.y)));
  };

  const handleMouseUp = () => setDragging(false);

  const crop = useCallback(() => {
    if (!img) return;
    if (cropW < 1 || cropH < 1) { setError('Crop dimensions must be at least 1px.'); return; }
    setError('');
    const canvas = document.createElement('canvas');
    canvas.width = cropW; canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    canvas.toBlob((blob) => {
      if (blob) setResult(URL.createObjectURL(blob));
    }, 'image/png');
  }, [img, cropX, cropY, cropW, cropH]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result; a.download = `cropped_${file.name}`; a.click();
  };

  const reset = () => {
    setFile(null); setImg(null); setResult(null); setError('');
    setCropX(0); setCropY(0); setCropW(100); setCropH(100);
  };

  return (
    <div className="tool-workspace">
      <p>Crop images by dragging on the preview canvas or entering exact coordinates.</p>

      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <label className="upload-area">
          <input type="file" accept="image/*" onChange={handleFile} hidden />
          <Upload size={24} />
          <span>{file ? file.name : 'Click to upload an image'}</span>
        </label>
      </div>

      {img && (
        <>
          <div className="card" style={{ overflow: 'auto' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>
              <Move size={14} style={{ verticalAlign: 'middle' }} /> Drag on the image to select crop area
            </p>
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ cursor: 'crosshair', display: 'block', maxWidth: '100%' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">X</label>
              <input className="input-field" type="number" min="0" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Y</label>
              <input className="input-field" type="number" min="0" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Width</label>
              <input className="input-field" type="number" min="1" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Height</label>
              <input className="input-field" type="number" min="1" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} />
            </div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={crop}><Crop size={16} /> Crop</button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>Cropped:</strong> {cropW} × {cropH} px</p>
          <img src={result} alt="Cropped" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
          <div className="tool-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
