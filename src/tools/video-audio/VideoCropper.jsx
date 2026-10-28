import { useState, useRef } from 'react';
import { Download, Crop, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoCropper() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [aspectPreset, setAspectPreset] = useState('1:1'); // 1:1, 16:9, 9:16, 4:3
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

  const handleCrop = async () => {
    if (!videoRef.current || duration <= 0) return;
    setProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 360;

    let sx = 0, sy = 0, sw = vw, sh = vh;

    if (aspectPreset === '1:1') {
      const size = Math.min(vw, vh);
      sx = Math.round((vw - size) / 2);
      sy = Math.round((vh - size) / 2);
      sw = size;
      sh = size;
    } else if (aspectPreset === '9:16') {
      const targetW = Math.round((vh * 9) / 16);
      if (targetW <= vw) {
        sx = Math.round((vw - targetW) / 2);
        sw = targetW;
      } else {
        const targetH = Math.round((vw * 16) / 9);
        sy = Math.round((vh - targetH) / 2);
        sh = targetH;
      }
    } else if (aspectPreset === '4:3') {
      const targetW = Math.round((vh * 4) / 3);
      if (targetW <= vw) {
        sx = Math.round((vw - targetW) / 2);
        sw = targetW;
      } else {
        const targetH = Math.round((vw * 3) / 4);
        sy = Math.round((vh - targetH) / 2);
        sh = targetH;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = sw % 2 === 0 ? sw : sw - 1;
    canvas.height = sh % 2 === 0 ? sh : sh - 1;
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
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
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
        <label className="form-label">Crop Aspect Ratio</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className={`btn ${aspectPreset === '1:1' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAspectPreset('1:1')}
          >
            1:1 Square (Instagram)
          </button>
          <button
            type="button"
            className={`btn ${aspectPreset === '9:16' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAspectPreset('9:16')}
          >
            9:16 Vertical (Reels / TikTok)
          </button>
          <button
            type="button"
            className={`btn ${aspectPreset === '4:3' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAspectPreset('4:3')}
          >
            4:3 Classic TV
          </button>
          <button
            type="button"
            className={`btn ${aspectPreset === '16:9' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAspectPreset('16:9')}
          >
            16:9 Landscape
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
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleCrop} disabled={!videoUrl || processing}>
          <Crop size={16} /> {processing ? `Cropping Video... ${progress}%` : `Crop to ${aspectPreset}`}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Cropped Video</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Aspect: {aspectPreset} | Size: {formatFileSize(outputSize)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'video'}-cropped.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Cropped Video
          </a>
        </div>
      )}
    </div>
  );
}
