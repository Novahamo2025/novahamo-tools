import { useState } from 'react';
import { RotateCcw, Trophy, Trash2 } from 'lucide-react';

export default function RandomNamePicker() {
  const [text, setText] = useState('Emma\nLiam\nOlivia\nNoah\nAva\nWilliam\nSophia\nJames');
  const [winner, setWinner] = useState(null);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const pick = () => {
    const list = text.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;

    setIsAnimating(true);
    let counter = 0;
    const interval = setInterval(() => {
      const tempIdx = Math.floor(Math.random() * list.length);
      setWinner(list[tempIdx]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * list.length);
        const picked = list[finalIdx];
        setWinner(picked);
        setIsAnimating(false);

        if (removeAfterPick) {
          list.splice(finalIdx, 1);
          setText(list.join('\n'));
        }
      }
    }, 80);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Names List (One per line)</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter names, one per line..."
        />
        <div style={{ marginTop: 'var(--space-2)' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={removeAfterPick} onChange={e => setRemoveAfterPick(e.target.checked)} />
            Remove winner from list after selection
          </label>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary btn-lg" onClick={pick} disabled={isAnimating || !text.trim()}>
          <Trophy size={18} /> Pick Random Name
        </button>
        <button className="btn btn-ghost" onClick={() => { setText(''); setWinner(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {winner && (
        <div className="tool-result">
          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            backgroundColor: isAnimating ? 'var(--color-card)' : 'var(--color-primary-bg)',
            borderColor: 'var(--color-primary)',
            transition: 'all 0.2s ease',
          }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>WINNER SELECTED</p>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              margin: 'var(--space-2) 0',
            }}>
              {winner}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
