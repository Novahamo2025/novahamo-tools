import { useState, useEffect } from 'react';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    // Cryptographically secure pseudorandom numbers
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charset[randomValues[i] % charset.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  // Entropy calculation
  let poolSize = 0;
  if (uppercase) poolSize += 26;
  if (lowercase) poolSize += 26;
  if (numbers) poolSize += 10;
  if (symbols) poolSize += 30;
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  return (
    <div className="tool-workspace">
      <div className="card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-6)',
        marginBottom: 'var(--space-6)',
        border: '2px solid var(--color-primary)'
      }}>
        <span style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          wordBreak: 'break-all'
        }}>
          {password || 'Please select at least one character set'}
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={generate}>
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={async () => {
            const ok = await copyToClipboard(password);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }} disabled={!password}>
            <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password Length: <strong>{length}</strong> characters</span>
        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
          <ShieldCheck size={14} /> Strength: ~{entropy} bits of entropy
        </span>
      </div>

      <div className="form-group">
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
          Uppercase (A-Z)
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} />
          Lowercase (a-z)
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} />
          Numbers (0-9)
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} />
          Special Symbols (!@#$%)
        </label>
      </div>
    </div>
  );
}
