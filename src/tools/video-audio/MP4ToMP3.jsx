import { useState, useRef } from 'react';
import { Download, Music, RotateCcw, Play, Pause, AlertCircle } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function MP4ToMP3() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioSize, setAudioSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setAudioUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const buffer = await decodeAudioFile(file);
      setDuration(buffer.duration);
      const wavBlob = audioBufferToWav(buffer);
      setAudioSize(wavBlob.size);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError('Could not extract audio track. Ensure the video contains a valid audio stream.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAudioUrl(null);
    setError(null);
    setIsPlaying(false);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video or Audio File (MP4, WebM, MKV, MOV)</label>
        <input
          type="file"
          accept="video/*,audio/*"
          className="input-field"
          onChange={handleFile}
        />
        <p className="form-hint">Extracts the full audio track locally in your browser with zero quality degradation.</p>
      </div>

      {file && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p><strong>Selected File:</strong> {file.name} ({formatFileSize(file.size)})</p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleConvert} disabled={!file || loading}>
          <Music size={16} /> {loading ? 'Extracting Audio...' : 'Extract Audio'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {audioUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Extracted Audio Track</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
            Duration: {formatDuration(duration * 1000)} | Size: {formatFileSize(audioSize)}
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{ width: '100%' }}
            />
          </div>
          <a
            href={audioUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'audio'}-extracted.wav`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Audio (WAV)
          </a>
        </div>
      )}
    </div>
  );
}
