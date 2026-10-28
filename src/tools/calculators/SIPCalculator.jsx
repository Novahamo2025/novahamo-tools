import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SIPCalculator() {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);

  const P = parseFloat(monthlyInvest) || 0;
  const annualRate = parseFloat(expectedReturn) || 0;
  const n = (parseInt(timePeriodYears, 10) || 0) * 12;

  let totalInvested = P * n;
  let futureValue = 0;
  let estimatedReturns = 0;

  if (P > 0 && n > 0) {
    const i = annualRate / (12 * 100);
    if (i === 0) {
      futureValue = totalInvested;
      estimatedReturns = 0;
    } else {
      // Future Value formula for SIP with monthly compounding:
      // FV = P * [ (1 + i)^n - 1 ] * (1 + i) / i
      futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      estimatedReturns = futureValue - totalInvested;
    }
  }

  const reset = () => {
    setMonthlyInvest(5000);
    setExpectedReturn(12);
    setTimePeriodYears(10);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Monthly Investment Amount (₹)</label>
          <input
            type="number"
            className="input-field"
            value={monthlyInvest}
            onChange={e => setMonthlyInvest(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Expected Annual Return Rate (%)</label>
          <input
            type="number"
            step="0.5"
            className="input-field"
            value={expectedReturn}
            onChange={e => setExpectedReturn(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Investment Duration (Years)</label>
          <input
            type="number"
            className="input-field"
            value={timePeriodYears}
            onChange={e => setTimePeriodYears(e.target.value)}
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
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Invested Amount</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(totalInvested))}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Estimated Wealth Gain</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(estimatedReturns))}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Expected Maturity Value</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: 'var(--space-1)' }}>
              {formatCurrency(Math.round(futureValue))}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          * Projections are based on mathematical compounded return assumptions and do not constitute guaranteed returns.
        </p>
      </div>
    </div>
  );
}
