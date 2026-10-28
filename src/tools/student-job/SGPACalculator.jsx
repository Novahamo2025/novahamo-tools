import React, { useState, useCallback } from 'react';
import { Calculator, Plus, Trash2, RotateCcw } from 'lucide-react';

const emptySubject = () => ({ name: '', credits: '', gradePoint: '' });

export default function SGPACalculator() {
  const [subjects, setSubjects] = useState([emptySubject(), emptySubject(), emptySubject()]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const update = (idx, field, value) => {
    setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSubject = () => setSubjects(prev => [...prev, emptySubject()]);

  const removeSubject = (idx) => {
    if (subjects.length > 1) setSubjects(prev => prev.filter((_, i) => i !== idx));
  };

  const calculate = useCallback(() => {
    setError('');
    let totalCredits = 0;
    let totalWeighted = 0;
    let hasValid = false;

    for (const sub of subjects) {
      const credits = parseFloat(sub.credits);
      const gp = parseFloat(sub.gradePoint);

      if (sub.credits === '' && sub.gradePoint === '' && sub.name === '') continue;

      if (isNaN(credits) || credits <= 0) {
        setError('All subjects must have valid credits (> 0).');
        return;
      }
      if (isNaN(gp) || gp < 0) {
        setError('All subjects must have valid grade points (≥ 0).');
        return;
      }

      totalCredits += credits;
      totalWeighted += credits * gp;
      hasValid = true;
    }

    if (!hasValid) { setError('Please add at least one subject with valid data.'); return; }

    const sgpa = totalWeighted / totalCredits;
    setResult({ sgpa, totalCredits, totalWeighted });
  }, [subjects]);

  const reset = () => {
    setSubjects([emptySubject(), emptySubject(), emptySubject()]);
    setResult(null);
    setError('');
  };

  return (
    <div className="tool-workspace">
      <p>Calculate your Semester Grade Point Average (SGPA). Enter each subject's credits and grade point.</p>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SGPA = Σ(Credits × Grade Points) / Σ(Credits)</p>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
          <span className="form-label">Subject</span>
          <span className="form-label">Credits</span>
          <span className="form-label">Grade Point</span>
          <span></span>
        </div>

        {subjects.map((sub, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
            <input className="input-field" placeholder={`Subject ${i + 1}`} value={sub.name} onChange={e => update(i, 'name', e.target.value)} />
            <input className="input-field" type="number" min={0} step={0.5} placeholder="Credits" value={sub.credits} onChange={e => update(i, 'credits', e.target.value)} />
            <input className="input-field" type="number" min={0} max={10} step={0.1} placeholder="GP" value={sub.gradePoint} onChange={e => update(i, 'gradePoint', e.target.value)} />
            <button className="btn btn-secondary" onClick={() => removeSubject(i)} style={{ padding: '4px 6px' }}><Trash2 size={14} /></button>
          </div>
        ))}

        <button className="btn btn-secondary" onClick={addSubject} style={{ marginTop: '8px' }}><Plus size={14} /> Add Subject</button>
      </div>

      {error && <p style={{ color: '#e74c3c' }}>{error}</p>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={calculate}><Calculator size={16} /> Calculate SGPA</button>
        <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '8px 0', fontSize: '40px', color: 'var(--primary-color)' }}>{result.sgpa.toFixed(2)}</h2>
            <p>SGPA</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
              <div><strong>Total Credits:</strong> {result.totalCredits}</div>
              <div><strong>Weighted Sum:</strong> {result.totalWeighted.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
