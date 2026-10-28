import { useState, useRef } from 'react';
import { Download, Minimize2, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoCompressor() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [compressionMode, setCompressionMode] = useState('balanced'); // high, balanced, light
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

  const handleCompress = async () => {
    if (!videoRef.current || duration <= 0) return;
    setProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    let scale = 1.0;
    let bitrate = 1000000; // 1 Mbps

    if (compressionMode === 'high') {
      scale = 0.5;
      bitrate = 500000; // 500 kbps
    } else if (compressionMode === 'balanced') {
      scale = 0.75;
      bitrate = 1000000; // 1 Mbps
    } else {
      scale = 1.0;
      bitrate = 1800000; // 1.8 Mbps
    }

    const vw = Math.round((video.videoWidth || 640) * scale);
    const vh = Math.round((video.videoHeight || 360) * scale);
    canvas.width = vw % 2 === 0 ? vw : vw - 1;
    canvas.height = vh % 2 === 0 ? vh : vh - 1;

    const ctx = canvas.getContext('2d');
    const mimeType = 'video/webm';
    const stream = canvas.captureStream(24);

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
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });

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
      }, 1000 / 24);
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
        <label className="form-label">Compression Profile</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className={`btn ${compressionMode === 'high' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCompressionMode('high')}
          >
            Max Compression (Smallest Size)
          </button>
          <button
            type="button"
            className={`btn ${compressionMode === 'balanced' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCompressionMode('balanced')}
          >
            Balanced (Recommended)
          </button>
          <button
            type="button"
            className={`btn ${compressionMode === 'light' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCompressionMode('light')}
          >
            Light Compression (Best Quality)
          </button>
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
          {file && (
            <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
              Original File Size: {formatFileSize(file.size)} | Length: {formatDuration(duration * 1000)}
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
        <button className="btn btn-primary" onClick={handleCompress} disabled={!videoUrl || processing}>
          <Minimize2 size={16} /> {processing ? `Compressing Video... ${progress}%` : 'Compress Video'}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Compressed Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Original: {formatFileSize(file ? file.size : 0)} → Compressed: {formatFileSize(outputSize)}
            {file && file.size > outputSize && (
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, marginLeft: 8 }}>
                ({Math.round(((file.size - outputSize) / file.size) * 100)}% smaller!)
              </span>
            )}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'video'}-compressed.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Compressed Video
          </a>
        </div>
      )}
    </div>
  );
}
