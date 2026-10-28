import { useState, useEffect } from 'react';
import { Copy, Info } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function HashGenerator() {
  const [text, setText] = useState('Hello NovaHamo');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha384: '', sha512: '' });
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    computeHashes(text);
  }, [text]);

  const computeHashes = async (inputStr) => {
    if (!inputStr) {
      setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    const enc = new TextEncoder();
    const data = enc.encode(inputStr);

    const getHex = async (algo) => {
      try {
        const hashBuf = await crypto.subtle.digest(algo, data);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {
        return 'Not supported in this browser';
      }
    };

    const [sha1, sha256, sha384, sha512] = await Promise.all([
      getHex('SHA-1'),
      getHex('SHA-256'),
      getHex('SHA-384'),
      getHex('SHA-512'),
    ]);

    setHashes({ sha1, sha256, sha384, sha512 });
  };

  const handleCopy = async (val, key) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Cryptographic Digest Notice:</strong> Hash functions are one-way irreversible deterministic mathematical digests (not encryption). They are used for integrity checks, checksums, and password verification.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Input Plaintext / Data</label>
        <textarea
          className="textarea-field"
          rows={5}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text to calculate cryptographic hashes..."
        />
      </div>

      <div className="tool-result">
        {[
          { label: 'SHA-256 (Standard / Recommended)', val: hashes.sha256, key: 'sha256' },
          { label: 'SHA-512 (High Security)', val: hashes.sha512, key: 'sha512' },
          { label: 'SHA-384', val: hashes.sha384, key: 'sha384' },
          { label: 'SHA-1 (Legacy / Git Checksums)', val: hashes.sha1, key: 'sha1' },
        ].map(item => (
          <div key={item.key} style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.label}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => handleCopy(item.val, item.key)} disabled={!item.val} style={{ padding: '2px 8px' }}>
                <Copy size={12} /> {copiedKey === item.key ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="code-block" style={{ fontSize: '0.8125rem', wordBreak: 'break-all' }}>
              {item.val || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
