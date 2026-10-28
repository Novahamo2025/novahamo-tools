import { useState, useRef } from 'react';
import { Download, Music, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function AddAudioToVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleVideoFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoFile(f);
    setOutputUrl(null);
    setError(null);
    setVideoUrl(URL.createObjectURL(f));
  };

  const handleAudioFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudioFile(f);
    setOutputUrl(null);
    setError(null);
    setAudioUrl(URL.createObjectURL(f));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleMerge = async () => {
    if (!videoRef.current || !audioRef.current || duration <= 0) {
      setError('Please provide both a video and an audio track.');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);

    const video = videoRef.current;
    const audio = audioRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');

    const mimeType = 'video/webm';
    const stream = canvas.captureStream(30);

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioCtx.createMediaElementSource(audio);
      const audioDest = audioCtx.createMediaStreamDestination();
      audioSource.connect(audioDest);
      audioSource.connect(audioCtx.destination);
      if (audioDest.stream.getAudioTracks().length > 0) {
        stream.addTrack(audioDest.stream.getAudioTracks()[0]);
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
      audio.pause();
    };

    video.currentTime = 0;
    audio.currentTime = 0;

    video.onseeked = () => {
      mediaRecorder.start();
      video.play();
      audio.play();

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
    setVideoFile(null);
    setAudioFile(null);
    setVideoUrl(null);
    setAudioUrl(null);
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
          <label className="form-label">2. Upload Audio File (MP3, WAV)</label>
          <input
            type="file"
            accept="audio/*"
            className="input-field"
            onChange={handleAudioFile}
          />
        </div>
      </div>

      {videoUrl && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            muted
            controls
            style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }}
          />
        </div>
      )}

      {audioUrl && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p className="form-label">New Audio Track Preview:</p>
          <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%' }} />
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleMerge} disabled={!videoUrl || !audioUrl || processing}>
          <Music size={16} /> {processing ? `Combining Video & Audio... ${progress}%` : 'Add Audio to Video'}
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Combined Video & Audio</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
            Output Size: {formatFileSize(outputSize)}
          </p>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <video src={outputUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }} />
          </div>
          <a
            href={outputUrl}
            download={`${videoFile ? videoFile.name.replace(/\.[^/.]+$/, '') : 'video'}-with-audio.webm`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Combined Video
          </a>
        </div>
      )}
    </div>
  );
}
