import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function LoanInterest() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10);
  const [timeYears, setTimeYears] = useState(3);
  const [type, setType] = useState('compound'); // 'simple' or 'compound'
  const [compoundFreq, setCompoundFreq] = useState(1); // 1 = annually, 4 = quarterly, 12 = monthly

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(timeYears) || 0;

  let interest = 0;
  let totalAmount = 0;

  if (P > 0 && R >= 0 && T > 0) {
    if (type === 'simple') {
      interest = (P * R * T) / 100;
      totalAmount = P + interest;
    } else {
      const n = compoundFreq;
      totalAmount = P * Math.pow(1 + R / (100 * n), n * T);
      interest = totalAmount - P;
    }
  }

  const reset = () => {
    setPrincipal(500000);
    setRate(10);
    setTimeYears(3);
    setType('compound');
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Principal Amount (₹)</label>
          <input type="number" className="input-field" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Interest Rate (%)</label>
          <input type="number" step="0.1" className="input-field" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Time Period (Years)</label>
          <input type="number" className="input-field" value={timeYears} onChange={e => setTimeYears(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Interest Type</label>
          <select className="select-field" value={type} onChange={e => setType(e.target.value)}>
            <option value="compound">Compound Interest</option>
            <option value="simple">Simple Interest</option>
          </select>
        </div>
        {type === 'compound' && (
          <div className="form-group">
            <label className="form-label">Compounding Frequency</label>
            <select className="select-field" value={compoundFreq} onChange={e => setCompoundFreq(Number(e.target.value))}>
              <option value={1}>Compounded Annually (1x/yr)</option>
              <option value={2}>Compounded Semi-Annually (2x/yr)</option>
              <option value={4}>Compounded Quarterly (4x/yr)</option>
              <option value={12}>Compounded Monthly (12x/yr)</option>
            </select>
          </div>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="tool-result">
        <div className="grid grid-3" style={{ textAlign: 'center' }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Principal Borrowed</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-1)' }}>
              {formatCurrency(P)}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total Interest Accrued</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(interest))}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total Repayment Due</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(totalAmount))}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
