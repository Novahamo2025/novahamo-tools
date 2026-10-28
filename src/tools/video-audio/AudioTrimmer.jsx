import { useState, useRef } from 'react';
import { Download, Scissors, RotateCcw, AlertCircle, Play, Pause } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function AudioTrimmer() {
  const [file, setFile] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trimmedUrl, setTrimmedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setTrimmedUrl(null);
    setError(null);
    setLoading(true);

    try {
      const decoded = await decodeAudioFile(f);
      setBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime(0);
      setEndTime(Math.floor(decoded.duration));
    } catch (err) {
      console.error(err);
      setError('Failed to read audio file.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrim = async () => {
    if (!buffer) return;
    if (startTime >= endTime) {
      setError('Start time must be strictly less than end time.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sampleRate = buffer.sampleRate;
      const startOffset = Math.floor(startTime * sampleRate);
      const endOffset = Math.floor(endTime * sampleRate);
      const frameCount = endOffset - startOffset;

      if (frameCount <= 0) {
        throw new Error('Invalid trim range');
      }

      const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, frameCount, sampleRate);
      const trimmedBuffer = offlineCtx.createBuffer(buffer.numberOfChannels, frameCount, sampleRate);

      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const originalData = buffer.getChannelData(channel);
        const subData = originalData.subarray(startOffset, endOffset);
        trimmedBuffer.copyToChannel(subData, channel);
      }

      const wavBlob = audioBufferToWav(trimmedBuffer);
      setTrimmedUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      console.error(err);
      setError('Error while trimming audio.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setBuffer(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setTrimmedUrl(null);
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

      {file && duration > 0 && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ marginBottom: 'var(--space-2)' }}>
            <strong>File:</strong> {file.name} | <strong>Total Duration:</strong> {formatDuration(duration * 1000)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Time (seconds): {startTime}s</label>
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
              <label className="form-label">End Time (seconds): {endTime}s</label>
              <input
                type="range"
                min={startTime + 1}
                max={Math.ceil(duration)}
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            Trimmed Segment Duration: {formatDuration((endTime - startTime) * 1000)}
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
        <button className="btn btn-primary" onClick={handleTrim} disabled={!buffer || loading}>
          <Scissors size={16} /> {loading ? 'Trimming Audio...' : 'Trim Audio Segment'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {trimmedUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Trimmed Audio</h3>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio src={trimmedUrl} controls style={{ width: '100%' }} />
          </div>
          <a
            href={trimmedUrl}
            download={`${file ? file.name.replace(/\.[^/.]+$/, '') : 'audio'}-trimmed.wav`}
            className="btn btn-primary"
          >
            <Download size={16} /> Download Trimmed WAV
          </a>
        </div>
      )}
    </div>
  );
}
