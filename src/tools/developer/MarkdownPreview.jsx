import { useState } from 'react';
import { Eye, RotateCcw } from 'lucide-react';

export default function MarkdownPreview() {
  const [md, setMd] = useState(`# Markdown Live Preview

Edit this markdown document to see instant client-side rendering.

## Formatting Options:
- **Bold text** with \`**bold**\`
- *Italic text* with \`*italic*\`
- [Hyperlinks](https://www.novahamotechnologies.com/)
- Code snippets like \`console.log("Hello")\`

### Code Blocks:
\`\`\`javascript
const greet = (name) => {
  return \`Hello \${name}\`;
};
\`\`\`

> Blockquotes render cleanly with styled vertical borders.
`);

  const renderSimpleMarkdown = (text) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; margin: 12px 0 6px;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.35rem; margin: 16px 0 8px; color: var(--color-primary);">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.65rem; margin: 20px 0 10px;">$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--color-primary); padding-left: 12px; margin: 12px 0; color: var(--color-text-secondary); font-style: italic;">$1</blockquote>')
      .replace(/\`\`\`([\s\S]*?)\`\`\`/gim, '<pre style="background: var(--color-code-bg); padding: 12px; border-radius: 6px; font-family: monospace; overflow-x: auto;">$1</pre>')
      .replace(/\`([^`]+)\`/gim, '<code style="background: var(--color-code-bg); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">$1</a>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul style="padding-left: 20px; margin: 8px 0;">$1</ul>')
      .replace(/<\/ul>\s*<ul[^>]*>/gim, '')
      .replace(/\n\s*\n/gim, '</p><p style="margin: 8px 0;">');

    return '<p style="margin: 8px 0;">' + html + '</p>';
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label className="form-label">Markdown Editor</label>
          <textarea
            className="textarea-field"
            rows={15}
            value={md}
            onChange={e => setMd(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <label className="form-label">Live Preview</label>
          <div
            className="card"
            style={{
              height: 380,
              overflowY: 'auto',
              padding: 'var(--space-5)',
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(md) }}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={() => setMd('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
