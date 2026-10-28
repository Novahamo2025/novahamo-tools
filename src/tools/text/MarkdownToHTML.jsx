import { useState } from 'react';
import { Copy, Code, Eye } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function MarkdownToHTML() {
  const [markdown, setMarkdown] = useState(`# NovaHamo Tools
## Free Online Tools for Everyone

Welcome to the **fastest** and most accessible frontend tool platform!

### Key Features:
- 100% Client-side processing
- No registration or login required
- Privacy-first architecture

> "Your everyday tools for images, PDFs, QR codes, video, documents, coding, and calculations."

Check out [NovaHamo Technologies](https://www.novahamotechnologies.com/) for more innovations.`);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('preview'); // 'preview' or 'html'

  // Safe client-side markdown to sanitized HTML parser
  const parseMarkdown = (md) => {
    let html = md
      // Escape sensitive HTML tags first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/gim, '');

    // Paragraphs
    html = html.replace(/\n\s*\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/gim, '');

    return html;
  };

  const parsedHTML = parseMarkdown(markdown);

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label className="form-label">Markdown Input</label>
          <textarea
            className="textarea-field"
            rows={14}
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Output</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className={`btn btn-sm ${tab === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab('preview')}
              >
                <Eye size={14} /> Rendered Preview
              </button>
              <button
                className={`btn btn-sm ${tab === 'html' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab('html')}
              >
                <Code size={14} /> HTML Source
              </button>
            </div>
          </div>

          {tab === 'preview' ? (
            <div
              className="card"
              style={{
                minHeight: 320,
                maxHeight: 320,
                overflowY: 'auto',
                lineHeight: 1.6,
                padding: 'var(--space-4)',
              }}
              dangerouslySetInnerHTML={{ __html: parsedHTML }}
            />
          ) : (
            <textarea
              className="textarea-field"
              rows={14}
              readOnly
              value={parsedHTML}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
            />
          )}
        </div>
      </div>

      <div className="tool-actions">
        <button
          className="btn btn-secondary"
          onClick={async () => {
            const ok = await copyToClipboard(parsedHTML);
            if (ok) {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          disabled={!markdown}
        >
          <Copy size={16} /> {copied ? 'Copied HTML!' : 'Copy Sanitized HTML'}
        </button>
      </div>
    </div>
  );
}
