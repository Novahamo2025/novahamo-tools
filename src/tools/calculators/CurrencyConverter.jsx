import { useState, useEffect } from 'react';
import { ArrowRightLeft, Info, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 155.0,
  AED: 3.67,
};

export default function CurrencyConverter() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [customRate, setCustomRate] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Reference Base Rates (Manual/Configurable)');
  const [isCustom, setIsCustom] = useState(false);

  const amt = parseFloat(amount) || 0;

  let calculated = 0;
  let effectiveRate = 1;

  if (isCustom && parseFloat(customRate) > 0) {
    effectiveRate = parseFloat(customRate);
    calculated = amt * effectiveRate;
  } else {
    const rateFrom = rates[fromCurrency] || 1;
    const rateTo = rates[toCurrency] || 1;
    effectiveRate = rateTo / rateFrom;
    calculated = amt * effectiveRate;
  }

  const swap = () => {
    const tmp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tmp);
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Exchange Rate Transparency:</strong> Live market forex rates fluctuate constantly. You can use standard benchmark rates below or type your exact bank/custom conversion rate directly.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">From Currency</label>
          <select className="select-field" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
            {Object.keys(rates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">To Currency</label>
          <select className="select-field" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
            {Object.keys(rates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={isCustom} onChange={e => setIsCustom(e.target.checked)} />
          Use Manual Exchange Rate (Custom Input)
        </label>
        {isCustom && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <input
              type="number"
              step="0.0001"
              placeholder={`1 ${fromCurrency} = ? ${toCurrency}`}
              className="input-field"
              value={customRate}
              onChange={e => setCustomRate(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn btn-secondary btn-sm" onClick={swap}>
          <ArrowRightLeft size={14} /> Swap Currencies
        </button>
      </div>

      <div className="tool-result">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Estimated Conversion</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
            {calculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            1 {fromCurrency} = {effectiveRate.toFixed(4)} {toCurrency}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            Source: {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
