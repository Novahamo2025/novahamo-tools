import { useState } from 'react';
import { Download, Volume2, RotateCcw, AlertCircle } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function AudioVolumeBooster() {
  const [file, setFile] = useState(null);
  const [volumeGain, setVolumeGain] = useState(1.5); // 1.5x default boost
  const [loading, setLoading] = useState(false);
  const [boostedUrl, setBoostedUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setBoostedUrl(null);
    setError(null);
  };

  const handleBoost = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const originalBuffer = await decodeAudioFile(file);
      setDuration(originalBuffer.duration);

      const offlineCtx = new OfflineAudioContext(
        originalBuffer.numberOfChannels,
        originalBuffer.length,
        originalBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;

      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = volumeGain;

      source.connect(gainNode);
      gainNode.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(renderedBuffer);
      setBoostedUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      console.error(err);
      setError('Failed to adjust volume. Please verify the audio file.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setBoostedUrl(null);
    setVolumeGain(1.5);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Audio File (MP3, WAV, AAC, OGG)</label>
        <input
          type="file"
          accept="audio/*"
          className="input-field"
          onChange={handleFile}
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <label className="form-label">Volume Level: {Math.round(volumeGain * 100)}% ({volumeGain}x)</label>
          <span style={{ fontSize: '0.85rem', color: volumeGain > 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
            {volumeGain > 1 ? `+${Math.round((volumeGain - 1) * 100)}% Boost` : `${Math.round((volumeGain - 1) * 100)}% Reduction`}
          </span>
        </div>
        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.1"
          value={volumeGain}
          onChange={(e) => setVolumeGain(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          <span>20% (Quiet)</span>
          <span>100% (Normal)</span>
          <span>200% (2x)</span>
          <span>300% (Max)</span>
        </div>
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
        <button className="btn btn-primary" onClick={handleBoost} disabled={!file || loading}>
          <Volume2 size={16} /> {loading ? 'Processing Volume...' : 'Apply Volume Change'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {boostedUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Amplified Audio</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
            Duration: {formatDuration(duration * 1000)} | Boost: {Math.round(volumeGain * 100)}%
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio src={boostedUrl} controls style={{ width: '100%' }} />
          </div>
          <a
            href={boostedUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'audio'}-boosted.wav`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Boosted Audio
          </a>
        </div>
      )}
    </div>
  );
}
