import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { formatFileSize } from '../../utils/download';

export default function PhotoSizeReducer() {
  const [file, setFile] = useState(null);
  const [targetKB, setTargetKB] = useState(100);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState('');

  const loadImg = (f) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(f); });

  const reduce = async () => {
    if (!file || targetKB <= 0) return;
    setProcessing(true); setLog(''); setResultUrl(null);
    try {
      const img = await loadImg(file);
      const targetBytes = targetKB * 1024;
      let w = img.width, h = img.height, quality = 0.9;
      let blob = null, attempts = 0;

      while (attempts < 30) {
        attempts++;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        setLog(`Attempt ${attempts}: quality=${(quality * 100).toFixed(0)}%, ${Math.round(w)}×${Math.round(h)}, size=${formatFileSize(blob.size)}`);
        if (blob.size <= targetBytes) break;
        if (quality > 0.1) { quality -= 0.1; }
        else { w *= 0.9; h *= 0.9; quality = 0.8; }
      }

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      if (blob.size > targetBytes) {
        setLog(prev => prev + '\n⚠️ Could not reach target size. This is the smallest achievable result.');
      } else {
        setLog(prev => prev + '\n✅ Target size reached!');
      }
    } catch (err) {
      setLog('Error: ' + err.message);
    }
    setProcessing(false);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files?.[0])} />
        {file && <p className="form-hint">Original: {formatFileSize(file.size)}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Target Size (KB)</label>
        <input type="number" className="input-field" min={1} value={targetKB} onChange={e => setTargetKB(Number(e.target.value))} />
        <p className="form-hint">Some very small targets may be impossible to achieve while keeping the image usable.</p>
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={reduce} disabled={!file || processing}>{processing ? 'Processing...' : 'Reduce Size'}</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); setLog(''); }}><RotateCcw size={16} /> Reset</button>
      </div>
      {log && <pre className="code-block" style={{ marginTop: 'var(--space-4)', whiteSpace: 'pre-wrap', fontSize: '0.8125rem' }}>{log}</pre>}
      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 'var(--space-3)' }}>Result: <strong>{formatFileSize(resultSize)}</strong></p>
          <img src={resultUrl} alt="Reduced" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)' }} />
          <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = resultUrl; a.download = 'reduced.jpg'; a.click(); }} style={{ marginTop: 'var(--space-4)' }}><Download size={16} /> Download</button>
        </div>
      )}
    </div>
  );
}
