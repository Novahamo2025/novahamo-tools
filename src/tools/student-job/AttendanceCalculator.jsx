import { useState } from 'react';
import { RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [target, setTarget] = useState(75);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const att = parseInt(attended, 10);
    const tot = parseInt(total, 10);
    const tgt = parseFloat(target);

    if (isNaN(att) || isNaN(tot) || isNaN(tgt)) {
      setError('Please provide valid numbers.');
      return;
    }
    if (tot <= 0) {
      setError('Total classes must be greater than zero.');
      return;
    }
    if (att < 0 || att > tot) {
      setError('Attended classes must be between 0 and total classes.');
      return;
    }
    if (tgt <= 0 || tgt > 100) {
      setError('Target percentage must be between 1% and 100%.');
      return;
    }

    const currentPct = (att / tot) * 100;

    let classesNeeded = 0;
    let canBunk = 0;

    if (currentPct < tgt) {
      // Need to attend more: (att + x) / (tot + x) >= tgt / 100
      // 100*att + 100*x >= tgt*tot + tgt*x
      // x * (100 - tgt) >= tgt*tot - 100*att
      classesNeeded = Math.ceil((tgt * tot - 100 * att) / (100 - tgt));
    } else {
      // Can bunk: att / (tot + y) >= tgt / 100
      // 100*att >= tgt*tot + tgt*y
      // y <= (100*att - tgt*tot) / tgt
      canBunk = Math.floor((100 * att - tgt * tot) / tgt);
    }

    setResult({
      currentPct: currentPct.toFixed(2),
      isAboveTarget: currentPct >= tgt,
      classesNeeded: Math.max(0, classesNeeded),
      canBunk: Math.max(0, canBunk),
    });
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Classes Attended</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 42"
            value={attended}
            onChange={e => setAttended(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total Classes Conducted</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 50"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Target Attendance (%)</label>
          <input
            type="number"
            className="input-field"
            value={target}
            onChange={e => setTarget(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={calculate} disabled={!attended || !total}>Calculate Attendance</button>
        <button className="btn btn-ghost" onClick={() => { setAttended(''); setTotal(''); setResult(null); setError(''); }}><RotateCcw size={16} /> Reset</button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Current Attendance</p>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: result.isAboveTarget ? 'var(--color-success)' : 'var(--color-error)',
              margin: 'var(--space-2) 0'
            }}>
              {result.currentPct}%
            </h2>

            {result.isAboveTarget ? (
              <div className="notification notification-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CheckCircle size={18} />
                <span>You are safely above your {target}% target! You can miss up to <strong>{result.canBunk}</strong> upcoming class{result.canBunk !== 1 ? 'es' : ''}.</span>
              </div>
            ) : (
              <div className="notification notification-error" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <AlertTriangle size={18} />
                <span>Below target! You must attend the next <strong>{result.classesNeeded}</strong> consecutive class{result.classesNeeded !== 1 ? 'es' : ''} to reach {target}%.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
