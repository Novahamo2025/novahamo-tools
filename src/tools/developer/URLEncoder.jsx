import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function URLEncoder() {
  const [input, setInput] = useState('https://example.com/search?q=novahamo tools&category=web & tech');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('component'); // 'component' or 'full'
  const [copied, setCopied] = useState(false);

  const encode = () => {
    if (!input) return;
    const res = mode === 'component' ? encodeURIComponent(input) : encodeURI(input);
    setOutput(res);
  };

  const decode = () => {
    if (!input) return;
    try {
      const res = mode === 'component' ? decodeURIComponent(input) : decodeURI(input);
      setOutput(res);
    } catch (err) {
      setOutput(`URI malformed: ${err.message}`);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">URL or URI Component</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste URL or query parameter..."
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Encoding Scope</label>
        <select className="select-field" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="component">encodeURIComponent (Encodes &amp;, ?, =, /, :, etc.)</option>
          <option value="full">encodeURI (Preserves protocol &amp; domain structure)</option>
        </select>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={encode} disabled={!input}>Encode</button>
        <button className="btn btn-secondary" onClick={decode} disabled={!input}>Decode</button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setOutput(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {output && (
        <div className="tool-result">
          <label className="form-label">Output</label>
          <textarea
            className="textarea-field"
            rows={6}
            readOnly
            value={output}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
          <div style={{ marginTop: 'var(--space-3)' }}>
            <button className="btn btn-secondary btn-sm" onClick={async () => {
              const ok = await copyToClipboard(output);
              if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
            }}>
              <Copy size={14} /> {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
