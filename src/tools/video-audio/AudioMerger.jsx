import { useState } from 'react';
import { Download, Layers, RotateCcw, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { decodeAudioFile, audioBufferToWav } from '../../utils/audioEncoder';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function AudioMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
    setMergedUrl(null);
    setError(null);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setMergedUrl(null);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...files];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setFiles(updated);
  };

  const moveDown = (idx) => {
    if (idx === files.length - 1) return;
    const updated = [...files];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setFiles(updated);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 audio files to merge.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decodedBuffers = [];
      let totalLength = 0;
      let targetSampleRate = 44100;
      let targetChannels = 2;

      for (const file of files) {
        const buf = await decodeAudioFile(file);
        decodedBuffers.push(buf);
        totalLength += buf.length;
        targetSampleRate = buf.sampleRate;
        targetChannels = Math.max(targetChannels, buf.numberOfChannels);
      }

      const offlineCtx = new OfflineAudioContext(targetChannels, totalLength, targetSampleRate);
      const mergedBuffer = offlineCtx.createBuffer(targetChannels, totalLength, targetSampleRate);

      for (let ch = 0; ch < targetChannels; ch++) {
        const mergedData = mergedBuffer.getChannelData(ch);
        let offset = 0;

        for (const buf of decodedBuffers) {
          const srcCh = Math.min(ch, buf.numberOfChannels - 1);
          const channelData = buf.getChannelData(srcCh);
          mergedData.set(channelData, offset);
          offset += buf.length;
        }
      }

      setTotalDuration(mergedBuffer.duration);
      const wavBlob = audioBufferToWav(mergedBuffer);
      setMergedUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      console.error(err);
      setError('Failed to merge audio files. Please check that the files are valid audio formats.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedUrl(null);
    setTotalDuration(0);
    setError(null);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Select Audio Files to Merge (MP3, WAV, AAC, OGG)</label>
        <input
          type="file"
          accept="audio/*"
          multiple
          className="input-field"
          onChange={handleFiles}
        />
        <p className="form-hint">Files will be combined in the order listed below into one continuous audio track.</p>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
            Selected Audio Tracks ({files.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {files.map((f, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, marginRight: 'var(--space-2)' }}>#{idx + 1}</span>
                  <span>{f.name}</span>
                  <span style={{ marginLeft: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    ({formatFileSize(f.size)})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button className="btn btn-ghost" onClick={() => moveUp(idx)} disabled={idx === 0} title="Move Up">
                    <ArrowUp size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => moveDown(idx)} disabled={idx === files.length - 1} title="Move Down">
                    <ArrowDown size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => removeFile(idx)} title="Remove" style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleMerge} disabled={files.length < 2 || loading}>
          <Layers size={16} /> {loading ? 'Combining Tracks...' : 'Merge Audio Tracks'}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {mergedUrl && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Merged Audio Track</h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-4)' }}>
            Combined Duration: {formatDuration(totalDuration * 1000)} | Files Merged: {files.length}
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <audio src={mergedUrl} controls style={{ width: '100%' }} />
          </div>
          <a
            href={mergedUrl}
            download="novahamo-merged-audio.wav"
            className="btn btn-primary"
          >
            <Download size={16} /> Download Merged WAV
          </a>
        </div>
      )}
    </div>
  );
}
