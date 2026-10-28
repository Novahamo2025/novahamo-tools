import { useState, useCallback } from 'react';
import { Upload, Download, RotateCcw, Zap } from 'lucide-react';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState('');

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    setError('');
    setFile(f);
    setResult(null);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setError('');
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResult(URL.createObjectURL(blob));
          setResultSize(blob.size);
        }
      }, 'image/jpeg', quality / 100);
    } catch { setError('Failed to compress image.'); }
  }, [file, quality]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `compressed_${file.name.replace(/\.[^.]+$/, '')}.jpg`;
    a.click();
  };

  const reset = () => {
    setFile(null); setResult(null); setError(''); setQuality(80); setResultSize(0);
  };

  const savings = file && resultSize ? ((1 - resultSize / file.size) * 100).toFixed(1) : 0;

  return (
    <div className="tool-workspace">
      <p>Compress images by adjusting JPEG quality. Lower quality means smaller file size.</p>

      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <label className="upload-area">
          <input type="file" accept="image/*" onChange={handleFile} hidden />
          <Upload size={24} />
          <span>{file ? file.name : 'Click to upload an image'}</span>
        </label>
      </div>

      {file && (
        <>
          <div className="card">
            <p><strong>Original Size:</strong> {(file.size / 1024).toFixed(1)} KB</p>
          </div>

          <div className="form-group">
            <label className="form-label">Quality: {quality}%</label>
            <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.7 }}>
              <span>1% (Smallest)</span>
              <span>100% (Best Quality)</span>
            </div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={compress}><Zap size={16} /> Compress</button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>Compressed Size:</strong> {(resultSize / 1024).toFixed(1)} KB</p>
          <p><strong>Savings:</strong> {savings}%</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Original ({(file.size / 1024).toFixed(1)} KB)</p>
              <img src={URL.createObjectURL(file)} alt="Original" style={{ maxWidth: 250, maxHeight: 200, borderRadius: 8 }} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Compressed ({(resultSize / 1024).toFixed(1)} KB)</p>
              <img src={result} alt="Compressed" style={{ maxWidth: 250, maxHeight: 200, borderRadius: 8 }} />
            </div>
          </div>
          <div className="tool-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
