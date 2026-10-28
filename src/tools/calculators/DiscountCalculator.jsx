import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(2500);
  const [discountPercent, setDiscountPercent] = useState(20);

  const price = parseFloat(originalPrice) || 0;
  const pct = parseFloat(discountPercent) || 0;

  const savings = (price * pct) / 100;
  const finalPrice = Math.max(0, price - savings);

  const reset = () => {
    setOriginalPrice(2500);
    setDiscountPercent(20);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Original Price (₹)</label>
          <input
            type="number"
            className="input-field"
            value={originalPrice}
            onChange={e => setOriginalPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Discount Percentage (%)</label>
          <input
            type="number"
            className="input-field"
            min={0}
            max={100}
            value={discountPercent}
            onChange={e => setDiscountPercent(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="tool-result">
        <div className="grid grid-3" style={{ textAlign: 'center' }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Original Price</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textDecoration: 'line-through', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(price)}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>You Save (Discount)</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', marginTop: 'var(--space-1)' }}>
              - {formatCurrency(savings)}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)', borderColor: 'var(--color-primary)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Final Price to Pay</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(finalPrice)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
