import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function TextDiff() {
  const [original, setOriginal] = useState('Line 1: Hello World\nLine 2: NovaHamo Tools\nLine 3: Fast and secure\nLine 4: Old content');
  const [modified, setModified] = useState('Line 1: Hello World\nLine 2: NovaHamo Tools v2.0\nLine 3: Fast and secure\nLine 4: Updated content\nLine 5: Added new feature');
  const [diff, setDiff] = useState(null);

  const compare = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');

    const result = [];
    const maxLen = Math.max(origLines.length, modLines.length);

    for (let i = 0; i < maxLen; i++) {
      const o = origLines[i];
      const m = modLines[i];

      if (o === undefined) {
        result.push({ type: 'added', text: m, line: i + 1 });
      } else if (m === undefined) {
        result.push({ type: 'removed', text: o, line: i + 1 });
      } else if (o !== m) {
        result.push({ type: 'removed', text: o, line: i + 1 });
        result.push({ type: 'added', text: m, line: i + 1 });
      } else {
        result.push({ type: 'unchanged', text: o, line: i + 1 });
      }
    }

    setDiff(result);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Original Text</label>
          <textarea
            className="textarea-field"
            rows={8}
            value={original}
            onChange={e => setOriginal(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Modified Text</label>
          <textarea
            className="textarea-field"
            rows={8}
            value={modified}
            onChange={e => setModified(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={compare}>Compare Differences</button>
        <button className="btn btn-ghost" onClick={() => { setOriginal(''); setModified(''); setDiff(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {diff && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Comparison Result</h3>
          <div className="code-block" style={{ maxHeight: 350, overflowY: 'auto', padding: 0 }}>
            {diff.map((item, idx) => {
              let bg = 'transparent';
              let color = 'inherit';
              let prefix = '  ';

              if (item.type === 'added') {
                bg = 'rgba(34, 197, 94, 0.15)';
                color = '#15803D';
                prefix = '+ ';
              } else if (item.type === 'removed') {
                bg = 'rgba(239, 68, 68, 0.15)';
                color = '#DC2626';
                prefix = '- ';
              }

              return (
                <div key={idx} style={{ backgroundColor: bg, color, padding: '2px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span>{prefix}</span>
                  <span>{item.text || ' '}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
