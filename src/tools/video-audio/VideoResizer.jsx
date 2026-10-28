import { useState, useRef } from 'react';
import { Download, Scaling, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoResizer() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [targetWidth, setTargetWidth] = useState(1280);
  const [targetHeight, setTargetHeight] = useState(720);
  const [lockAspect, setLockAspect] = useState(true);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setError(null);
    setVideoUrl(URL.createObjectURL(f));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      const w = videoRef.current.videoWidth || 1280;
      const h = videoRef.current.videoHeight || 720;
      setTargetWidth(w);
      setTargetHeight(h);
    }
  };

  const setPreset = (w, h) => {
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setTargetWidth(w);
    if (lockAspect && videoRef.current && videoRef.current.videoWidth) {
      const ratio = videoRef.current.videoHeight / videoRef.current.videoWidth;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setTargetHeight(h);
    if (lockAspect && videoRef.current && videoRef.current.videoHeight) {
      const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handleResize = async () => {
    if (!videoRef.current || duration <= 0) return;
    if (targetWidth <= 0 || targetHeight <= 0) {
      setError('Please provide valid dimensions.');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth % 2 === 0 ? targetWidth : targetWidth - 1;
    canvas.height = targetHeight % 2 === 0 ? targetHeight : targetHeight - 1;
    const ctx = canvas.getContext('2d');

    const mimeType = 'video/webm';
    const stream = canvas.captureStream(30);

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(video);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);
      if (dest.stream.getAudioTracks().length > 0) {
        stream.addTrack(dest.stream.getAudioTracks()[0]);
      }
    } catch {
      // Audio optional
    }

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
      video.pause();
    };

    video.currentTime = 0;
    video.onseeked = () => {
      mediaRecorder.start();
      video.play();

      const interval = setInterval(() => {
        if (video.currentTime >= duration || video.ended || video.paused) {
          clearInterval(interval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setProgress(Math.min(100, Math.round((video.currentTime / duration) * 100)));
        }
      }, 1000 / 30);
    };
  };

  const handleReset = () => {
    setFile(null);
    setVideoUrl(null);
    setOutputUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video File (MP4, WebM)</label>
        <input
          type="file"
          accept="video/*"
          className="input-field"
          onChange={handleFile}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Standard Presets</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
          <button type="button" className="btn btn-outline" onClick={() => setPreset(1920, 1080)}>1080p Full HD</button>
          <button type="button" className="btn btn-outline" onClick={() => setPreset(1280, 720)}>720p HD</button>
          <button type="button" className="btn btn-outline" onClick={() => setPreset(854, 480)}>480p SD</button>
          <button type="button" className="btn btn-outline" onClick={() => setPreset(640, 360)}>360p Mobile</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Target Width (px)</label>
          <input
            type="number"
            className="input-field"
            value={targetWidth}
            onChange={(e) => handleWidthChange(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Target Height (px)</label>
          <input
            type="number"
            className="input-field"
            value={targetHeight}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
        </div>
      </div>

      {videoUrl && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }}
          />
          {videoRef.current && (
            <p className="form-hint" style={{ marginTop: 'var(--space-1)' }}>
              Original Resolution: {videoRef.current.videoWidth} × {videoRef.current.videoHeight} px
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
        <button className="btn btn-primary" onClick={handleResize} disabled={!videoUrl || processing}>
          <Scaling size={16} /> {processing ? `Resizing Video... ${progress}%` : `Resize to ${targetWidth}×${targetHeight}`}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Resized Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Resolution: {targetWidth} × {targetHeight} | Size: {formatFileSize(outputSize)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'video'}-${targetWidth}x${targetHeight}.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Resized Video
          </a>
        </div>
      )}
    </div>
  );
}
