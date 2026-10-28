import { useState, useCallback } from 'react';
import { FileDown, Upload, FileText, RotateCcw, Info } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsArrayBuffer(file);
});

export default function PDFToWord() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState('');

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(f);
    setError('');
    setResultBlob(null);
    setPageCount(0);
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(pdf.numPages);
      const sections = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines = [];
        let currentLine = '';
        let lastY = null;

        for (const item of content.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            if (currentLine.trim()) lines.push(currentLine.trim());
            currentLine = '';
          }
          currentLine += item.str;
          lastY = item.transform[5];
        }
        if (currentLine.trim()) lines.push(currentLine.trim());

        const paragraphs = [
          new Paragraph({
            children: [new TextRun({ text: `--- Page ${i} ---`, bold: true, size: 24 })],
            spacing: { after: 200 },
          }),
          ...lines.map(line => new Paragraph({
            children: [new TextRun({ text: line, size: 22 })],
            spacing: { after: 100 },
          })),
        ];
        sections.push({ properties: {}, children: paragraphs });
      }

      const doc = new Document({ sections });
      const blob = await Packer.toBlob(doc);
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
    a.download = file.name.replace('.pdf', '.docx');
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setProcessing(false);
    setResultBlob(null);
    setPageCount(0);
    setError('');
  };

  return (
    <div className="tool-workspace">
      <p className="tool-description">
        Convert PDF to Word (DOCX) format. Extracts text content from each page and creates a DOCX document.
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        <span>Note: This tool extracts text only. Original formatting, images, and layout may not be preserved.</span>
      </div>

      <div className="upload-area" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e); }}>
        <Upload size={32} />
        <p>Drag & drop a PDF here, or click to browse</p>
        <input type="file" accept=".pdf" onChange={handleFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
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
          {processing ? 'Converting...' : 'Convert to DOCX'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {resultBlob && (
        <div className="tool-result">
          <p>✅ Converted {pageCount} page(s) to DOCX successfully!</p>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}>
              <FileDown size={16} />
              Download DOCX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
