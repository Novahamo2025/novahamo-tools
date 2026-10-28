import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Eraser, Pipette, AlertTriangle } from 'lucide-react';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export default function ImageBGRemover() {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(30);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pickedColor, setPickedColor] = useState(null);
  const previewRef = useRef(null);
  const scaleRef = useRef(1);

  const handleFile = useCallback(async (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) { setError('Please select a valid image.'); return; }
    setError(''); setFile(f); setResult(null);
    try {
      const image = await loadImage(f);
      setImg(image);
    } catch { setError('Failed to load image.'); }
  }, []);

  useEffect(() => {
    if (!img || !previewRef.current) return;
    const canvas = previewRef.current;
    const maxW = Math.min(500, canvas.parentElement?.clientWidth || 500);
    scaleRef.current = Math.min(1, maxW / img.width);
    canvas.width = img.width * scaleRef.current;
    canvas.height = img.height * scaleRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [img]);

  const pickColor = (e) => {
    if (!previewRef.current || !img) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scaleRef.current);
    const y = Math.floor((e.clientY - rect.top) / scaleRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [px[0], px[1], px[2]].map(c => c.toString(16).padStart(2, '0')).join('');
    setBgColor(hex);
    setPickedColor(hex);
  };

  const removeBackground = useCallback(async () => {
    if (!img) return;
    setProcessing(true); setError('');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const target = hexToRgb(bgColor);
      const tol = tolerance;
      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - target.r;
        const dg = data[i + 1] - target.g;
        const db = data[i + 2] - target.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist <= tol) {
          data[i + 3] = 0;
        } else if (dist <= tol * 1.5) {
          data[i + 3] = Math.round(255 * ((dist - tol) / (tol * 0.5)));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setResult(URL.createObjectURL(blob));
        setProcessing(false);
      }, 'image/png');
    } catch { setError('Failed to process image.'); setProcessing(false); }
  }, [img, bgColor, tolerance]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result; a.download = `nobg_${file.name.replace(/\.[^.]+$/, '')}.png`; a.click();
  };

  const reset = () => {
    setFile(null); setImg(null); setResult(null); setError('');
    setBgColor('#ffffff'); setTolerance(30); setPickedColor(null);
  };

  return (
    <div className="tool-workspace">
      <p>Remove backgrounds from images using color-based removal. Select the background color and adjust tolerance.</p>

      <div className="card">
        <p><AlertTriangle size={16} style={{ verticalAlign: 'middle', color: '#f59e0b' }} /> <strong>Color-Based Removal</strong> — This tool removes pixels matching a specific color within a tolerance range. It works best on solid-color backgrounds. For complex backgrounds (gradients, photos), results will be limited. AI-based background removal requires server-side processing with ML models.</p>
      </div>

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
          <div className="card">
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              <Pipette size={14} style={{ verticalAlign: 'middle' }} /> Click on the image to pick the background color
            </p>
            <canvas ref={previewRef} onClick={pickColor} style={{ cursor: 'crosshair', display: 'block', maxWidth: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Background Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                <input className="input-field" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1 }} />
              </div>
              {pickedColor && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Picked: {pickedColor}</span>}
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
              <label className="form-label">Tolerance: {tolerance}</label>
              <input type="range" min="1" max="150" value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.7 }}>
                <span>Strict</span><span>Loose</span>
              </div>
            </div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={removeBackground} disabled={processing}>
              <Eraser size={16} /> {processing ? 'Processing...' : 'Remove Background'}
            </button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>Result</strong> (transparent pixels shown as checkered pattern):</p>
          <div style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px', borderRadius: 8, display: 'inline-block' }}>
            <img src={result} alt="Result" style={{ maxWidth: '100%', maxHeight: 300, display: 'block' }} />
          </div>
          <div className="tool-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download PNG</button>
          </div>
        </div>
      )}
    </div>
  );
}
