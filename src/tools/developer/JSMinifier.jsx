import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function JSMinifier() {
  const [code, setCode] = useState('// Calculates total value\nfunction calculateTotal(price, taxRate) {\n  const tax = price * taxRate;\n  return price + tax;\n}\nconsole.log(calculateTotal(100, 0.18));');
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  const minify = () => {
    if (!code.trim()) return;
    const origSize = new Blob([code]).size;

    // Safe regex-based client minification for browser environment
    const minified = code
      .replace(/\/\*[\s\S]*?\*\//g, '')     // multi-line comments
      .replace(/(^|\n)\/\/[^\n]*/g, '')    // single-line comments
      .replace(/\s+/g, ' ')                // collapse whitespace
      .replace(/\s*([=+\-*/%&|^!<>?:;,{}()])\s*/g, '$1') // remove space around operators & delimiters
      .trim();

    const newSize = new Blob([minified]).size;
    const savedPct = origSize > 0 ? (((origSize - newSize) / origSize) * 100).toFixed(1) : 0;

    setCode(minified);
    setStats({ origSize, newSize, savedPct });
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">JavaScript Code</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={code}
          onChange={e => { setCode(e.target.value); setStats(null); }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
        <p className="form-hint">Strips comments, reduces whitespace, and condenses syntax safely in the browser.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={minify} disabled={!code.trim()}>
          Minify JavaScript
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(code);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!code.trim()}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy JS'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setCode(''); setStats(null); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {stats && (
        <div className="notification notification-success" style={{ marginTop: 'var(--space-4)' }}>
          Minified! Size dropped from {stats.origSize} bytes to {stats.newSize} bytes ({stats.savedPct}% smaller).
        </div>
      )}
    </div>
  );
}
