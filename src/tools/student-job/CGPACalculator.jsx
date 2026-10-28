import React, { useState, useCallback } from 'react';
import { Calculator, Plus, Trash2, RotateCcw } from 'lucide-react';

const DEFAULT_GRADES = [
  { label: 'O (Outstanding)', value: 10 },
  { label: 'A+ (Excellent)', value: 9 },
  { label: 'A (Very Good)', value: 8 },
  { label: 'B+ (Good)', value: 7 },
  { label: 'B (Above Average)', value: 6 },
  { label: 'C (Average)', value: 5 },
  { label: 'F (Fail)', value: 0 },
];

const emptySubject = () => ({ name: '', credits: '', grade: '10' });
const emptySemester = () => ({ name: 'Semester 1', subjects: [emptySubject()] });

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([emptySemester()]);
  const [grades] = useState(DEFAULT_GRADES);
  const [result, setResult] = useState(null);

  const updateSemester = (si, field, value) => {
    setSemesters(prev => prev.map((s, i) => i === si ? { ...s, [field]: value } : s));
  };

  const updateSubject = (si, sji, field, value) => {
    setSemesters(prev => prev.map((s, i) => {
      if (i !== si) return s;
      const subjects = s.subjects.map((sub, j) => j === sji ? { ...sub, [field]: value } : sub);
      return { ...s, subjects };
    }));
  };

  const addSemester = () => {
    setSemesters(prev => [...prev, { name: `Semester ${prev.length + 1}`, subjects: [emptySubject()] }]);
  };

  const removeSemester = (si) => {
    if (semesters.length > 1) setSemesters(prev => prev.filter((_, i) => i !== si));
  };

  const addSubject = (si) => {
    setSemesters(prev => prev.map((s, i) => i === si ? { ...s, subjects: [...s.subjects, emptySubject()] } : s));
  };

  const removeSubject = (si, sji) => {
    setSemesters(prev => prev.map((s, i) => {
      if (i !== si || s.subjects.length <= 1) return s;
      return { ...s, subjects: s.subjects.filter((_, j) => j !== sji) };
    }));
  };

  const calculate = useCallback(() => {
    const semesterResults = [];
    let totalCredits = 0;
    let totalWeighted = 0;

    for (const sem of semesters) {
      let semCredits = 0;
      let semWeighted = 0;
      let valid = false;

      for (const sub of sem.subjects) {
        const credits = parseFloat(sub.credits);
        const grade = parseFloat(sub.grade);
        if (!isNaN(credits) && credits > 0 && !isNaN(grade)) {
          semCredits += credits;
          semWeighted += credits * grade;
          valid = true;
        }
      }

      const sgpa = valid && semCredits > 0 ? semWeighted / semCredits : 0;
      semesterResults.push({ name: sem.name, sgpa, credits: semCredits, valid });

      if (valid) {
        totalCredits += semCredits;
        totalWeighted += semWeighted;
      }
    }

    const cgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;
    setResult({ semesters: semesterResults, cgpa, totalCredits });
  }, [semesters]);

  const reset = () => { setSemesters([emptySemester()]); setResult(null); };

  return (
    <div className="tool-workspace">
      <p>Calculate your Cumulative GPA across multiple semesters. Add subjects with credits and grades for each semester.</p>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        <strong>Note:</strong> Grading scales vary by institution. The default scale shown (O=10 to F=0) is commonly used in Indian universities.
      </p>

      {semesters.map((sem, si) => (
        <div className="card" key={si}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <input className="input-field" value={sem.name} onChange={e => updateSemester(si, 'name', e.target.value)}
              style={{ maxWidth: '200px', fontWeight: 'bold' }} />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn btn-secondary" onClick={() => addSubject(si)} style={{ padding: '4px 8px' }}><Plus size={14} /> Subject</button>
              <button className="btn btn-secondary" onClick={() => removeSemester(si)} style={{ padding: '4px 8px' }}><Trash2 size={14} /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Subject</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Credits</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Grade</span>
            <span></span>
          </div>

          {sem.subjects.map((sub, sji) => (
            <div key={sji} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <input className="input-field" placeholder="Subject name" value={sub.name} onChange={e => updateSubject(si, sji, 'name', e.target.value)} />
              <input className="input-field" type="number" min={0} placeholder="Credits" value={sub.credits} onChange={e => updateSubject(si, sji, 'credits', e.target.value)} />
              <select className="input-field" value={sub.grade} onChange={e => updateSubject(si, sji, 'grade', e.target.value)}>
                {grades.map(g => <option key={g.value} value={g.value}>{g.label} ({g.value})</option>)}
              </select>
              <button className="btn btn-secondary" onClick={() => removeSubject(si, sji)} style={{ padding: '4px 6px' }}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      ))}

      <div className="tool-actions">
        <button className="btn btn-secondary" onClick={addSemester}><Plus size={16} /> Add Semester</button>
        <button className="btn btn-primary" onClick={calculate}><Calculator size={16} /> Calculate CGPA</button>
        <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card">
            {result.semesters.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{s.name}</span>
                <span><strong>SGPA: {s.valid ? s.sgpa.toFixed(2) : 'N/A'}</strong> ({s.credits} credits)</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '8px 0', fontSize: '36px', color: 'var(--primary-color)' }}>CGPA: {result.cgpa.toFixed(2)}</h2>
            <p>Total Credits: {result.totalCredits} | Approximate %: {(result.cgpa * 10 - 7.5).toFixed(1)}% (approx.)</p>
          </div>
        </div>
      )}
    </div>
  );
}
