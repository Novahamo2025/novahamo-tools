import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function DateDifference() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  let valid = !isNaN(d1.getTime()) && !isNaN(d2.getTime());
  let earlier = d1 < d2 ? d1 : d2;
  let later = d1 < d2 ? d2 : d1;

  let totalDays = 0;
  let weeks = 0;
  let remainingDays = 0;
  let years = 0;
  let months = 0;
  let days = 0;

  if (valid) {
    const diffMs = later.getTime() - earlier.getTime();
    totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    weeks = Math.floor(totalDays / 7);
    remainingDays = totalDays % 7;

    let y = later.getFullYear() - earlier.getFullYear();
    let m = later.getMonth() - earlier.getMonth();
    let d = later.getDate() - earlier.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }
    years = y;
    months = m;
    days = d;
  }

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      {valid && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Calculated Duration</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
              {years} <span style={{ fontSize: '1.25rem' }}>Years</span>, {months} <span style={{ fontSize: '1.25rem' }}>Months</span>, {days} <span style={{ fontSize: '1.25rem' }}>Days</span>
            </h2>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Or <strong>{totalDays.toLocaleString()}</strong> total calendar days ({weeks} weeks + {remainingDays} days)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
