import { useState } from 'react';
import { Download, RotateCcw, Info } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;

export default function PDFToExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedRows, setExtractedRows] = useState([]);
  const [error, setError] = useState('');

  const extractToExcel = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setExtractedRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const allRows = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group items by vertical position (Y coordinate approximation)
        const lineMap = new Map();
        textContent.items.forEach(item => {
          const y = Math.round(item.transform[5] / 10) * 10;
          if (!lineMap.has(y)) lineMap.set(y, []);
          lineMap.get(y).push(item.str);
        });

        // Sort descending by Y (top of page down)
        const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
        sortedY.forEach(y => {
          const lineItems = lineMap.get(y);
          allRows.push(lineItems);
        });
      }

      setExtractedRows(allRows);

      // Create XLSX Workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
      XLSX.writeFile(wb, (file.name.replace(/\.[^/.]+$/, '') || 'extracted') + '.xlsx');
    } catch (err) {
      setError(`Extraction error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Extraction Scope:</strong> Client-side parsing reads coordinate text arrays from text-based PDFs and formats them directly into spreadsheet rows and columns. Scanned image-based PDFs require OCR services.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload PDF Document</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setError(''); }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={extractToExcel} disabled={!file || loading}>
          {loading ? 'Extracting & Exporting...' : 'Extract & Download Excel (.xlsx)'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setExtractedRows([]); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {extractedRows.length > 0 && (
        <div className="tool-result">
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)' }}>
            Successfully extracted {extractedRows.length} table rows into Excel workbook (.xlsx)!
          </div>
          <div className="card" style={{ maxHeight: 250, overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <tbody>
                {extractedRows.slice(0, 15).map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '6px 10px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
