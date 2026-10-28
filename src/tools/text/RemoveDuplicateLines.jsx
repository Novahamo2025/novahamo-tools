import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  const clean = () => {
    if (!input) return;
    const lines = input.split('\n');
    const seen = new Set();
    const resultLines = [];

    for (let line of lines) {
      const processed = trimLines ? line.trim() : line;
      const key = caseSensitive ? processed : processed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        resultLines.push(line);
      }
    }

    const removed = lines.length - resultLines.length;
    setInput(resultLines.join('\n'));
    setStats({ original: lines.length, remaining: resultLines.length, removed });
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Paste lines of text here..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
          Case Sensitive Matching
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} />
          Trim whitespace around lines
        </label>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={clean} disabled={!input}>
          Remove Duplicate Lines
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(input);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!input}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy Result'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setStats(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {stats && (
        <div className="notification notification-success" style={{ marginTop: 'var(--space-4)' }}>
          Cleaned! Removed {stats.removed} duplicate line{stats.removed !== 1 ? 's' : ''} ({stats.remaining} unique lines kept).
        </div>
      )}
    </div>
  );
}
