import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function JSONFormatter() {
  const [input, setInput] = useState('{"name":"NovaHamo Tools","features":["fast","accessible","free"],"active":true,"version":2}');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const minifyJSON = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">JSON Input / Output</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary btn-sm" onClick={formatJSON} disabled={!input.trim()}>
          Format / Beautify
        </button>
        <button className="btn btn-secondary btn-sm" onClick={minifyJSON} disabled={!input.trim()}>
          Minify / Compact
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', marginLeft: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.8125rem' }}>Indentation:</span>
          <select className="select-field" style={{ width: 100, minHeight: 34, padding: '2px 8px' }} value={indent} onChange={e => setIndent(Number(e.target.value))}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(input);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!input.trim()}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy JSON'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setError(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
