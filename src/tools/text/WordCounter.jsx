import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.ceil(words / 200);

  const reset = () => setText('');

  return (
    <div className="tool-workspace">
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>WORDS</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{words}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>CHARACTERS</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{chars}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>SENTENCES</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{sentences}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>PARAGRAPHS</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{paragraphs}</h2>
        </div>
      </div>

      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Paste or type text to calculate real-time word and character statistics..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          No spaces: <strong>{charsNoSpaces}</strong> | Est. reading time: <strong>~{readingTimeMinutes} min</strong>
        </span>
        <div className="tool-actions" style={{ marginTop: 0 }}>
          <button className="btn btn-secondary btn-sm" onClick={async () => {
            const ok = await copyToClipboard(text);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }} disabled={!text}>
            <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
