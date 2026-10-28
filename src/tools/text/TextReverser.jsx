import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function TextReverser() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const reverseChars = () => {
    setText(text.split('').reverse().join(''));
  };

  const reverseWords = () => {
    const reversed = text
      .split('\n')
      .map(line => line.split(/\s+/).reverse().join(' '))
      .join('\n');
    setText(reversed);
  };

  const reverseLines = () => {
    setText(text.split('\n').reverse().join('\n'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Enter text to reverse characters, words, or lines..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-secondary btn-sm" onClick={reverseChars} disabled={!text}>Reverse Characters</button>
        <button className="btn btn-secondary btn-sm" onClick={reverseWords} disabled={!text}>Reverse Words</button>
        <button className="btn btn-secondary btn-sm" onClick={reverseLines} disabled={!text}>Reverse Line Order</button>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!text}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy Text'}
        </button>
        <button className="btn btn-ghost" onClick={() => setText('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
