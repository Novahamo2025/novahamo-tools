import { useState, useRef } from 'react';
import { Download, Scissors, RotateCcw, AlertCircle, Play, Pause } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function VideoTrimmer() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setError(null);
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration);
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    }
  };

  const getMimeType = () => {
    const types = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return 'video/webm';
  };

  const handleTrim = async () => {
    if (!videoRef.current || duration <= 0) return;
    if (startTime >= endTime) {
      setError('Start time must be less than end time.');
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

    const mimeType = getMimeType();
    const stream = canvas.captureStream(30);

    // Capture audio if present
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioCtx.createMediaElementSource(video);
      const audioDest = audioCtx.createMediaStreamDestination();
      audioSource.connect(audioDest);
      audioSource.connect(audioCtx.destination);
      if (audioDest.stream.getAudioTracks().length > 0) {
        stream.addTrack(audioDest.stream.getAudioTracks()[0]);
      }
    } catch {
      // Audio element source already connected or no audio
    }

    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(recordedChunks, { type: mimeType });
      setOutputSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
      setProcessing(false);
      video.pause();
    };

    video.currentTime = startTime;

    video.onseeked = () => {
      mediaRecorder.start();
      video.play();

      const trimDuration = endTime - startTime;
      const interval = setInterval(() => {
        if (video.currentTime >= endTime || video.ended || video.paused) {
          clearInterval(interval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentProgress = Math.min(100, Math.round(((video.currentTime - startTime) / trimDuration) * 100));
          setProgress(currentProgress);
        }
      }, 1000 / 30);
    };
  };

  const handleReset = () => {
    setFile(null);
    setVideoUrl(null);
    setOutputUrl(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video File (MP4, WebM)</label>
        <input
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          className="input-field"
          onChange={handleFile}
        />
      </div>

      {videoUrl && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 'var(--radius-md)' }}
          />
        </div>
      )}

      {duration > 0 && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Total Video Length:</strong> {formatDuration(duration * 1000)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Time: {startTime}s ({formatDuration(startTime * 1000)})</label>
              <input
                type="range"
                min="0"
                max={Math.max(0, endTime - 1)}
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Time: {endTime}s ({formatDuration(endTime * 1000)})</label>
              <input
                type="range"
                min={startTime + 1}
                max={duration}
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            Selected Clip Duration: {formatDuration((endTime - startTime) * 1000)}
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
        <button className="btn btn-primary" onClick={handleTrim} disabled={!videoUrl || processing}>
          <Scissors size={16} /> {processing ? `Trimming... ${progress}%` : 'Trim Video'}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Trimmed Video Result</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Clip Size: {formatFileSize(outputSize)} | Length: {formatDuration((endTime - startTime) * 1000)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'video'}-trimmed.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Trimmed Video
          </a>
        </div>
      )}
    </div>
  );
}
