import { useState } from 'react';
import { Copy, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function JWTDecoder() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiZGV2ZWxvcGVyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  const decodeJWT = () => {
    setError('');
    setHeader(null);
    setPayload(null);

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A JSON Web Token must have 3 dot-separated parts: Header.Payload.Signature');
      return;
    }

    try {
      const base64UrlDecode = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(escape(atob(base64)));
      };

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (err) {
      setError(`Failed to parse token payload: ${err.message}`);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-warning" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--color-warning)' }}>
        <ShieldAlert size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Security Disclaimer:</strong> Decoding parses the base64-encoded Header and Payload client-side. <em>Decoding does not verify signature authenticity</em> without secret/public cryptographic verification keys.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Encoded JWT String</label>
        <textarea
          className="textarea-field"
          rows={5}
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste JWT (e.g. eyJhbGci...)"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', wordBreak: 'break-all' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={decodeJWT} disabled={!token.trim()}>Decode JWT</button>
        <button className="btn btn-ghost" onClick={() => { setToken(''); setHeader(null); setPayload(null); setError(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {(header || payload) && (
        <div className="tool-result">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">HEADER: ALGORITHM &amp; TOKEN TYPE</label>
              <pre className="code-block" style={{ maxHeight: 250, overflowY: 'auto' }}>
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>
            <div>
              <label className="form-label">PAYLOAD: CLAIMS &amp; METADATA</label>
              <pre className="code-block" style={{ maxHeight: 250, overflowY: 'auto' }}>
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
