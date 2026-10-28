import { useState } from 'react';
import { Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { formatFileSize } from '../../utils/download';

export default function BulkImageResizer() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('percentage');
  const [percent, setPercent] = useState(50);
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  const processImages = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    const processed = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = await new Promise((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = rej;
        image.src = URL.createObjectURL(file);
      });

      let w = img.width;
      let h = img.height;

      if (mode === 'percentage') {
        w = Math.round(img.width * (percent / 100));
        h = Math.round(img.height * (percent / 100));
      } else {
        w = targetWidth;
        h = targetHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
      processed.push({
        name: file.name.replace(/\.[^/.]+$/, '') + `_${w}x${h}.jpg`,
        blob,
        url: URL.createObjectURL(blob),
        w,
        h,
        size: blob.size,
      });

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setResults(processed);
    setProcessing(false);
  };

  const downloadAllZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach(item => {
      zip.file(item.name, item.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'resized-images.zip');
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Multiple Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="input-field"
          onChange={e => {
            setFiles(Array.from(e.target.files || []));
            setResults([]);
          }}
        />
        {files.length > 0 && <p className="form-hint">{files.length} images selected</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Resize Mode</label>
          <select className="select-field" value={mode} onChange={e => setMode(e.target.value)}>
            <option value="percentage">By Percentage (%)</option>
            <option value="exact">Exact Dimensions (px)</option>
          </select>
        </div>

        {mode === 'percentage' ? (
          <div className="form-group">
            <label className="form-label">Percentage: {percent}%</label>
            <input type="range" min={10} max={200} value={percent} onChange={e => setPercent(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Width (px)</label>
              <input type="number" className="input-field" value={targetWidth} onChange={e => setTargetWidth(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Height (px)</label>
              <input type="number" className="input-field" value={targetHeight} onChange={e => setTargetHeight(Number(e.target.value))} />
            </div>
          </>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={processImages} disabled={files.length === 0 || processing}>
          {processing ? `Processing (${progress}%)...` : `Resize ${files.length} Images`}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFiles([]); setResults([]); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {results.length > 0 && (
        <div className="tool-result">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontWeight: 600 }}>{results.length} Images Resized</span>
            <button className="btn btn-primary btn-sm" onClick={downloadAllZip}>
              <Download size={14} /> Download All (ZIP)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {results.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                <img src={item.url} alt={item.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: 'var(--space-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {item.w}×{item.h} ({formatFileSize(item.size)})
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 'var(--space-2)' }}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.download = item.name;
                    a.click();
                  }}
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
