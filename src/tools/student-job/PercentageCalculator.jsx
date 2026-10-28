import React, { useState, useCallback } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export default function PercentageCalculator() {
  const [mode, setMode] = useState('of'); // 'of', 'is', 'change'
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [result, setResult] = useState(null);

  const calculate = useCallback(() => {
    const xVal = parseFloat(x);
    const yVal = parseFloat(y);
    if (isNaN(xVal) || isNaN(yVal)) return;

    let value, formula;

    switch (mode) {
      case 'of':
        value = (xVal / 100) * yVal;
        formula = `${xVal}% of ${yVal} = (${xVal} / 100) × ${yVal} = ${value}`;
        break;
      case 'is':
        if (yVal === 0) { setResult({ value: 'Error', formula: 'Cannot divide by zero.' }); return; }
        value = (xVal / yVal) * 100;
        formula = `${xVal} is what % of ${yVal} = (${xVal} / ${yVal}) × 100 = ${value.toFixed(4)}%`;
        break;
      case 'change':
        if (xVal === 0) { setResult({ value: 'Error', formula: 'Original value cannot be zero for percentage change.' }); return; }
        value = ((yVal - xVal) / Math.abs(xVal)) * 100;
        formula = `% change from ${xVal} to ${yVal} = ((${yVal} - ${xVal}) / |${xVal}|) × 100 = ${value.toFixed(4)}%`;
        break;
      default: return;
    }

    setResult({
      value: typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(4)) : value,
      formula
    });
  }, [mode, x, y]);

  const reset = () => { setX(''); setY(''); setResult(null); };

  const modes = [
    { key: 'of', label: 'What is X% of Y?' },
    { key: 'is', label: 'X is what % of Y?' },
    { key: 'change', label: '% Change from X to Y' },
  ];

  const getLabels = () => {
    switch (mode) {
      case 'of': return { x: 'Percentage (%)', y: 'Value' };
      case 'is': return { x: 'Value', y: 'Total' };
      case 'change': return { x: 'Original Value', y: 'New Value' };
      default: return { x: 'X', y: 'Y' };
    }
  };

  const labels = getLabels();

  return (
    <div className="tool-workspace">
      <p>Calculate percentages in three different modes.</p>

      <div className="card">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {modes.map(m => (
            <button key={m.key} className={`btn ${mode === m.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setMode(m.key); setResult(null); }}>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">{labels.x}</label>
            <input className="input-field" type="number" value={x} onChange={e => setX(e.target.value)} placeholder="Enter value" />
          </div>
          <div className="form-group">
            <label className="form-label">{labels.y}</label>
            <input className="input-field" type="number" value={y} onChange={e => setY(e.target.value)} placeholder="Enter value" />
          </div>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={calculate} disabled={x === '' || y === ''}><Calculator size={16} /> Calculate</button>
        <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '8px 0', fontSize: '36px', color: 'var(--primary-color)' }}>{result.value}</h2>
            <p style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{result.formula}</p>
          </div>
        </div>
      )}
    </div>
  );
}
