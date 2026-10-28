import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function MarksPercentage() {
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);
    const obt = parseFloat(obtained);
    const tot = parseFloat(total);

    if (isNaN(obt) || isNaN(tot)) {
      setError('Please enter valid numeric marks.');
      return;
    }
    if (tot <= 0) {
      setError('Total marks must be greater than zero.');
      return;
    }
    if (obt < 0) {
      setError('Obtained marks cannot be negative.');
      return;
    }
    if (obt > tot) {
      setError('Obtained marks cannot exceed total marks.');
      return;
    }

    const pct = (obt / tot) * 100;
    let grade = 'F';
    if (pct >= 90) grade = 'A+ (Outstanding)';
    else if (pct >= 80) grade = 'A (Excellent)';
    else if (pct >= 70) grade = 'B+ (Very Good)';
    else if (pct >= 60) grade = 'B (Good)';
    else if (pct >= 50) grade = 'C (Satisfactory)';
    else if (pct >= 40) grade = 'D (Pass)';

    setResult({
      percentage: pct.toFixed(2),
      grade,
      lost: (tot - obt).toFixed(2),
    });
  };

  const reset = () => {
    setObtained('');
    setTotal('');
    setResult(null);
    setError('');
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Marks Obtained</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 485"
            value={obtained}
            onChange={e => setObtained(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total Maximum Marks</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 600"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={calculate} disabled={!obtained || !total}>Calculate Percentage</button>
        <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Calculated Result</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
              {result.percentage}%
            </h2>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Grade: {result.grade}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              Marks Lost: {result.lost} / {total}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
