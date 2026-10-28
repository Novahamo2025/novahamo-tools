import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function RemoveExtraSpaces() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanSpaces = () => {
    // 1. Collapse multiple spaces & tabs into single space
    // 2. Trim every line
    // 3. Remove multiple empty lines into single newline
    const cleaned = text
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setText(cleaned);
  };

  const removeAllLineBreaks = () => {
    const cleaned = text.replace(/[\r\n]+/g, ' ').replace(/[ \t]+/g, ' ').trim();
    setText(cleaned);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Paste text with excessive spaces, tab stops, or irregular line gaps..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={cleanSpaces} disabled={!text}>
          Clean Extra Spaces
        </button>
        <button className="btn btn-secondary" onClick={removeAllLineBreaks} disabled={!text}>
          Convert to Single Line
        </button>
        <button className="btn btn-secondary" onClick={async () => {
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
