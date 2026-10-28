import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [bonus, setBonus] = useState(100000);
  const [regime, setRegime] = useState('new'); // 'new' or 'old'
  const [pfContribution, setPfContribution] = useState(true);

  const annualCtc = parseFloat(ctc) || 0;
  const annualBonus = parseFloat(bonus) || 0;
  const fixedCtc = Math.max(0, annualCtc - annualBonus);

  // Standard salary component estimates:
  // Basic = 40% of Fixed CTC
  const basicSalary = fixedCtc * 0.4;
  const hra = basicSalary * 0.5;
  const specialAllowance = fixedCtc - (basicSalary + hra);

  // Monthly Employee PF = 12% of Basic (capped usually at 1800/mo or actual)
  const employeePfMonthly = pfContribution ? Math.min(basicSalary / 12 * 0.12, basicSalary / 12 * 0.12) : 0;
  const professionalTaxMonthly = 200; // Standard in India

  // Rough Tax Estimation
  let taxableAnnual = fixedCtc;
  if (regime === 'new') {
    // 75,000 standard deduction
    taxableAnnual = Math.max(0, fixedCtc - 75000);
  } else {
    // 50,000 standard deduction + 80C PF
    taxableAnnual = Math.max(0, fixedCtc - 50000 - (employeePfMonthly * 12));
  }

  // Simplified tax slab approximation
  let estimatedAnnualTax = 0;
  if (taxableAnnual > 1500000) {
    estimatedAnnualTax = (taxableAnnual - 1500000) * 0.3 + 150000;
  } else if (taxableAnnual > 1000000) {
    estimatedAnnualTax = (taxableAnnual - 1000000) * 0.15 + 60000;
  } else if (taxableAnnual > 700000) {
    estimatedAnnualTax = (taxableAnnual - 700000) * 0.10 + 20000;
  }

  const monthlyGross = fixedCtc / 12;
  const monthlyTds = estimatedAnnualTax / 12;
  const monthlyInHand = Math.max(0, monthlyGross - employeePfMonthly - professionalTaxMonthly - monthlyTds);

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Total Annual CTC (₹)</label>
          <input type="number" className="input-field" value={ctc} onChange={e => setCtc(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Variable / Bonus (₹)</label>
          <input type="number" className="input-field" value={bonus} onChange={e => setBonus(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Tax Regime</label>
          <select className="select-field" value={regime} onChange={e => setRegime(e.target.value)}>
            <option value="new">New Tax Regime</option>
            <option value="old">Old Tax Regime</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={pfContribution} onChange={e => setPfContribution(e.target.checked)} />
          Include Employee Provident Fund (EPF 12% deduction)
        </label>
      </div>

      <div className="tool-result">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', marginBottom: 'var(--space-6)', borderColor: 'var(--color-primary)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Estimated Monthly Take-Home (In-Hand)</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
            {formatCurrency(Math.round(monthlyInHand))}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}> / month</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Annual In-Hand: <strong>{formatCurrency(Math.round(monthlyInHand * 12))}</strong> (+ variable {formatCurrency(annualBonus)})
          </p>
        </div>

        <div className="grid grid-3" style={{ textAlign: 'center' }}>
          <div className="card" style={{ padding: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Gross Monthly</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(Math.round(monthlyGross))}</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Monthly PF Deduction</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444' }}>-{formatCurrency(Math.round(employeePfMonthly))}</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Est. Monthly TDS / Tax</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444' }}>-{formatCurrency(Math.round(monthlyTds))}</p>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-4)' }}>
          Disclaimer: Figures are indicative estimates based on standard salary structures and prevailing tax slabs. Actual payroll deductions depend on employer flexi-benefit declarations.
        </p>
      </div>
    </div>
  );
}
