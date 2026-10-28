import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

  const P = parseFloat(principal) || 0;
  const annualR = parseFloat(rate) || 0;
  const N = (parseInt(tenureYears, 10) || 0) * 12;

  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (P > 0 && N > 0) {
    if (annualR === 0) {
      emi = P / N;
      totalPayment = P;
      totalInterest = 0;
    } else {
      const r = annualR / (12 * 100);
      emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      totalPayment = emi * N;
      totalInterest = totalPayment - P;
    }
  }

  const reset = () => {
    setPrincipal(1000000);
    setRate(8.5);
    setTenureYears(5);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Loan Principal Amount (₹)</label>
          <input
            type="number"
            className="input-field"
            value={principal}
            onChange={e => setPrincipal(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            className="input-field"
            value={rate}
            onChange={e => setRate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (Years)</label>
          <input
            type="number"
            className="input-field"
            value={tenureYears}
            onChange={e => setTenureYears(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="tool-result">
        <div className="grid grid-3" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Monthly Loan EMI</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(emi))}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total Interest Payable</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(totalInterest))}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total Repayment (Principal + Int)</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(totalPayment))}
            </h2>
          </div>
        </div>

        <div className="progress-bar" style={{ height: 12 }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${totalPayment > 0 ? (P / totalPayment) * 100 : 50}%` }}
            title="Principal portion"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
          <span>Principal: {totalPayment > 0 ? ((P / totalPayment) * 100).toFixed(1) : 0}%</span>
          <span>Interest: {totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(1) : 0}%</span>
        </div>
      </div>
    </div>
  );
}
