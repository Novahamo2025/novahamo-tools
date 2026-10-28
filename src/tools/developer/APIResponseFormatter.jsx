import { useState } from 'react';
import { Copy, RotateCcw, Info } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function APIResponseFormatter() {
  const [input, setInput] = useState('{"status":"success","data":{"users":[{"id":101,"name":"Alice","roles":["admin","editor"]},{"id":102,"name":"Bob","roles":["subscriber"]}],"meta":{"page":1,"total":2}},"timestamp":1700000000}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError(`Failed to format response: ${err.message}`);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Notice:</strong> Paste raw API JSON response payloads to format with consistent indentation and hierarchical syntax. Live HTTP client requests are restricted by standard browser Cross-Origin Resource Sharing (CORS) security policies.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Raw API Response Payload (JSON)</label>
        <textarea
          className="textarea-field"
          rows={8}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder="Paste raw API response here..."
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={format} disabled={!input.trim()}>
          Beautify Response Payload
        </button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {output && (
        <div className="tool-result">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Formatted Response Output</label>
            <button className="btn btn-secondary btn-sm" onClick={async () => {
              const ok = await copyToClipboard(output);
              if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
            }}>
              <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="code-block" style={{ maxHeight: 350, overflowY: 'auto' }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
