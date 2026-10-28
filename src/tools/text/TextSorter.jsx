import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function TextSorter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const sortLines = (direction) => {
    if (!text) return;
    const lines = text.split('\n');
    if (direction === 'asc') {
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    } else if (direction === 'desc') {
      lines.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
    } else if (direction === 'length-asc') {
      lines.sort((a, b) => a.length - b.length);
    } else if (direction === 'length-desc') {
      lines.sort((a, b) => b.length - a.length);
    } else if (direction === 'shuffle') {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }
    setText(lines.join('\n'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Paste lines of text to sort..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => sortLines('asc')} disabled={!text}>Sort A ➔ Z</button>
        <button className="btn btn-secondary btn-sm" onClick={() => sortLines('desc')} disabled={!text}>Sort Z ➔ A</button>
        <button className="btn btn-secondary btn-sm" onClick={() => sortLines('length-asc')} disabled={!text}>Shortest ➔ Longest</button>
        <button className="btn btn-secondary btn-sm" onClick={() => sortLines('length-desc')} disabled={!text}>Longest ➔ Shortest</button>
        <button className="btn btn-secondary btn-sm" onClick={() => sortLines('shuffle')} disabled={!text}>🔀 Random Shuffle</button>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!text}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy Result'}
        </button>
        <button className="btn btn-ghost" onClick={() => setText('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
