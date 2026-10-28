import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, RotateCcw, Image } from 'lucide-react';

export default function SignatureReducer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalInfo, setOriginalInfo] = useState(null);
  const [targetWidth, setTargetWidth] = useState(300);
  const [targetHeight, setTargetHeight] = useState(100);
  const [targetSizeKB, setTargetSizeKB] = useState(50);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError('');
    setFile(f);
    setResult(null);

    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalInfo({ width: img.width, height: img.height, size: f.size, name: f.name });
    };
    img.src = url;
  }, []);

  const compress = useCallback(async () => {
    if (!file || !originalInfo) return;
    setProcessing(true);
    setError('');

    try {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const targetBytes = targetSizeKB * 1024;
      let quality = 0.92;
      let blob = null;

      // Iterative compression
      for (let i = 0; i < 20; i++) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob.size <= targetBytes || quality <= 0.05) break;
        quality -= 0.05;
      }

      // If still too large, try PNG
      if (blob.size > targetBytes) {
        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (pngBlob.size < blob.size) blob = pngBlob;
      }

      const resultUrl = URL.createObjectURL(blob);
      setResult({ url: resultUrl, blob, width: targetWidth, height: targetHeight, size: blob.size, quality: Math.round(quality * 100) });
    } catch (err) {
      setError('Failed to process image: ' + err.message);
    }
    setProcessing(false);
  }, [file, originalInfo, targetWidth, targetHeight, targetSizeKB]);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `signature_reduced.${result.blob.type.includes('png') ? 'png' : 'jpg'}`;
    a.click();
  }, [result]);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null); setPreview(null); setOriginalInfo(null);
    setResult(null); setError(''); setProcessing(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="tool-workspace">
      <p>Upload a signature image and reduce its dimensions and file size for email signatures, documents, or online forms.</p>

      <div className="upload-area" onClick={() => fileRef.current?.click()}>
        <Upload size={32} />
        <p>{file ? file.name : 'Click to upload signature image'}</p>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {originalInfo && (
        <div className="card">
          <h3>Original</h3>
          <p>Dimensions: {originalInfo.width} × {originalInfo.height}px | Size: {formatSize(originalInfo.size)}</p>
          {preview && <img src={preview} alt="Original" style={{ maxWidth: '100%', maxHeight: '150px', border: '1px solid var(--border-color)' }} />}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Target Width (px)</label>
          <input className="input-field" type="number" min={10} max={2000} value={targetWidth} onChange={e => setTargetWidth(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Target Height (px)</label>
          <input className="input-field" type="number" min={10} max={2000} value={targetHeight} onChange={e => setTargetHeight(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Target Size (KB)</label>
          <input className="input-field" type="number" min={1} max={5000} value={targetSizeKB} onChange={e => setTargetSizeKB(Number(e.target.value))} />
        </div>
      </div>

      {error && <p style={{ color: '#e74c3c' }}>{error}</p>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={compress} disabled={!file || processing}>
          <Image size={16} /> {processing ? 'Processing...' : 'Reduce Signature'}
        </button>
        <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card">
            <h3>Result</h3>
            <p>Dimensions: {result.width} × {result.height}px | Size: {formatSize(result.size)} | Quality: {result.quality}%</p>
            <p>Reduction: {originalInfo ? Math.round((1 - result.size / originalInfo.size) * 100) : 0}% smaller</p>
            <img src={result.url} alt="Reduced" style={{ maxWidth: '100%', maxHeight: '150px', border: '1px solid var(--border-color)' }} />
          </div>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
