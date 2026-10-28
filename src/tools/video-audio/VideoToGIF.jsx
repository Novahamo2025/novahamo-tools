import { useState, useRef, useEffect } from 'react';
import { Download, Film, RotateCcw, AlertCircle, Play, Pause } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoToGIF() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [clipLength, setClipLength] = useState(3); // 3 seconds clip
  const [fps, setFps] = useState(10);
  const [frames, setFrames] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const animIntervalRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFrames([]);
    setError(null);
    setVideoUrl(URL.createObjectURL(f));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration);
      setDuration(dur);
      setStartTime(0);
    }
  };

  const handleExtractFrames = async () => {
    if (!videoRef.current || duration <= 0) return;
    setProcessing(true);
    setFrames([]);
    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const targetWidth = Math.min(480, video.videoWidth || 480);
    const targetHeight = Math.round(targetWidth * ((video.videoHeight || 360) / (video.videoWidth || 480)));
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    const totalFrames = Math.round(clipLength * fps);
    const frameInterval = clipLength / totalFrames;
    const extracted = [];

    for (let i = 0; i < totalFrames; i++) {
      const seekTime = startTime + i * frameInterval;
      if (seekTime > duration) break;

      await new Promise((resolve) => {
        video.currentTime = seekTime;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          extracted.push(canvas.toDataURL('image/png', 0.85));
          resolve();
        };
      });
    }

    setFrames(extracted);
    setCurrentFrameIdx(0);
    setProcessing(false);
  };

  useEffect(() => {
    if (frames.length > 0 && isPlaying) {
      animIntervalRef.current = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % frames.length);
      }, 1000 / fps);
    }
    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [frames, isPlaying, fps]);

  const handleDownloadAllFrames = async () => {
    if (frames.length === 0) return;
    const zip = new JSZip();
    frames.forEach((dataUrl, idx) => {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      zip.file(`frame_${String(idx + 1).padStart(3, '0')}.png`, base64Data, { base64: true });
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${file ? file.name.replace(/\.[^/.]+$/, '') : 'animation'}-frames.zip`);
  };

  const handleReset = () => {
    setFile(null);
    setVideoUrl(null);
    setFrames([]);
    setCurrentFrameIdx(0);
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
        <p className="form-hint">Converts video segment into high-speed looping animation frames.</p>
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
        </div>
      )}

      {duration > 0 && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Time: {startTime}s</label>
              <input
                type="range"
                min="0"
                max={Math.max(0, duration - 1)}
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Duration: {clipLength}s</label>
              <input
                type="range"
                min="1"
                max="6"
                value={clipLength}
                onChange={(e) => setClipLength(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Frame Rate: {fps} FPS</label>
              <select className="select-field" value={fps} onChange={(e) => setFps(Number(e.target.value))}>
                <option value={8}>8 FPS (Compact)</option>
                <option value={10}>10 FPS (Standard)</option>
                <option value={15}>15 FPS (Smooth)</option>
              </select>
            </div>
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
        <button className="btn btn-primary" onClick={handleExtractFrames} disabled={!videoUrl || processing}>
          <Film size={16} /> {processing ? 'Capturing Animation Frames...' : 'Generate Animated Sequence'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset} disabled={processing}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {frames.length > 0 && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Animated Preview ({frames.length} frames @ {fps} fps)
          </h3>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <img
              src={frames[currentFrameIdx]}
              alt={`Frame ${currentFrameIdx + 1}`}
              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <div style={{ marginTop: 'var(--space-2)' }}>
              <button className="btn btn-ghost" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause Loop' : 'Play Loop'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleDownloadAllFrames}>
              <Download size={16} /> Download Animation Frame Pack (ZIP)
            </button>
            <a
              href={frames[0]}
              download="preview-frame.png"
              className="btn btn-outline"
            >
              <Download size={16} /> Download Current Frame
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
