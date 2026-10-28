import { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  let bmi = 0;

  if (unit === 'metric') {
    const w = parseFloat(weightKg) || 0;
    const h = (parseFloat(heightCm) || 0) / 100;
    if (w > 0 && h > 0) {
      bmi = w / (h * h);
    }
  } else {
    const w = parseFloat(weightLbs) || 0;
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    if (w > 0 && totalInches > 0) {
      bmi = (w / (totalInches * totalInches)) * 703;
    }
  }

  let category = 'Normal weight';
  let categoryColor = 'var(--color-success)';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3B82F6';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Healthy Normal weight';
    categoryColor = 'var(--color-success)';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    categoryColor = '#F59E0B';
  } else if (bmi >= 30) {
    category = 'Obesity';
    categoryColor = 'var(--color-error)';
  }

  return (
    <div className="tool-workspace">
      <div className="form-group" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <button
            className={`btn btn-sm ${unit === 'metric' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setUnit('metric')}
          >
            Metric (kg, cm)
          </button>
          <button
            className={`btn btn-sm ${unit === 'imperial' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial (lbs, ft/in)
          </button>
        </div>
      </div>

      {unit === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Weight (Kilograms)</label>
            <input type="number" className="input-field" value={weightKg} onChange={e => setWeightKg(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (Centimeters)</label>
            <input type="number" className="input-field" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Weight (Pounds)</label>
            <input type="number" className="input-field" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (Feet)</label>
            <input type="number" className="input-field" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (Inches)</label>
            <input type="number" className="input-field" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
          </div>
        </div>
      )}

      <div className="tool-result" style={{ textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 450, margin: '0 auto', padding: 'var(--space-8)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Body Mass Index</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: categoryColor, margin: 'var(--space-2) 0' }}>
            {bmi > 0 ? bmi.toFixed(1) : '—'}
          </h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: categoryColor }}>
            {category}
          </p>

          <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: '0.7rem' }}>
            <div style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: 'var(--space-1)', borderRadius: 'var(--radius-sm)' }}>&lt; 18.5<br/>Under</div>
            <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: 'var(--space-1)', borderRadius: 'var(--radius-sm)' }}>18.5 - 24.9<br/>Normal</div>
            <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: 'var(--space-1)', borderRadius: 'var(--radius-sm)' }}>25 - 29.9<br/>Over</div>
            <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: 'var(--space-1)', borderRadius: 'var(--radius-sm)' }}>≥ 30<br/>Obese</div>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
          Note: BMI is a clinical screening metric and does not distinguish muscle mass from body fat distribution.
        </p>
      </div>
    </div>
  );
}
