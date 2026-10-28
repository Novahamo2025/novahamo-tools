import React, { useState, useCallback } from 'react';
import { Search, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was','are','were',
  'be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall',
  'can','need','must','it','its','this','that','these','those','i','you','he','she','we','they','me','him','her',
  'us','them','my','your','his','our','their','what','which','who','whom','where','when','how','not','no','nor',
  'if','then','than','so','up','out','about','into','over','after','all','also','just','more','most','other',
  'some','such','only','very','too','each','every','any','few','between','through','during','before','because',
  'while','both','same','own','able','get','got','make','made','work','working','use','used','using','new','well'
]);

function extractKeywords(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9+#\s./-]/g, ' ');
  const words = cleaned.split(/\s+/).filter(w => w.length > 1);
  const keywords = new Set();
  // Single words
  words.forEach(w => { if (!STOP_WORDS.has(w) && w.length > 2) keywords.add(w); });
  // Bigrams for multi-word skills
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) keywords.add(bigram);
  }
  return [...keywords];
}

export default function ATSResumeChecker() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);

  const analyze = useCallback(() => {
    if (!resumeText.trim() || !jobDesc.trim()) return;

    const jobKeywords = extractKeywords(jobDesc);
    const resumeLower = resumeText.toLowerCase();

    const matched = [];
    const missing = [];

    jobKeywords.forEach(kw => {
      if (resumeLower.includes(kw)) matched.push(kw);
      else missing.push(kw);
    });

    const score = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;

    // Section analysis
    const sections = [];
    const checkSection = (name, patterns) => {
      const found = patterns.some(p => resumeLower.includes(p.toLowerCase()));
      sections.push({ name, found });
    };
    checkSection('Contact Information', ['email', 'phone', '@', 'linkedin']);
    checkSection('Summary / Objective', ['summary', 'objective', 'profile', 'about']);
    checkSection('Experience', ['experience', 'employment', 'work history']);
    checkSection('Education', ['education', 'degree', 'university', 'college']);
    checkSection('Skills', ['skills', 'technologies', 'proficiencies', 'competencies']);
    checkSection('Projects', ['projects', 'portfolio']);

    const tips = [];
    if (score < 50) tips.push('Your resume matches less than half the job keywords. Consider tailoring it more closely to the job description.');
    if (missing.length > 10) tips.push(`You're missing ${missing.length} keywords. Try incorporating the most relevant ones naturally into your resume.`);
    if (!sections.find(s => s.name === 'Skills')?.found) tips.push('Consider adding a dedicated "Skills" section to your resume.');
    if (!sections.find(s => s.name === 'Summary / Objective')?.found) tips.push('Adding a professional summary can help highlight your fit for the role.');
    if (resumeText.length < 300) tips.push('Your resume seems short. Consider adding more detail about your experience and achievements.');
    if (score >= 70) tips.push('Good keyword match! Focus on ensuring your experience descriptions use strong action verbs.');

    setResult({ score, matched, missing, sections, tips, totalKeywords: jobKeywords.length });
  }, [resumeText, jobDesc]);

  const reset = () => { setResumeText(''); setJobDesc(''); setResult(null); };

  const getScoreColor = (score) => {
    if (score >= 70) return '#27ae60';
    if (score >= 40) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="tool-workspace">
      <p>Estimate how well your resume matches a job description based on keyword analysis. <strong>Note:</strong> This is a simplified keyword-matching estimate, not a real ATS system.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Your Resume Text</label>
          <textarea className="textarea-field" rows={12} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..." />
        </div>
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea className="textarea-field" rows={12} value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description here..." />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={analyze} disabled={!resumeText.trim() || !jobDesc.trim()}>
          <Search size={16} /> Analyze Match
        </button>
        <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ color: getScoreColor(result.score), fontSize: '48px', margin: '8px 0' }}>{result.score}%</h2>
            <p>Keyword Match Score ({result.matched.length} of {result.totalKeywords} keywords matched)</p>
          </div>

          <div className="card">
            <h3>Section Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {result.sections.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px' }}>
                  {s.found ? <CheckCircle size={16} color="#27ae60" /> : <XCircle size={16} color="#e74c3c" />}
                  <span style={{ fontSize: '13px' }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card">
              <h3 style={{ color: '#27ae60' }}>✓ Matched Keywords ({result.matched.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {result.matched.slice(0, 40).map((kw, i) => (
                  <span key={i} style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{kw}</span>
                ))}
                {result.matched.length > 40 && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+{result.matched.length - 40} more</span>}
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#e74c3c' }}>✗ Missing Keywords ({result.missing.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {result.missing.slice(0, 40).map((kw, i) => (
                  <span key={i} style={{ background: '#f8d7da', color: '#721c24', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{kw}</span>
                ))}
                {result.missing.length > 40 && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+{result.missing.length - 40} more</span>}
              </div>
            </div>
          </div>

          {result.tips.length > 0 && (
            <div className="card">
              <h3><AlertTriangle size={16} /> Improvement Tips</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {result.tips.map((tip, i) => <li key={i} style={{ marginBottom: '6px', fontSize: '13px' }}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
