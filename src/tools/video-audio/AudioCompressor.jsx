import { useState } from 'react';
import { Download, Minimize2, RotateCcw, AlertCircle } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function AudioCompressor() {
  const [file, setFile] = useState(null);
  const [qualityPreset, setQualityPreset] = useState('medium'); // low, medium, high
  const [loading, setLoading] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setCompressedUrl(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const originalBuffer = await decodeAudioFile(file);
      setDuration(originalBuffer.duration);

      // Compression settings
      let targetSampleRate = 44100;
      let targetChannels = 1;

      if (qualityPreset === 'low') {
        targetSampleRate = 16000;
        targetChannels = 1;
      } else if (qualityPreset === 'medium') {
        targetSampleRate = 24000;
        targetChannels = 1;
      } else {
        targetSampleRate = 32000;
        targetChannels = Math.min(originalBuffer.numberOfChannels, 2);
      }

      const targetLength = Math.round(originalBuffer.duration * targetSampleRate);
      const offlineCtx = new OfflineAudioContext(targetChannels, targetLength, targetSampleRate);

      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;
      source.connect(offlineCtx.destination);
      source.start(0);

      const resampledBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(resampledBuffer);
      setCompressedSize(wavBlob.size);
      setCompressedUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      console.error(err);
      setError('Compression failed. Please check the audio file.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedUrl(null);
    setQualityPreset('medium');
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
        <label className="form-label">Compression Level</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className={`btn ${qualityPreset === 'low' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setQualityPreset('low')}
          >
            Maximum (16kHz Mono)
          </button>
          <button
            type="button"
            className={`btn ${qualityPreset === 'medium' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setQualityPreset('medium')}
          >
            Balanced (24kHz Mono)
          </button>
          <button
            type="button"
            className={`btn ${qualityPreset === 'high' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setQualityPreset('high')}
          >
            Light (32kHz Stereo)
          </button>
        </div>
      </div>

      {file && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p><strong>Original Audio:</strong> {file.name} ({formatFileSize(file.size)})</p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleCompress} disabled={!file || loading}>
          <Minimize2 size={16} /> {loading ? 'Compressing Audio...' : 'Compress Audio'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {compressedUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Compressed Audio</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
            Original: {formatFileSize(file.size)} → New: {formatFileSize(compressedSize)} | Duration: {formatDuration(duration * 1000)}
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio src={compressedUrl} controls style={{ width: '100%' }} />
          </div>
          <a
            href={compressedUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'audio'}-compressed.wav`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Compressed Audio
          </a>
        </div>
      )}
    </div>
  );
}
