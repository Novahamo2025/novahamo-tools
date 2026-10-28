import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function TextToPDF() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('helvetica');

  const generatePDF = () => {
    if (!content.trim()) return;

    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;

    let y = 25;

    if (title.trim()) {
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(fontSize + 6);
      doc.text(title.trim(), margin, y);
      y += 12;
    }

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(content, maxLineWidth);
    const lineHeight = fontSize * 0.5 + 4;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    doc.save((title.trim().replace(/\s+/g, '_') || 'document') + '.pdf');
  };

  const reset = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Document Title (Optional)</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Project Abstract or Report"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Font Size (pt)</label>
          <select className="select-field" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}>
            <option value={10}>10 pt (Small)</option>
            <option value={12}>12 pt (Standard)</option>
            <option value={14}>14 pt (Large)</option>
            <option value={16}>16 pt (Extra Large)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Font Family</label>
          <select className="select-field" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
            <option value="helvetica">Helvetica / Arial (Clean)</option>
            <option value="times">Times New Roman (Academic)</option>
            <option value="courier">Courier (Monospace)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Document Text Body</label>
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Paste or type your document content here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <p className="form-hint">{content.length} characters</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generatePDF} disabled={!content.trim()}>
          <Download size={16} /> Generate & Download PDF
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
}
