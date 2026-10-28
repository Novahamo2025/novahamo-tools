import { useState, useRef } from 'react';
import { Download, Film, RotateCcw, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export default function GIFToMP4() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [duration, setDuration] = useState(4); // default 4 seconds video loop
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const imgRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setError(null);
    setImageUrl(URL.createObjectURL(f));
  };

  const handleConvert = async () => {
    if (!imgRef.current) return;
    setProcessing(true);
    setProgress(0);
    setError(null);

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const width = img.naturalWidth || 480;
    const height = img.naturalHeight || 480;
    canvas.width = width % 2 === 0 ? width : width - 1;
    canvas.height = height % 2 === 0 ? height : height - 1;
    const ctx = canvas.getContext('2d');

    let mimeType = 'video/webm';
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    }

    const stream = canvas.captureStream(30);
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      setOutputSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
      setProcessing(false);
    };

    mediaRecorder.start();

    const fps = 30;
    const totalFrames = duration * fps;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pct = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
      setProgress(pct);

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }
    }, 1000 / fps);
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setOutputUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Animated GIF File</label>
        <input
          type="file"
          accept="image/gif,image/*"
          className="input-field"
          onChange={handleFile}
        />
        <p className="form-hint">Converts animated GIFs into lightweight video format for social media and web embedding.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Video Loop Length: {duration} seconds</label>
        <input
          type="range"
          min="2"
          max="10"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {imageUrl && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <img
            ref={imgRef}
            src={imageUrl}
            alt="GIF Source"
            style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }}
          />
          {file && (
            <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
              Source: {file.name} ({formatFileSize(file.size)})
            </p>
          )}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleConvert} disabled={!imageUrl || processing}>
          <Film size={16} /> {processing ? `Encoding Video... ${progress}%` : 'Convert GIF to Video'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset} disabled={processing}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {processing && (
        <div style={{ margin: 'var(--space-4) 0' }}>
          <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--color-primary)',
                transition: 'width 0.2s linear',
              }}
            />
          </div>
        </div>
      )}

      {outputUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Converted Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Video Size: {formatFileSize(outputSize)} | Duration: {duration}s
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls loop autoPlay muted style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'animation'}.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Video File
          </a>
        </div>
      )}
    </div>
  );
}
