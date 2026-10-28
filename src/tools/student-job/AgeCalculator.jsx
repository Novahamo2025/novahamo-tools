import { useState } from 'react';
import { RotateCcw, Calendar, Clock } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const b = new Date(birthDate);
    const t = new Date(targetDate);

    if (isNaN(b.getTime()) || isNaN(t.getTime())) {
      setError('Please provide valid dates.');
      return;
    }
    if (b > t) {
      setError('Date of birth cannot be in the future relative to the reference date.');
      return;
    }

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Next birthday calculation
    let nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNext = Math.ceil((nextBday - t) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToNext,
    });
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="input-field"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Calculate Age At (Reference Date)</label>
          <input
            type="date"
            className="input-field"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={calculate} disabled={!birthDate}>Calculate Exact Age</button>
        <button className="btn btn-ghost" onClick={() => { setBirthDate(''); setResult(null); setError(''); }}><RotateCcw size={16} /> Reset</button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Your Current Age</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
              {result.years} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Years</span>, {result.months} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Months</span>, {result.days} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Days</span>
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
              🎉 Next birthday is in <strong>{result.daysToNext} days</strong>!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Total Weeks</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{result.totalWeeks.toLocaleString()}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Total Days</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{result.totalDays.toLocaleString()}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Total Hours</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{result.totalHours.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
