import { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [isDecimal, setIsDecimal] = useState(false);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState([]);

  const generate = () => {
    const mn = parseFloat(min);
    const mx = parseFloat(max);
    if (isNaN(mn) || isNaN(mx) || mn >= mx) return;

    const generated = [];
    // Cryptographically secure randomness
    const array = new Uint32Array(count);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < count; i++) {
      const randRatio = array[i] / (0xFFFFFFFF + 1);
      if (isDecimal) {
        const val = mn + randRatio * (mx - mn);
        generated.push(val.toFixed(4));
      } else {
        const val = Math.floor(mn + randRatio * (mx - mn + 1));
        generated.push(val);
      }
    }
    setResults(generated);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Minimum</label>
          <input type="number" className="input-field" value={min} onChange={e => setMin(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Maximum</label>
          <input type="number" className="input-field" value={max} onChange={e => setMax(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input type="number" min={1} max={50} className="input-field" value={count} onChange={e => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} />
        </div>
        <div className="form-group">
          <label className="form-label">Number Type</label>
          <select className="select-field" value={isDecimal ? 'decimal' : 'integer'} onChange={e => setIsDecimal(e.target.value === 'decimal')}>
            <option value="integer">Integer (Whole numbers)</option>
            <option value="decimal">Decimal (Floating point)</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate}><Sparkles size={16} /> Generate Random Number</button>
        <button className="btn btn-ghost" onClick={() => setResults([])}><RotateCcw size={16} /> Clear</button>
      </div>

      {results.length > 0 && (
        <div className="tool-result">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
            {results.map((res, idx) => (
              <div key={idx} className="card" style={{
                padding: 'var(--space-4) var(--space-6)',
                textAlign: 'center',
                minWidth: 100,
                border: '2px solid var(--color-primary)'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{res}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
