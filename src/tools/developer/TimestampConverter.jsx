import { useState, useEffect } from 'react';
import { RotateCcw, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function TimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState(() => Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [humanResult, setHumanResult] = useState('');
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 16));
  const [epochResult, setEpochResult] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertToHuman = () => {
    const ts = parseInt(timestampInput, 10);
    if (isNaN(ts)) {
      setHumanResult('Invalid timestamp');
      return;
    }
    // Check if in seconds or milliseconds (length >= 13 is ms)
    const ms = timestampInput.length >= 13 ? ts : ts * 1000;
    const date = new Date(ms);
    setHumanResult(`${date.toUTCString()} (UTC)\n${date.toString()} (Local)`);
  };

  const convertToEpoch = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      setEpochResult('Invalid date');
      return;
    }
    const sec = Math.floor(d.getTime() / 1000);
    const ms = d.getTime();
    setEpochResult(`Seconds: ${sec}\nMilliseconds: ${ms}`);
  };

  return (
    <div className="tool-workspace">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Current Unix Epoch Time</span>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary)' }}>
          {currentEpoch}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Timestamp to Date */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Timestamp ➔ Date</h3>
          <div className="form-group">
            <label className="form-label">Epoch Timestamp (sec or ms)</label>
            <input
              type="text"
              className="input-field"
              value={timestampInput}
              onChange={e => setTimestampInput(e.target.value)}
              placeholder="e.g. 1700000000"
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={convertToHuman} style={{ marginBottom: 'var(--space-3)' }}>
            Convert to Date
          </button>
          {humanResult && (
            <pre className="code-block" style={{ fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
              {humanResult}
            </pre>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Date ➔ Timestamp</h3>
          <div className="form-group">
            <label className="form-label">Local Date &amp; Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={convertToEpoch} style={{ marginBottom: 'var(--space-3)' }}>
            Convert to Timestamp
          </button>
          {epochResult && (
            <pre className="code-block" style={{ fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
              {epochResult}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
