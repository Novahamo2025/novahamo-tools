import { useState, useCallback } from 'react';
import { FileDown, Upload, Scissors, RotateCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsArrayBuffer(file);
});

function parseRanges(input, maxPage) {
  const pages = new Set();
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPage || start > end) {
        throw new Error(`Invalid range: ${part}`);
      }
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 1 || num > maxPage) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.add(num - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export default function PDFSplitter() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultBytes, setResultBytes] = useState(null);
  const [error, setError] = useState('');
  const [pdfBytes, setPdfBytes] = useState(null);

  const handleFile = useCallback(async (e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    try {
      const bytes = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setPdfBytes(bytes);
      setPageCount(doc.getPageCount());
      setError('');
      setResultBytes(null);
    } catch (err) {
      setError('Failed to load PDF: ' + err.message);
    }
  }, []);

  const split = async () => {
    if (!pdfBytes || !ranges.trim()) return;
    setProcessing(true);
    setError('');
    try {
      const indices = parseRanges(ranges, pageCount);
      if (indices.length === 0) throw new Error('No pages selected.');
      const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(p => newDoc.addPage(p));
      const data = await newDoc.save();
      setResultBytes(data);
    } catch (err) {
      setError('Split failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultBytes) return;
    const blob = new Blob([resultBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.pdf', '_split.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRanges('');
    setResultBytes(null);
    setError('');
    setPdfBytes(null);
  };

  return (
    <div className="tool-workspace">
      <p className="tool-description">
        Split a PDF by extracting specific pages. Upload a PDF, specify page ranges, and download the result.
      </p>

      <div className="upload-area" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e); }}>
        <Upload size={32} />
        <p>Drag & drop a PDF here, or click to browse</p>
        <input type="file" accept=".pdf" onChange={handleFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
      </div>

      {file && (
        <div className="card">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Total Pages:</strong> {pageCount}</p>
          <div className="form-group">
            <label className="form-label">Page Ranges (e.g., "1-3, 5, 7-10")</label>
            <input
              className="input-field"
              value={ranges}
              onChange={e => { setRanges(e.target.value); setResultBytes(null); }}
              placeholder="1-3, 5, 7-10"
            />
          </div>
        </div>
      )}

      {error && <div className="tool-result" style={{ color: '#e74c3c' }}>{error}</div>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={split} disabled={!file || !ranges.trim() || processing}>
          <Scissors size={16} />
          {processing ? 'Splitting...' : 'Split PDF'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {resultBytes && (
        <div className="tool-result">
          <p>✅ PDF split successfully! Extracted {parseRanges(ranges, pageCount).length} page(s).</p>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}>
              <FileDown size={16} />
              Download Split PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
