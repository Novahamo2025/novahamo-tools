import { useState, useCallback, useRef } from 'react';
import { Upload, Download, RotateCcw, Lock, Unlock, Image as ImageIcon } from 'lucide-react';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [origDims, setOrigDims] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [result, setResult] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState('');
  const aspectRef = useRef(1);

  const handleFile = useCallback(async (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    setError('');
    setFile(f);
    setResult(null);
    try {
      const img = await loadImage(f);
      setOrigDims({ width: img.width, height: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
      setPercentage('100');
      aspectRef.current = img.width / img.height;
      setPreview(img.src);
    } catch { setError('Failed to load image.'); }
  }, []);

  const handleWidthChange = (val) => {
    setWidth(val);
    setPercentage('');
    if (lockAspect && val) {
      setHeight(String(Math.round(Number(val) / aspectRef.current)));
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    setPercentage('');
    if (lockAspect && val) {
      setWidth(String(Math.round(Number(val) * aspectRef.current)));
    }
  };

  const handlePercentageChange = (val) => {
    setPercentage(val);
    if (val) {
      const p = Number(val) / 100;
      setWidth(String(Math.round(origDims.width * p)));
      setHeight(String(Math.round(origDims.height * p)));
    }
  };

  const resize = useCallback(async () => {
    if (!file) return;
    setError('');
    try {
      const img = await loadImage(file);
      const w = parseInt(width) || img.width;
      const h = parseInt(height) || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResult(url);
          setResultSize(blob.size);
        }
      }, file.type.includes('png') ? 'image/png' : 'image/jpeg', 0.92);
    } catch { setError('Failed to resize image.'); }
  }, [file, width, height]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `resized_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null); setPreview(null); setResult(null); setError('');
    setWidth(''); setHeight(''); setPercentage('');
    setOrigDims({ width: 0, height: 0 }); setResultSize(0);
  };

  return (
    <div className="tool-workspace">
      <p>Resize images by specifying exact dimensions or a percentage scale. Optionally maintain the aspect ratio.</p>

      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <label className="upload-area">
          <input type="file" accept="image/*" onChange={handleFile} hidden />
          <Upload size={24} />
          <span>{file ? file.name : 'Click to upload an image'}</span>
        </label>
      </div>

      {preview && (
        <>
          <div className="card">
            <p><strong>Original:</strong> {origDims.width} × {origDims.height} px | {(file.size / 1024).toFixed(1)} KB</p>
          </div>

          <div className="form-group">
            <label className="form-label">Resize by Percentage (%)</label>
            <input className="input-field" type="number" min="1" max="1000" value={percentage} onChange={(e) => handlePercentageChange(e.target.value)} placeholder="e.g. 50" />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Width (px)</label>
              <input className="input-field" type="number" min="1" value={width} onChange={(e) => handleWidthChange(e.target.value)} />
            </div>
            <button className="btn btn-secondary" onClick={() => setLockAspect(!lockAspect)} title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'} style={{ marginBottom: '1rem' }}>
              {lockAspect ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Height (px)</label>
              <input className="input-field" type="number" min="1" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
            </div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={resize}><ImageIcon size={16} /> Resize</button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>Resized:</strong> {width} × {height} px | {(resultSize / 1024).toFixed(1)} KB</p>
          <img src={result} alt="Resized" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
          <div className="tool-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
