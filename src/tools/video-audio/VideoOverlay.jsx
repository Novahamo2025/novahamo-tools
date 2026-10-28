import { useState, useRef } from 'react';
import { Download, Stamp, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoOverlay() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayImgElement, setOverlayImgElement] = useState(null);
  const [position, setPosition] = useState('bottom-right'); // top-left, top-right, center, bottom-left, bottom-right
  const [opacity, setOpacity] = useState(0.8);
  const [overlayScale, setOverlayScale] = useState(25); // 25% of video width
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  const handleVideoFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoFile(f);
    setOutputUrl(null);
    setError(null);
    setVideoUrl(URL.createObjectURL(f));
  };

  const handleOverlayFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setOverlayImage(f);
    const img = new Image();
    img.onload = () => setOverlayImgElement(img);
    img.src = URL.createObjectURL(f);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProcess = async () => {
    if (!videoRef.current || duration <= 0 || !overlayImgElement) {
      setError('Please provide both a video and an overlay watermark image.');
      return;
    }

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

    // Calculate watermark position
    const oWidth = Math.round(canvas.width * (overlayScale / 100));
    const oHeight = Math.round(oWidth * (overlayImgElement.naturalHeight / overlayImgElement.naturalWidth));
    const padding = 20;

    let ox = padding;
    let oy = padding;

    if (position === 'top-right') {
      ox = canvas.width - oWidth - padding;
      oy = padding;
    } else if (position === 'bottom-left') {
      ox = padding;
      oy = canvas.height - oHeight - padding;
    } else if (position === 'bottom-right') {
      ox = canvas.width - oWidth - padding;
      oy = canvas.height - oHeight - padding;
    } else if (position === 'center') {
      ox = (canvas.width - oWidth) / 2;
      oy = (canvas.height - oHeight) / 2;
    }

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
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(overlayImgElement, ox, oy, oWidth, oHeight);
          ctx.restore();
          setProgress(Math.min(100, Math.round((video.currentTime / duration) * 100)));
        }
      }, 1000 / 30);
    };
  };

  const handleReset = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setOverlayImage(null);
    setOverlayImgElement(null);
    setOutputUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">1. Upload Video File</label>
          <input
            type="file"
            accept="video/*"
            className="input-field"
            onChange={handleVideoFile}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">2. Upload Watermark / Logo Image</label>
          <input
            type="file"
            accept="image/*"
            className="input-field"
            onChange={handleOverlayFile}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Position</label>
          <select className="select-field" value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="center">Center</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Overlay Opacity: {Math.round(opacity * 100)}%</label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Logo Size: {overlayScale}%</label>
          <input
            type="range"
            min="10"
            max="60"
            value={overlayScale}
            onChange={(e) => setOverlayScale(parseInt(e.target.value))}
            style={{ width: '100%' }}
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
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleProcess} disabled={!videoUrl || !overlayImgElement || processing}>
          <Stamp size={16} /> {processing ? `Applying Watermark... ${progress}%` : 'Apply Watermark to Video'}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Watermarked Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Output Size: {formatFileSize(outputSize)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${videoFile ? videoFile.name.replace(/\.[^/.]+$/, '') : 'video'}-watermarked.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Watermarked Video
          </a>
        </div>
      )}
    </div>
  );
}
