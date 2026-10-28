import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function CSSMinifier() {
  const [css, setCss] = useState('/* NovaHamo Style */\n.btn-primary {\n  background-color: #15803D;\n  color: #FFFFFF;\n  padding: 8px 16px;\n  border-radius: 8px;\n}');
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  const minify = () => {
    if (!css.trim()) return;
    const origSize = new Blob([css]).size;

    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
      .replace(/\s+/g, ' ')             // collapse spaces
      .replace(/\s*([{}:;,])\s*/g, '$1') // remove space around separators
      .replace(/;\}/g, '}')             // remove trailing semicolon in blocks
      .trim();

    const newSize = new Blob([minified]).size;
    const savedPct = origSize > 0 ? (((origSize - newSize) / origSize) * 100).toFixed(1) : 0;

    setCss(minified);
    setStats({ origSize, newSize, savedPct });
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">CSS Code</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={css}
          onChange={e => { setCss(e.target.value); setStats(null); }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={minify} disabled={!css.trim()}>
          Minify CSS
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(css);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!css.trim()}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy CSS'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setCss(''); setStats(null); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {stats && (
        <div className="notification notification-success" style={{ marginTop: 'var(--space-4)' }}>
          Minification complete! Reduced from {stats.origSize} bytes to {stats.newSize} bytes (Saved {stats.savedPct}%).
        </div>
      )}
    </div>
  );
}
