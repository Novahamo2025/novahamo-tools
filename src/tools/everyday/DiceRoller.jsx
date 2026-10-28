import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const DICE_TYPES = [
  { sides: 4, name: 'D4' },
  { sides: 6, name: 'D6 (Standard)' },
  { sides: 8, name: 'D8' },
  { sides: 10, name: 'D10' },
  { sides: 12, name: 'D12' },
  { sides: 20, name: 'D20' },
  { sides: 100, name: 'D100' },
];

export default function DiceRoller() {
  const [selectedSides, setSelectedSides] = useState(6);
  const [numDice, setNumDice] = useState(1);
  const [rolls, setRolls] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);

  const roll = () => {
    setRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const tempRolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * selectedSides) + 1);
      setRolls(tempRolls);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        // Crypto secure final roll
        const arr = new Uint32Array(numDice);
        window.crypto.getRandomValues(arr);
        const finalRolls = Array.from(arr).map(n => (n % selectedSides) + 1);
        setRolls(finalRolls);
        setRolling(false);
        const sum = finalRolls.reduce((a, b) => a + b, 0);
        setHistory(prev => [{ dice: `${numDice}d${selectedSides}`, rolls: finalRolls, sum, id: Date.now() }, ...prev.slice(0, 9)]);
      }
    }, 60);
  };

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Dice Type</label>
          <select className="select-field" value={selectedSides} onChange={e => setSelectedSides(Number(e.target.value))}>
            {DICE_TYPES.map(d => <option key={d.sides} value={d.sides}>{d.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Number of Dice</label>
          <input type="number" min={1} max={10} className="input-field" value={numDice} onChange={e => setNumDice(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary btn-lg" onClick={roll} disabled={rolling}>
          🎲 Roll {numDice}d{selectedSides}
        </button>
        <button className="btn btn-ghost" onClick={() => { setRolls([]); setHistory([]); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {rolls.length > 0 && (
        <div className="tool-result">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', margin: 'var(--space-6) 0' }}>
            {rolls.map((val, idx) => (
              <div key={idx} className="card" style={{
                width: 90,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                boxShadow: 'var(--shadow-md)',
                transform: rolling ? 'scale(1.05) rotate(5deg)' : 'scale(1)',
                transition: 'all 0.1s ease',
              }}>
                {val}
              </div>
            ))}
          </div>

          {rolls.length > 1 && (
            <div style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
              Sum Total: <strong style={{ color: 'var(--color-primary)' }}>{total}</strong>
            </div>
          )}

          {history.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Recent Roll History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {history.map(h => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <span>{h.dice} ➔ [{h.rolls.join(', ')}]</span>
                    <strong>Total: {h.sum}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
