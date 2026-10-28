import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');

    try {
      const data = await f.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(json.slice(0, 30)); // Preview first 30 rows
    } catch (err) {
      setError(`Failed to read spreadsheet: ${err.message}`);
    }
  };

  const convertToPDF = () => {
    if (!file || tableData.length === 0) return;
    setLoading(true);

    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(14);
      doc.text(`Spreadsheet: ${file.name}`, 14, 15);
      doc.setFontSize(9);

      let y = 25;
      const margin = 14;
      const lineHeight = 7;

      for (let r = 0; r < tableData.length; r++) {
        const row = tableData[r];
        if (y > 190) {
          doc.addPage('landscape');
          y = 20;
        }

        let x = margin;
        for (let c = 0; c < Math.min(row.length, 8); c++) {
          const val = String(row[c] ?? '').slice(0, 20);
          doc.text(val, x, y);
          x += 34;
        }
        y += lineHeight;
      }

      doc.save((file.name.replace(/\.[^/.]+$/, '') || 'spreadsheet') + '.pdf');
    } catch (err) {
      alert(`Error generating PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Excel Spreadsheet (.xlsx, .xls, .csv)</label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="input-field"
          onChange={handleFile}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convertToPDF} disabled={!file || tableData.length === 0 || loading}>
          {loading ? 'Compiling PDF...' : 'Convert to PDF Document'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setTableData([]); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {tableData.length > 0 && (
        <div className="tool-result">
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
            Sheet Preview ({tableData.length} rows loaded):
          </p>
          <div className="card" style={{ maxHeight: 250, overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <tbody>
                {tableData.slice(0, 10).map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '4px 8px' }}>{String(cell)}</td>
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
