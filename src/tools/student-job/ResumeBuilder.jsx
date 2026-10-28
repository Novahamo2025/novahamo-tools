import React, { useState, useCallback, useRef } from 'react';
import { FileText, Plus, Trash2, Download, Printer, RotateCcw, Eye, Edit } from 'lucide-react';
import { jsPDF } from 'jspdf';

const emptyEducation = { institution: '', degree: '', year: '', gpa: '' };
const emptyExperience = { company: '', role: '', dates: '', bullets: '' };
const emptyProject = { name: '', desc: '', link: '' };

export default function ResumeBuilder() {
  const [template, setTemplate] = useState('simple');
  const [showPreview, setShowPreview] = useState(false);
  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', linkedin: '', summary: '' });
  const [education, setEducation] = useState([{ ...emptyEducation }]);
  const [experience, setExperience] = useState([{ ...emptyExperience }]);
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState([{ ...emptyProject }]);
  const [certifications, setCertifications] = useState('');
  const previewRef = useRef(null);

  const updateList = (list, setList, idx, field, value) => {
    const updated = list.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    setList(updated);
  };

  const addToList = (list, setList, template) => setList([...list, { ...template }]);
  const removeFromList = (list, setList, idx) => {
    if (list.length > 1) setList(list.filter((_, i) => i !== idx));
  };

  const reset = () => {
    setPersonal({ name: '', email: '', phone: '', linkedin: '', summary: '' });
    setEducation([{ ...emptyEducation }]);
    setExperience([{ ...emptyExperience }]);
    setSkills('');
    setProjects([{ ...emptyProject }]);
    setCertifications('');
    setShowPreview(false);
  };

  const handlePrint = () => window.print();

  const exportPDF = useCallback(() => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const usable = pageWidth - 2 * margin;
    let y = 15;
    const lineHeight = 5;
    const isPro = template === 'professional';

    const checkPage = (needed) => {
      if (y + needed > 280) { doc.addPage(); y = 15; }
    };

    const addSection = (title) => {
      checkPage(15);
      y += 3;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      if (isPro) {
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
      }
      doc.text(title.toUpperCase(), margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    };

    const addWrapped = (text, indent = 0) => {
      const lines = doc.splitTextToSize(text, usable - indent);
      lines.forEach(line => {
        checkPage(lineHeight);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
    };

    // Header
    doc.setFontSize(isPro ? 22 : 18);
    doc.setFont('helvetica', 'bold');
    doc.text(personal.name || 'Your Name', isPro ? pageWidth / 2 : margin, y, isPro ? { align: 'center' } : {});
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const contactParts = [personal.email, personal.phone, personal.linkedin].filter(Boolean);
    if (contactParts.length) {
      doc.text(contactParts.join('  |  '), isPro ? pageWidth / 2 : margin, y, isPro ? { align: 'center' } : {});
      y += 6;
    }

    if (personal.summary) { addSection('Summary'); addWrapped(personal.summary); }

    if (education.some(e => e.institution)) {
      addSection('Education');
      education.filter(e => e.institution).forEach(e => {
        doc.setFont('helvetica', 'bold');
        checkPage(lineHeight);
        doc.text(e.institution, margin, y);
        if (e.year) { doc.setFont('helvetica', 'normal'); doc.text(e.year, pageWidth - margin, y, { align: 'right' }); }
        y += lineHeight;
        doc.setFont('helvetica', 'normal');
        if (e.degree) { addWrapped(e.degree + (e.gpa ? ` | GPA: ${e.gpa}` : ''), 2); }
      });
    }

    if (experience.some(e => e.company)) {
      addSection('Experience');
      experience.filter(e => e.company).forEach(e => {
        doc.setFont('helvetica', 'bold');
        checkPage(lineHeight);
        doc.text(e.company + (e.role ? ` - ${e.role}` : ''), margin, y);
        if (e.dates) { doc.setFont('helvetica', 'normal'); doc.text(e.dates, pageWidth - margin, y, { align: 'right' }); }
        y += lineHeight;
        doc.setFont('helvetica', 'normal');
        if (e.bullets) {
          e.bullets.split('\n').filter(Boolean).forEach(b => { addWrapped(`• ${b.replace(/^[-•]\s*/, '')}`, 3); });
        }
      });
    }

    if (skills) { addSection('Skills'); addWrapped(skills); }

    if (projects.some(p => p.name)) {
      addSection('Projects');
      projects.filter(p => p.name).forEach(p => {
        doc.setFont('helvetica', 'bold');
        checkPage(lineHeight);
        doc.text(p.name, margin, y);
        y += lineHeight;
        doc.setFont('helvetica', 'normal');
        if (p.desc) addWrapped(p.desc, 2);
        if (p.link) { addWrapped(p.link, 2); }
      });
    }

    if (certifications) { addSection('Certifications'); certifications.split('\n').filter(Boolean).forEach(c => addWrapped(`• ${c}`)); }

    doc.save(`${personal.name || 'resume'}_resume.pdf`);
  }, [personal, education, experience, skills, projects, certifications, template]);

  const renderPreview = () => (
    <div ref={previewRef} style={{
      background: '#fff', color: '#222', padding: '32px', fontFamily: template === 'professional' ? 'Georgia, serif' : 'Arial, sans-serif',
      maxWidth: '700px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '4px'
    }}>
      <div style={{ textAlign: template === 'professional' ? 'center' : 'left', marginBottom: '16px',
        borderBottom: template === 'professional' ? '2px solid #2c3e50' : '1px solid #666', paddingBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: template === 'professional' ? '#2c3e50' : '#333' }}>{personal.name || 'Your Name'}</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
          {[personal.email, personal.phone, personal.linkedin].filter(Boolean).join('  |  ')}
        </p>
      </div>
      {personal.summary && <div style={{ marginBottom: '12px' }}><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>SUMMARY</h4><p style={{ fontSize: '13px', margin: 0 }}>{personal.summary}</p></div>}
      {education.some(e => e.institution) && <div style={{ marginBottom: '12px' }}><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>EDUCATION</h4>
        {education.filter(e => e.institution).map((e, i) => <div key={i} style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: '13px' }}>{e.institution}</strong><span style={{ fontSize: '12px' }}>{e.year}</span></div>
          <p style={{ margin: 0, fontSize: '12px' }}>{e.degree}{e.gpa ? ` | GPA: ${e.gpa}` : ''}</p>
        </div>)}
      </div>}
      {experience.some(e => e.company) && <div style={{ marginBottom: '12px' }}><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>EXPERIENCE</h4>
        {experience.filter(e => e.company).map((e, i) => <div key={i} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: '13px' }}>{e.company} {e.role ? `- ${e.role}` : ''}</strong><span style={{ fontSize: '12px' }}>{e.dates}</span></div>
          {e.bullets && <ul style={{ margin: '2px 0 0 16px', padding: 0, fontSize: '12px' }}>{e.bullets.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b.replace(/^[-•]\s*/, '')}</li>)}</ul>}
        </div>)}
      </div>}
      {skills && <div style={{ marginBottom: '12px' }}><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>SKILLS</h4><p style={{ fontSize: '13px', margin: 0 }}>{skills}</p></div>}
      {projects.some(p => p.name) && <div style={{ marginBottom: '12px' }}><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>PROJECTS</h4>
        {projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: '6px' }}>
          <strong style={{ fontSize: '13px' }}>{p.name}</strong>
          {p.desc && <p style={{ margin: '1px 0', fontSize: '12px' }}>{p.desc}</p>}
          {p.link && <a href={p.link} style={{ fontSize: '11px', color: '#2980b9' }}>{p.link}</a>}
        </div>)}
      </div>}
      {certifications && <div><h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#2c3e50' }}>CERTIFICATIONS</h4>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px' }}>{certifications.split('\n').filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>}
    </div>
  );

  const SectionHeader = ({ title, onAdd }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {onAdd && <button className="btn btn-secondary" onClick={onAdd} style={{ padding: '4px 8px' }}><Plus size={14} /> Add</button>}
    </div>
  );

  return (
    <div className="tool-workspace">
      <p>Build your resume with multiple sections. Preview, print, or export as PDF. All data stays in your browser.</p>

      <div className="form-group">
        <label className="form-label">Template</label>
        <select className="input-field" value={template} onChange={e => setTemplate(e.target.value)}>
          <option value="simple">Simple</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {showPreview ? (
        <>
          <div className="tool-actions">
            <button className="btn btn-secondary" onClick={() => setShowPreview(false)}><Edit size={16} /> Edit</button>
            <button className="btn btn-secondary" onClick={handlePrint}><Printer size={16} /> Print</button>
            <button className="btn btn-primary" onClick={exportPDF}><Download size={16} /> Export PDF</button>
          </div>
          {renderPreview()}
        </>
      ) : (
        <>
          <div className="card">
            <h3>Personal Information</h3>
            <div className="form-group"><label className="form-label">Full Name</label><input className="input-field" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} placeholder="John Doe" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group"><label className="form-label">Email</label><input className="input-field" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} placeholder="john@example.com" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="input-field" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="+1 234 567 890" /></div>
            </div>
            <div className="form-group"><label className="form-label">LinkedIn / Portfolio</label><input className="input-field" value={personal.linkedin} onChange={e => setPersonal({ ...personal, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" /></div>
            <div className="form-group"><label className="form-label">Summary</label><textarea className="textarea-field" rows={3} value={personal.summary} onChange={e => setPersonal({ ...personal, summary: e.target.value })} placeholder="Brief professional summary..." /></div>
          </div>

          <div className="card">
            <SectionHeader title="Education" onAdd={() => addToList(education, setEducation, emptyEducation)} />
            {education.map((edu, i) => (
              <div key={i} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>#{i + 1}</strong>
                  <button className="btn btn-secondary" onClick={() => removeFromList(education, setEducation, i)} style={{ padding: '2px 6px' }}><Trash2 size={12} /></button>
                </div>
                <div className="form-group"><input className="input-field" placeholder="Institution" value={edu.institution} onChange={e => updateList(education, setEducation, i, 'institution', e.target.value)} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                  <input className="input-field" placeholder="Degree" value={edu.degree} onChange={e => updateList(education, setEducation, i, 'degree', e.target.value)} />
                  <input className="input-field" placeholder="Year" value={edu.year} onChange={e => updateList(education, setEducation, i, 'year', e.target.value)} />
                  <input className="input-field" placeholder="GPA" value={edu.gpa} onChange={e => updateList(education, setEducation, i, 'gpa', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <SectionHeader title="Experience" onAdd={() => addToList(experience, setExperience, emptyExperience)} />
            {experience.map((exp, i) => (
              <div key={i} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>#{i + 1}</strong>
                  <button className="btn btn-secondary" onClick={() => removeFromList(experience, setExperience, i)} style={{ padding: '2px 6px' }}><Trash2 size={12} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input className="input-field" placeholder="Company" value={exp.company} onChange={e => updateList(experience, setExperience, i, 'company', e.target.value)} />
                  <input className="input-field" placeholder="Role" value={exp.role} onChange={e => updateList(experience, setExperience, i, 'role', e.target.value)} />
                </div>
                <div className="form-group"><input className="input-field" placeholder="Dates (e.g., Jan 2022 - Present)" value={exp.dates} onChange={e => updateList(experience, setExperience, i, 'dates', e.target.value)} /></div>
                <div className="form-group"><textarea className="textarea-field" rows={3} placeholder="Bullet points (one per line)" value={exp.bullets} onChange={e => updateList(experience, setExperience, i, 'bullets', e.target.value)} /></div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Skills</h3>
            <div className="form-group"><input className="input-field" value={skills} onChange={e => setSkills(e.target.value)} placeholder="JavaScript, React, Python, SQL..." /></div>
          </div>

          <div className="card">
            <SectionHeader title="Projects" onAdd={() => addToList(projects, setProjects, emptyProject)} />
            {projects.map((proj, i) => (
              <div key={i} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>#{i + 1}</strong>
                  <button className="btn btn-secondary" onClick={() => removeFromList(projects, setProjects, i)} style={{ padding: '2px 6px' }}><Trash2 size={12} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input className="input-field" placeholder="Project Name" value={proj.name} onChange={e => updateList(projects, setProjects, i, 'name', e.target.value)} />
                  <input className="input-field" placeholder="Link" value={proj.link} onChange={e => updateList(projects, setProjects, i, 'link', e.target.value)} />
                </div>
                <div className="form-group"><textarea className="textarea-field" rows={2} placeholder="Description" value={proj.desc} onChange={e => updateList(projects, setProjects, i, 'desc', e.target.value)} /></div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Certifications</h3>
            <div className="form-group"><textarea className="textarea-field" rows={3} value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="One certification per line..." /></div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={() => setShowPreview(true)}><Eye size={16} /> Preview</button>
            <button className="btn btn-primary" onClick={exportPDF}><Download size={16} /> Export PDF</button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
    </div>
  );
}
