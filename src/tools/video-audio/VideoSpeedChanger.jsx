import { useState, useRef } from 'react';
import { Download, FastForward, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoSpeedChanger() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [speed, setSpeed] = useState(1.5);
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
    }
  };

  const speeds = [0.25, 0.5, 0.75, 1.25, 1.5, 2.0, 3.0];

  const handleProcess = async () => {
    if (!videoRef.current || duration <= 0) return;
    setProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
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
      video.pause();
      video.playbackRate = 1.0;
    };

    video.currentTime = 0;
    video.playbackRate = speed;

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
    setSpeed(1.5);
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
        <label className="form-label">Playback Speed: {speed}x</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              className={`btn ${speed === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
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
          <p className="form-hint" style={{ marginTop: 'var(--space-1)' }}>
            Original: {formatDuration(duration * 1000)} → Est. New Duration: {formatDuration((duration / speed) * 1000)}
          </p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleProcess} disabled={!videoUrl || processing}>
          <FastForward size={16} /> {processing ? `Adjusting Speed... ${progress}%` : `Export at ${speed}x Speed`}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Speed Adjusted Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Speed Factor: {speed}x | Size: {formatFileSize(outputSize)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'video'}-${speed}x.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download {speed}x Video
          </a>
        </div>
      )}
    </div>
  );
}
