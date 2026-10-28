import { useState, useEffect } from 'react';
import { Download, Trash2, Copy, Save, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const STORAGE_KEY = 'novahamo-notepad';

export default function OnlineNotepad() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(t);
  }, [content]);

  const clear = () => {
    if (window.confirm('Are you sure you want to clear your notepad? This cannot be undone.')) {
      setContent('');
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const downloadText = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notes_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  return (
    <div className="tool-workspace">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          <span>{words} words</span> • <span>{chars} characters</span>
          {saved && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}><Check size={12} /> Auto-saved</span>}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={async () => {
            const ok = await copyToClipboard(content);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }}>
            <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={downloadText} disabled={!content.trim()}>
            <Download size={14} /> Download .txt
          </button>
          <button className="btn btn-danger btn-sm" onClick={clear} disabled={!content}>
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      <div className="form-group">
        <textarea
          className="textarea-field"
          rows={15}
          placeholder="Start typing your notes here... Notes are automatically preserved in your browser's private local storage."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.6 }}
        />
        <p className="form-hint">🔒 Privacy Notice: Your text is stored locally on this device. No information is transmitted to any cloud servers.</p>
      </div>
    </div>
  );
}
