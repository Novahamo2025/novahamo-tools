import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());

  const toTitle = () => {
    setText(text.toLowerCase().replace(/(?:^|\s|-)\S/g, c => c.toUpperCase()));
  };

  const toSentence = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
  };

  const toAlternating = () => {
    setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
  };

  const toCamel = () => {
    setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
  };

  const toSnake = () => {
    setText(text.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, ''));
  };

  const toKebab = () => {
    setText(text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={8}
          placeholder="Enter text to convert letter casing..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-secondary btn-sm" onClick={toUpper} disabled={!text}>UPPERCASE</button>
        <button className="btn btn-secondary btn-sm" onClick={toLower} disabled={!text}>lowercase</button>
        <button className="btn btn-secondary btn-sm" onClick={toTitle} disabled={!text}>Title Case</button>
        <button className="btn btn-secondary btn-sm" onClick={toSentence} disabled={!text}>Sentence case</button>
        <button className="btn btn-secondary btn-sm" onClick={toAlternating} disabled={!text}>aLtErNaTiNg</button>
        <button className="btn btn-secondary btn-sm" onClick={toCamel} disabled={!text}>camelCase</button>
        <button className="btn btn-secondary btn-sm" onClick={toSnake} disabled={!text}>snake_case</button>
        <button className="btn btn-secondary btn-sm" onClick={toKebab} disabled={!text}>kebab-case</button>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!text}>
          <Copy size={16} /> {copied ? 'Copied to Clipboard!' : 'Copy Converted Text'}
        </button>
        <button className="btn btn-ghost" onClick={() => setText('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
