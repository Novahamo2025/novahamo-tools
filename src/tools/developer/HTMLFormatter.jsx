import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function HTMLFormatter() {
  const [html, setHtml] = useState('<div class="container"><header><h1>NovaHamo</h1><p>Free Tools</p></header><main><button>Get Started</button></main></div>');
  const [copied, setCopied] = useState(false);

  const formatHTML = () => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Normalize spacing around tags
    const clean = html.replace(/>\s*</g, '><').trim();
    const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

    for (let token of tokens) {
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        formatted += '\n' + tab.repeat(indent) + token;
      } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<!') && !['<meta', '<link', '<img', '<input', '<br', '<hr'].some(v => token.startsWith(v))) {
        formatted += '\n' + tab.repeat(indent) + token;
        indent++;
      } else if (token.startsWith('<')) {
        // Self-closing or void
        formatted += '\n' + tab.repeat(indent) + token;
      } else {
        // Text content
        const text = token.trim();
        if (text) {
          formatted += text;
        }
      }
    }

    setHtml(formatted.trim());
  };

  const minifyHTML = () => {
    const minified = html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    setHtml(minified);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">HTML Code</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={html}
          onChange={e => setHtml(e.target.value)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary btn-sm" onClick={formatHTML} disabled={!html.trim()}>Format / Beautify</button>
        <button className="btn btn-secondary btn-sm" onClick={minifyHTML} disabled={!html.trim()}>Minify HTML</button>
      </div>

      <div className="tool-actions">
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(html);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!html.trim()}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy HTML'}
        </button>
        <button className="btn btn-ghost" onClick={() => setHtml('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
