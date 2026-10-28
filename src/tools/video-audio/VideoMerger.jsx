import { useState, useRef } from 'react';
import { Download, Layers, RotateCcw, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoMerger() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentFileIdx, setCurrentFileIdx] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
    setOutputUrl(null);
    setError(null);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setOutputUrl(null);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...files];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setFiles(updated);
  };

  const moveDown = (idx) => {
    if (idx === files.length - 1) return;
    const updated = [...files];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setFiles(updated);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 video files to combine.');
      return;
    }

    setProcessing(true);
    setCurrentFileIdx(0);
    setError(null);

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const mimeType = 'video/webm';
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

    // Play each video sequentially
    for (let i = 0; i < files.length; i++) {
      setCurrentFileIdx(i);
      const file = files[i];
      const video = document.createElement('video');
      video.muted = true;
      video.src = URL.createObjectURL(file);

      await new Promise((resolve) => {
        video.onloadeddata = () => resolve();
      });

      await new Promise((resolve) => {
        video.play();
        const interval = setInterval(() => {
          if (video.ended || video.paused) {
            clearInterval(interval);
            resolve();
          } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw centered maintaining aspect ratio
            const vw = video.videoWidth || 1280;
            const vh = video.videoHeight || 720;
            const hRatio = canvas.width / vw;
            const vRatio = canvas.height / vh;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (canvas.width - vw * ratio) / 2;
            const centerShift_y = (canvas.height - vh * ratio) / 2;
            ctx.drawImage(video, 0, 0, vw, vh, centerShift_x, centerShift_y, vw * ratio, vh * ratio);
          }
        }, 1000 / 30);
      });
    }

    if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const handleReset = () => {
    setFiles([]);
    setOutputUrl(null);
    setProcessing(false);
    setCurrentFileIdx(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video Clips to Merge (MP4, WebM)</label>
        <input
          type="file"
          accept="video/*"
          multiple
          className="input-field"
          onChange={handleFiles}
        />
        <p className="form-hint">Combine multiple video clips into one seamlessly concatenated video file.</p>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
            Video Clips Queue ({files.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {files.map((f, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  border: processing && currentFileIdx === idx ? '2px solid var(--color-primary)' : undefined,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, marginRight: 'var(--space-2)' }}>#{idx + 1}</span>
                  <span>{f.name}</span>
                  <span style={{ marginLeft: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    ({formatFileSize(f.size)})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button className="btn btn-ghost" onClick={() => moveUp(idx)} disabled={idx === 0 || processing}>
                    <ArrowUp size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => moveDown(idx)} disabled={idx === files.length - 1 || processing}>
                    <ArrowDown size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => removeFile(idx)} disabled={processing} style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleMerge} disabled={files.length < 2 || processing}>
          <Layers size={16} /> {processing ? `Merging Clip ${currentFileIdx + 1} of ${files.length}...` : 'Merge Video Clips'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset} disabled={processing}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {outputUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Merged Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Output Size: {formatFileSize(outputSize)} | Clips Combined: {files.length}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download="novahamo-merged-video.webm"
            className="btn btn-primary"
          >
            <Download size={16} /> Download Merged Video
          </a>
        </div>
      )}
    </div>
  );
}
