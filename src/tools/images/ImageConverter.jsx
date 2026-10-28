import { useState, useCallback, useMemo } from 'react';
import { Upload, Download, RotateCcw, RefreshCw } from 'lucide-react';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

const FORMAT_MAP = {
  jpg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG' },
  png: { mime: 'image/png', ext: 'png', label: 'PNG' },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' },
};

function detectConversion() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('jpg-to-png') || path.includes('jpeg-to-png')) return { from: 'jpg', to: 'png' };
  if (path.includes('png-to-jpg') || path.includes('png-to-jpeg')) return { from: 'png', to: 'jpg' };
  if (path.includes('webp-to-jpg') || path.includes('webp-to-jpeg')) return { from: 'webp', to: 'jpg' };
  if (path.includes('jpg-to-webp') || path.includes('jpeg-to-webp')) return { from: 'jpg', to: 'webp' };
  if (path.includes('webp-to-png')) return { from: 'webp', to: 'png' };
  if (path.includes('png-to-webp')) return { from: 'png', to: 'webp' };
  return null;
}

export default function ImageConverter() {
  const detected = useMemo(() => detectConversion(), []);
  const [fromFormat, setFromFormat] = useState(detected?.from || 'jpg');
  const [toFormat, setToFormat] = useState(detected?.to || 'png');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState('');

  const fromInfo = FORMAT_MAP[fromFormat] || FORMAT_MAP.jpg;
  const toInfo = FORMAT_MAP[toFormat] || FORMAT_MAP.png;

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    setError(''); setFile(f); setResult(null);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setError('');
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (toInfo.mime !== 'image/png') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResult(URL.createObjectURL(blob));
          setResultSize(blob.size);
        } else {
          setError('Conversion failed. Your browser may not support this format.');
        }
      }, toInfo.mime, 0.92);
    } catch { setError('Failed to convert image.'); }
  }, [file, toInfo]);

  const download = () => {
    if (!result) return;
    const name = file.name.replace(/\.[^.]+$/, '') + '.' + toInfo.ext;
    const a = document.createElement('a');
    a.href = result; a.download = name; a.click();
  };

  const reset = () => {
    setFile(null); setResult(null); setError(''); setResultSize(0);
  };

  const acceptTypes = fromInfo.mime;

  return (
    <div className="tool-workspace">
      <p>Convert images between formats. {detected ? `Converting ${fromInfo.label} to ${toInfo.label}.` : 'Select source and target formats below.'}</p>

      {!detected && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
            <label className="form-label">From</label>
            <select className="input-field" value={fromFormat} onChange={(e) => setFromFormat(e.target.value)}>
              <option value="jpg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <RefreshCw size={20} style={{ marginBottom: '1.2rem', opacity: 0.5 }} />
          <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
            <label className="form-label">To</label>
            <select className="input-field" value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
              <option value="jpg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Upload {fromInfo.label} Image</label>
        <label className="upload-area">
          <input type="file" accept={`${acceptTypes},image/*`} onChange={handleFile} hidden />
          <Upload size={24} />
          <span>{file ? file.name : `Click to upload a ${fromInfo.label} image`}</span>
        </label>
      </div>

      {file && (
        <>
          <div className="card">
            <p><strong>File:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
          </div>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={convert}><RefreshCw size={16} /> Convert to {toInfo.label}</button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>Converted:</strong> {toInfo.label} — {(resultSize / 1024).toFixed(1)} KB</p>
          <img src={result} alt="Converted" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
          <div className="tool-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download {toInfo.label}</button>
          </div>
        </div>
      )}
    </div>
  );
}
