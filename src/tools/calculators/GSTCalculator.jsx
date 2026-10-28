import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const GST_SLABS = [5, 12, 18, 28];

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState('add'); // 'add' or 'remove'

  const amt = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;

  let gstAmount = 0;
  let netAmount = 0;
  let totalAmount = 0;

  if (amt > 0 && r >= 0) {
    if (mode === 'add') {
      netAmount = amt;
      gstAmount = (amt * r) / 100;
      totalAmount = netAmount + gstAmount;
    } else {
      // Inclusive GST extraction:
      // total = net * (1 + r/100) => net = total / (1 + r/100)
      totalAmount = amt;
      netAmount = totalAmount / (1 + r / 100);
      gstAmount = totalAmount - netAmount;
    }
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Base Amount (₹)</label>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">GST Rate (%)</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select className="select-field" value={rate} onChange={e => setRate(Number(e.target.value))}>
              {GST_SLABS.map(s => <option key={s} value={s}>{s}% Slab</option>)}
              <option value={0}>0% (Exempt)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Calculation Type</label>
          <select className="select-field" value={mode} onChange={e => setMode(e.target.value)}>
            <option value="add">Exclusive (Add GST to Base)</option>
            <option value="remove">Inclusive (Extract GST from Total)</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-ghost" onClick={() => { setAmount(1000); setRate(18); setMode('add'); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="tool-result">
        <div className="grid grid-3" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Net Amount (Pre-Tax)</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-1)' }}>
              {formatCurrency(netAmount)}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total GST ({rate}%)</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(gstAmount)}
            </h2>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Final Invoice Total</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803D', marginTop: 'var(--space-1)' }}>
              {formatCurrency(totalAmount)}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          <span>CGST ({rate / 2}%): <strong>{formatCurrency(cgst)}</strong></span>
          <span>SGST/UTGST ({rate / 2}%): <strong>{formatCurrency(sgst)}</strong></span>
          <span>IGST ({rate}%): <strong>{formatCurrency(gstAmount)}</strong></span>
        </div>
      </div>
    </div>
  );
}
