import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function FindReplace() {
  const [text, setText] = useState('');
  const [findStr, setFindStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleReplace = () => {
    if (!findStr) return;
    try {
      let regex;
      const flags = matchCase ? 'g' : 'gi';
      if (useRegex) {
        regex = new RegExp(findStr, flags);
      } else {
        const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, flags);
      }

      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);

      const updated = text.replace(regex, replaceStr);
      setText(updated);
    } catch (err) {
      alert('Regex Error: ' + err.message);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Input Text</label>
        <textarea
          className="textarea-field"
          rows={8}
          placeholder="Paste or enter text here..."
          value={text}
          onChange={e => { setText(e.target.value); setMatchCount(null); }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Find String / Pattern</label>
          <input
            type="text"
            className="input-field"
            placeholder="Text to find..."
            value={findStr}
            onChange={e => setFindStr(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Replace With</label>
          <input
            type="text"
            className="input-field"
            placeholder="Replacement text..."
            value={replaceStr}
            onChange={e => setReplaceStr(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} />
          Match Case
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} />
          Regular Expression (RegEx)
        </label>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleReplace} disabled={!text || !findStr}>
          Replace All Occurrences
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!text}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy Text'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setText(''); setFindStr(''); setReplaceStr(''); setMatchCount(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {matchCount !== null && (
        <div className="notification notification-info" style={{ marginTop: 'var(--space-4)' }}>
          Replaced {matchCount} occurrence{matchCount !== 1 ? 's' : ''}.
        </div>
      )}
    </div>
  );
}
