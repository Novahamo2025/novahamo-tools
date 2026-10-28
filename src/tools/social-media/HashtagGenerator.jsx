import { useState } from 'react';
import { Copy, Hash } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const HASHTAG_SETS = {
  general: ['#explore', '#trending', '#instagood', '#photooftheday', '#viral', '#picoftheday', '#dailyvibes', '#foryou', '#reels'],
  coding: ['#developer', '#coding', '#webdevelopment', '#javascript', '#reactjs', '#frontend', '#softwareengineer', '#programmer', '#code', '#tech'],
  startup: ['#entrepreneur', '#startup', '#business', '#innovation', '#founder', '#leadership', '#growth', '#scale', '#success', '#marketing'],
  photography: ['#photography', '#photo', '#naturephotography', '#portrait', '#camera', '#visualsoflife', '#capture', '#lens', '#photographer'],
  fitness: ['#fitness', '#workout', '#gym', '#health', '#fitlife', '#bodybuilding', '#cardio', '#training', '#motivation', '#wellness'],
};

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState('coding');
  const [copied, setCopied] = useState(false);

  const getTags = () => {
    const key = keyword.toLowerCase().trim();
    if (HASHTAG_SETS[key]) {
      return HASHTAG_SETS[key];
    }
    // Dynamic generation from word
    const base = key.replace(/[^a-z0-9]/gi, '');
    if (!base) return HASHTAG_SETS.general;
    return [
      `#${base}`,
      `#${base}life`,
      `#${base}daily`,
      `#${base}love`,
      `#${base}community`,
      `#${base}tips`,
      `#${base}trends`,
      `#${base}world`,
      `#${base}vibes`,
      `#${base}inspiration`,
      ...HASHTAG_SETS.general.slice(0, 5)
    ];
  };

  const tags = getTags();
  const allTagsString = tags.join(' ');

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Topic or Keyword</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. coding, fitness, startup, photography, travel..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <p className="form-hint">Tip: Type any topic to generate targeted reach tags for Instagram, YouTube, and LinkedIn.</p>
      </div>

      <div className="tool-result">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {tags.map((t, idx) => (
            <span key={idx} className="badge badge-info" style={{ fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="tool-actions">
          <button className="btn btn-primary" onClick={async () => {
            const ok = await copyToClipboard(allTagsString);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }}>
            <Copy size={16} /> {copied ? 'Copied All Hashtags!' : 'Copy All Hashtags'}
          </button>
        </div>
      </div>
    </div>
  );
}
