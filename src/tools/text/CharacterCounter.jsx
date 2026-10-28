import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState(280); // e.g., Twitter/X standard
  const [copied, setCopied] = useState(false);

  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text ? text.split('\n').length : 0;
  const pct = Math.min(100, Math.round((totalChars / limit) * 100));

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>TOTAL CHARS</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: totalChars > limit ? 'var(--color-error)' : 'var(--color-primary)' }}>{totalChars}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>NO SPACES</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{charsNoSpaces}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>TOTAL LINES</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{lines}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>REMAINING</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: limit - totalChars < 0 ? 'var(--color-error)' : 'inherit' }}>{limit - totalChars}</h2>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          <span>Character Limit Progress ({totalChars} / {limit})</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${pct}%`,
              backgroundColor: totalChars > limit ? 'var(--color-error)' : 'var(--color-primary)',
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={8}
          placeholder="Type or paste text..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.875rem' }}>Limit:</span>
          <select className="select-field" style={{ width: 140, minHeight: 36, padding: 'var(--space-1) var(--space-2)' }} value={limit} onChange={e => setLimit(Number(e.target.value))}>
            <option value={280}>Twitter (280)</option>
            <option value={160}>SMS (160)</option>
            <option value={2200}>Instagram (2,200)</option>
            <option value={3000}>LinkedIn (3,000)</option>
            <option value={5000}>5,000 chars</option>
          </select>
        </div>

        <div className="tool-actions" style={{ marginTop: 0 }}>
          <button className="btn btn-secondary btn-sm" onClick={async () => {
            const ok = await copyToClipboard(text);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }} disabled={!text}>
            <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setText('')}>
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
