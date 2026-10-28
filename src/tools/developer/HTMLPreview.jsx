import { useState } from 'react';
import { Eye, Shield, RotateCcw } from 'lucide-react';

export default function HTMLPreview() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; color: #1e293b; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #15803d; }
    button { background: #15803d; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello from NovaHamo Sandbox!</h1>
    <p>This code runs inside a secure, sandboxed iframe environment.</p>
    <button onclick="alert('Hello from sandboxed JavaScript!')">Click Me</button>
  </div>
</body>
</html>`);

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label className="form-label">HTML / CSS / JS Source</label>
          <textarea
            className="textarea-field"
            rows={16}
            value={html}
            onChange={e => setHtml(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Sandboxed Live Preview</label>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              <Shield size={12} /> Sandbox Isolated
            </span>
          </div>

          <iframe
            title="HTML Sandbox Preview"
            srcDoc={html}
            sandbox="allow-scripts"
            style={{
              width: '100%',
              height: 380,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={() => setHtml('')}>
          <RotateCcw size={16} /> Clear Code
        </button>
      </div>
    </div>
  );
}
