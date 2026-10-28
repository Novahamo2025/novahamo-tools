import { useState, useRef } from 'react';
import { Download, FileAudio, RotateCcw, AlertCircle } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function MP3ToWAV() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wavUrl, setWavUrl] = useState(null);
  const [wavSize, setWavSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setWavUrl(null);
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
      setWavSize(wavBlob.size);
      const url = URL.createObjectURL(wavBlob);
      setWavUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to convert audio. Please ensure the file is a valid MP3 or audio format.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWavUrl(null);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Audio File (MP3, AAC, M4A, OGG)</label>
        <input
          type="file"
          accept="audio/*"
          className="input-field"
          onChange={handleFile}
        />
        <p className="form-hint">Converts compressed audio files into studio-standard uncompressed 16-bit PCM WAV format.</p>
      </div>

      {file && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p><strong>Input:</strong> {file.name} ({formatFileSize(file.size)})</p>
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
          <FileAudio size={16} /> {loading ? 'Converting to WAV...' : 'Convert to WAV'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {wavUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Converted WAV File</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
            Duration: {formatDuration(duration * 1000)} | New Size: {formatFileSize(wavSize)}
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio src={wavUrl} controls style={{ width: '100%' }} />
          </div>
          <a
            href={wavUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'audio'}.wav`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download WAV Audio
          </a>
        </div>
      )}
    </div>
  );
}
