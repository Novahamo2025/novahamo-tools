import { useState } from 'react';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export default function JSONValidator() {
  const [input, setInput] = useState('{\n  "service": "NovaHamo Tools",\n  "status": "active",\n  "code": 200\n}');
  const [result, setResult] = useState(null);

  const validate = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setResult({
        valid: true,
        type: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed,
        keysCount: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1,
        sizeBytes: new Blob([input]).size,
      });
    } catch (err) {
      setResult({
        valid: false,
        error: err.message,
      });
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Paste JSON to Validate</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={validate} disabled={!input.trim()}>
          Validate JSON Syntax
        </button>
        <button className="btn btn-ghost" onClick={() => { setInput(''); setResult(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {result && (
        <div className="tool-result">
          {result.valid ? (
            <div className="notification notification-success" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle2 size={20} />
              <div>
                <strong>Valid JSON!</strong> Top-level type: <code>{result.type}</code> ({result.keysCount} keys/items, {result.sizeBytes} bytes).
              </div>
            </div>
          ) : (
            <div className="notification notification-error" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Syntax Error Detected:</strong>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', marginTop: 4 }}>{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
