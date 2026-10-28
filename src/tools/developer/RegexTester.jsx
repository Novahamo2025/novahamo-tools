import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@novahamo.com or dev.team@example.org for assistance.');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = () => {
    setError('');
    setMatches([]);
    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flags);
      const found = [];
      let m;

      if (flags.includes('g')) {
        while ((m = regex.exec(testText)) !== null) {
          found.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === regex.lastIndex) regex.lastIndex++; // Avoid infinite loops on zero-width match
        }
      } else {
        m = regex.exec(testText);
        if (m) found.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }

      setMatches(found);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)', alignItems: 'center' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Regular Expression Pattern</label>
          <input
            type="text"
            className="input-field"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Flags</label>
          <input
            type="text"
            className="input-field"
            style={{ width: 90, fontFamily: 'var(--font-mono)' }}
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="g, i, m..."
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
        <label className="form-label">Test String</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={testText}
          onChange={e => setTestText(e.target.value)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={testRegex} disabled={!pattern}>
          Test Regex Matches
        </button>
        <button className="btn btn-ghost" onClick={() => { setPattern(''); setTestText(''); setMatches([]); setError(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      <div className="tool-result">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          Matches Found ({matches.length})
        </h3>
        {matches.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {matches.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 'var(--space-2) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary)' }}>{item.match}</code>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Index: {item.index}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No matches found for the given pattern and flags.</p>
        )}
      </div>
    </div>
  );
}
