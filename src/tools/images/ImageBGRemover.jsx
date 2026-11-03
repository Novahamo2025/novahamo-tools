import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Eraser, Pipette, Sparkles, Check, Info } from 'lucide-react';
import { downloadBlob } from '../../utils/download';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  return { r, g, b };
}

function sampleCornerColor(ctx, width, height) {
  try {
    const s = 6;
    const samples = [
      ctx.getImageData(0, 0, Math.min(s, width), Math.min(s, height)).data,
      ctx.getImageData(Math.max(0, width - s), 0, Math.min(s, width), Math.min(s, height)).data,
      ctx.getImageData(0, Math.max(0, height - s), Math.min(s, width), Math.min(s, height)).data,
      ctx.getImageData(Math.max(0, width - s), Math.max(0, height - s), Math.min(s, width), Math.min(s, height)).data,
    ];
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    for (const data of samples) {
      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        count++;
      }
    }
    if (count === 0) return '#ffffff';
    const r = Math.round(totalR / count);
    const g = Math.round(totalG / count);
    const b = Math.round(totalB / count);
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  } catch {
    return '#ffffff';
  }
}

export default function ImageBGRemover() {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(35);
  const [feather, setFeather] = useState(15);
  const [mode, setMode] = useState('smart'); // 'smart' (edge flood fill) or 'global' (chroma key)
  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [colorSource, setColorSource] = useState('Default (White)');
  const [activeTab, setActiveTab] = useState('result'); // 'original' or 'result'

  const previewRef = useRef(null);

  // Clean up object URLs on unmount or new result
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFile = useCallback(async (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setError('');
    setFile(f);
    setResultBlob(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      const image = await loadImage(f);
      setImg(image);
    } catch {
      setError('Failed to load image.');
    }
  }, [resultUrl]);

  // Draw image on preview canvas and auto-detect background color from corners
  useEffect(() => {
    if (!img || !previewRef.current) return;
    const canvas = previewRef.current;
    const containerWidth = Math.min(560, canvas.parentElement?.clientWidth || 560);
    const scale = Math.min(1, containerWidth / img.width);

    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Auto-detect corner color
    const detectedColor = sampleCornerColor(ctx, canvas.width, canvas.height);
    setBgColor(detectedColor);
    setColorSource(`Auto-detected (${detectedColor.toUpperCase()})`);
  }, [img]);

  // Click on canvas to accurately sample background color
  const pickColor = (e) => {
    if (!previewRef.current || !img) return;
    const canvas = previewRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    const px = ctx.getImageData(
      Math.max(0, Math.min(canvas.width - 1, x)),
      Math.max(0, Math.min(canvas.height - 1, y)),
      1,
      1
    ).data;

    const hex = '#' + [px[0], px[1], px[2]].map(c => c.toString(16).padStart(2, '0')).join('');
    setBgColor(hex);
    setColorSource(`Picked from image (${hex.toUpperCase()})`);
  };

  const removeBackground = useCallback(async () => {
    if (!img) return;
    setProcessing(true);
    setError('');

    try {
      // Run processing on an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;
      const totalPixels = w * h;

      const targetRgb = hexToRgb(bgColor);
      const targetR = targetRgb.r;
      const targetG = targetRgb.g;
      const targetB = targetRgb.b;

      const tol = tolerance;
      const softTol = tolerance + feather;

      if (mode === 'global') {
        // Global chroma-key removal
        for (let i = 0; i < data.length; i += 4) {
          const dr = data[i] - targetR;
          const dg = data[i + 1] - targetG;
          const db = data[i + 2] - targetB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          if (dist <= tol) {
            data[i + 3] = 0;
          } else if (dist <= softTol && feather > 0) {
            const ratio = (dist - tol) / feather;
            data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, ratio)));
          }
        }
      } else {
        // Smart Edge Flood-Fill (preserves inside subject matching colors)
        const visited = new Uint8Array(totalPixels);
        const queue = new Int32Array(totalPixels);
        let head = 0;
        let tail = 0;

        const colorDist = (p) => {
          const idx = p * 4;
          const dr = data[idx] - targetR;
          const dg = data[idx + 1] - targetG;
          const db = data[idx + 2] - targetB;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        const checkNeighbor = (np) => {
          if (visited[np] !== 0) return;
          const dist = colorDist(np);
          if (dist <= tol) {
            visited[np] = 1;
            queue[tail++] = np;
          } else if (dist <= softTol && feather > 0) {
            visited[np] = 2; // soft edge
          }
        };

        // Seed outer boundary pixels: top/bottom rows
        for (let x = 0; x < w; x++) {
          const topP = x;
          const btmP = (h - 1) * w + x;
          if (colorDist(topP) <= tol && visited[topP] === 0) {
            visited[topP] = 1;
            queue[tail++] = topP;
          }
          if (colorDist(btmP) <= tol && visited[btmP] === 0) {
            visited[btmP] = 1;
            queue[tail++] = btmP;
          }
        }

        // Seed outer boundary pixels: left/right columns
        for (let y = 0; y < h; y++) {
          const leftP = y * w;
          const rightP = y * w + (w - 1);
          if (colorDist(leftP) <= tol && visited[leftP] === 0) {
            visited[leftP] = 1;
            queue[tail++] = leftP;
          }
          if (colorDist(rightP) <= tol && visited[rightP] === 0) {
            visited[rightP] = 1;
            queue[tail++] = rightP;
          }
        }

        // Process BFS flood fill
        while (head < tail) {
          const p = queue[head++];
          const x = p % w;
          const y = (p / w) | 0;

          if (x > 0) checkNeighbor(p - 1);
          if (x < w - 1) checkNeighbor(p + 1);
          if (y > 0) checkNeighbor(p - w);
          if (y < h - 1) checkNeighbor(p + w);
        }

        // Apply transparency based on flood fill classification
        for (let p = 0; p < totalPixels; p++) {
          if (visited[p] === 1) {
            data[p * 4 + 3] = 0;
          } else if (visited[p] === 2 && feather > 0) {
            const dist = colorDist(p);
            const ratio = Math.max(0, Math.min(1, (dist - tol) / feather));
            data[p * 4 + 3] = Math.round(data[p * 4 + 3] * ratio);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          const newUrl = URL.createObjectURL(blob);
          setResultBlob(blob);
          setResultUrl(newUrl);
          setActiveTab('result');
        } else {
          setError('Failed to create output image.');
        }
        setProcessing(false);
      }, 'image/png');
    } catch (err) {
      setError(`Processing error: ${err.message}`);
      setProcessing(false);
    }
  }, [img, bgColor, tolerance, feather, mode, resultUrl]);

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${baseName}_nobg.png`);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setImg(null);
    setResultBlob(null);
    setResultUrl(null);
    setError('');
    setBgColor('#ffffff');
    setTolerance(35);
    setFeather(15);
    setColorSource('Default (White)');
    setMode('smart');
  };

  return (
    <div className="tool-workspace">
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
        Remove backgrounds from images instantly in your browser. Auto-detects background color or lets you sample with an eye-dropper.
      </p>

      {/* Upload Zone */}
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: 600 }}>Upload Image</label>
        <label className="upload-area" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px', gap: '8px' }}>
          <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFile} hidden />
          <Upload size={32} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            {file ? file.name : 'Click or drop an image here'}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Supports PNG, JPG, and WebP
          </span>
        </label>
      </div>

      {img && (
        <>
          {/* Controls & Configuration */}
          <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pipette size={18} style={{ color: 'var(--color-primary)' }} />
                <strong style={{ fontSize: '0.9375rem' }}>Color & Removal Settings</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Tip: Click anywhere on the image below to pick that background color
              </span>
            </div>

            {/* Mode selection */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ marginBottom: '6px', fontSize: '0.8125rem' }}>Removal Algorithm</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${mode === 'smart' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setMode('smart')}
                  style={{ justifyContent: 'flex-start', padding: '8px 12px', height: 'auto', textAlign: 'left' }}
                >
                  <Sparkles size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Smart Edge Removal (Recommended)</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 'normal' }}>Cleans outer background while protecting matching colors inside subject</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`btn ${mode === 'global' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setMode('global')}
                  style={{ justifyContent: 'flex-start', padding: '8px 12px', height: 'auto', textAlign: 'left' }}
                >
                  <Eraser size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Global Color Key</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 'normal' }}>Removes target color everywhere (great for logos, green-screen, graphics)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Color Swatch & Pick Input */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Target Background Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      setColorSource('Custom color selected');
                    }}
                    style={{ width: '42px', height: '38px', padding: '2px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  />
                  <input
                    className="input-field"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      setColorSource('Manual HEX');
                    }}
                    style={{ flex: 1, fontFamily: 'monospace', textTransform: 'uppercase' }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Source: <strong>{colorSource}</strong>
                </div>
              </div>

              {/* Tolerance */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Color Tolerance</label>
                  <span style={{ fontWeight: 600 }}>{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                  <span>Strict (5)</span>
                  <span>Balanced (35)</span>
                  <span>Aggressive (150)</span>
                </div>
              </div>

              {/* Feather / Edge Smoothness */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Edge Smoothing (Feather)</label>
                  <span style={{ fontWeight: 600 }}>{feather}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                  <span>Hard Cut (0px)</span>
                  <span>Soft (15px)</span>
                  <span>Max Blend (40px)</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="tool-actions" style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-primary"
                onClick={removeBackground}
                disabled={processing}
                style={{ minWidth: '180px' }}
              >
                <Eraser size={17} /> {processing ? 'Removing Background...' : 'Remove Background'}
              </button>
              <button className="btn btn-secondary" onClick={reset}>
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Interactive Workspace Preview */}
          <div className="card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${activeTab === 'original' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                  onClick={() => setActiveTab('original')}
                >
                  <Pipette size={14} /> Source Canvas (Click to sample)
                </button>
                {resultUrl && (
                  <button
                    type="button"
                    className={`btn ${activeTab === 'result' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                    onClick={() => setActiveTab('result')}
                  >
                    <Check size={14} /> Cutout Result
                  </button>
                )}
              </div>

              {resultUrl && (
                <button className="btn btn-primary btn-sm" onClick={handleDownload}>
                  <Download size={14} /> Download PNG
                </button>
              )}
            </div>

            {/* Original Canvas */}
            <div style={{ display: activeTab === 'original' ? 'block' : 'none', textAlign: 'center' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
                <canvas
                  ref={previewRef}
                  onClick={pickColor}
                  title="Click anywhere to sample that color as background"
                  style={{ cursor: 'crosshair', display: 'block', maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                🎯 Crosshair active: Click any spot on the photo to target its color
              </p>
            </div>

            {/* Cutout Result */}
            {resultUrl && (
              <div style={{ display: activeTab === 'result' ? 'block' : 'none', textAlign: 'center' }}>
                <div style={{
                  background: 'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%) 50% / 20px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  display: 'inline-block',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  padding: '8px'
                }}>
                  <img
                    src={resultUrl}
                    alt="Background Removed Result"
                    style={{ maxWidth: '100%', maxHeight: '480px', display: 'block', margin: '0 auto' }}
                  />
                </div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <button className="btn btn-primary" onClick={handleDownload}>
                    <Download size={16} /> Download Cutout PNG
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-4)', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {/* Educational notice */}
      <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-bg)', border: '1px solid var(--color-border)', fontSize: '0.8125rem', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ color: 'var(--color-text-secondary)' }}>
          <strong>Private In-Browser Processing:</strong> All image processing occurs strictly on your device using HTML5 Canvas and typed BFS flood-fill. No images are ever uploaded to an external server. For optimal results on studio photos, use <em>Smart Edge Removal</em>.
        </div>
      </div>
    </div>
  );
}
