import { useState, useCallback } from 'react';
import { FileDown, Upload, FileText, RotateCcw, Info } from 'lucide-react';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsArrayBuffer(file);
});

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [error, setError] = useState('');
  const [htmlPreview, setHtmlPreview] = useState('');

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!f || !f.name.endsWith('.docx')) {
      setError('Please select a valid .docx file.');
      return;
    }
    setFile(f);
    setError('');
    setResultBlob(null);
    setHtmlPreview('');
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes });
      const html = result.value;
      setHtmlPreview(html);

      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:550px;font-family:serif;font-size:12px;line-height:1.5;';
      document.body.appendChild(container);

      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const elements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, tr');
      if (elements.length === 0) {
        const plainText = container.textContent || '';
        const lines = doc.splitTextToSize(plainText, maxWidth);
        for (const line of lines) {
          if (y + 14 > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.setFontSize(12);
          doc.text(line, margin, y);
          y += 14;
        }
      } else {
        for (const el of elements) {
          const tag = el.tagName.toLowerCase();
          let fontSize = 12;
          let fontStyle = 'normal';
          if (tag === 'h1') { fontSize = 22; fontStyle = 'bold'; }
          else if (tag === 'h2') { fontSize = 18; fontStyle = 'bold'; }
          else if (tag === 'h3') { fontSize = 15; fontStyle = 'bold'; }
          else if (tag.startsWith('h')) { fontSize = 13; fontStyle = 'bold'; }
          else if (tag === 'li') { fontSize = 12; }

          doc.setFontSize(fontSize);
          doc.setFont('helvetica', fontStyle);
          const text = el.textContent?.trim() || '';
          if (!text) continue;
          const prefix = tag === 'li' ? '• ' : '';
          const lines = doc.splitTextToSize(prefix + text, maxWidth);
          for (const line of lines) {
            if (y + fontSize + 4 > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
            doc.text(line, margin, y);
            y += fontSize + 4;
          }
          y += 4;
        }
      }

      document.body.removeChild(container);
      const blob = doc.output('blob');
      setResultBlob(blob);
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.docx', '.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setProcessing(false);
    setResultBlob(null);
    setError('');
    setHtmlPreview('');
  };

  return (
    <div className="tool-workspace">
      <p className="tool-description">
        Convert Word documents (.docx) to PDF. Basic text and heading formatting is preserved.
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        <span>Complex formatting, tables, and embedded images may not render perfectly in the PDF.</span>
      </div>

      <div className="upload-area" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e); }}>
        <Upload size={32} />
        <p>Drag & drop a .docx file here, or click to browse</p>
        <input type="file" accept=".docx" onChange={handleFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
      </div>

      {file && (
        <div className="card">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB</p>
        </div>
      )}

      {error && <div className="tool-result" style={{ color: '#e74c3c' }}>{error}</div>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convert} disabled={!file || processing}>
          <FileText size={16} />
          {processing ? 'Converting...' : 'Convert to PDF'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {resultBlob && (
        <div className="tool-result">
          <p>✅ Word document converted to PDF successfully!</p>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}>
              <FileDown size={16} />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
