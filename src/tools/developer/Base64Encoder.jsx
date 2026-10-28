import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function Base64Encoder() {
  const [input, setInput] = useState('Hello NovaHamo Tools!');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    setError('');
    try {
      // Handles full UTF-8 characters safely
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError(`Encoding error: ${err.message}`);
    }
  };

  const decode = () => {
    setError('');
    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setOutput(decoded);
    } catch (err) {
      setError(`Decoding error: Invalid Base64 sequence (${err.message})`);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Input String</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder="Enter text to encode, or Base64 string to decode..."
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={encode} disabled={!input}>Encode to Base64</button>
        <button className="btn btn-secondary" onClick={decode} disabled={!input}>Decode from Base64</button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {output && (
        <div className="tool-result">
          <label className="form-label">Result</label>
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
