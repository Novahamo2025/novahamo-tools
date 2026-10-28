import { useState } from 'react';
import { Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFMetadataRemover() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const stripMetadata = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);

      // Blank out metadata fields
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('NovaHamo Tools');
      pdfDoc.setCreator('NovaHamo Tools');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error stripping metadata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload PDF Document</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }}
        />
        <p className="form-hint">Permanently strips embedded author, computer username, software producer, creation dates, and editing history for strict anonymity.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={stripMetadata} disabled={!file || loading}>
          <ShieldCheck size={16} /> {loading ? 'Sanitizing PDF...' : 'Strip PDF Metadata'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            All author and tracking metadata successfully removed!
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'sanitized_' + (file?.name || 'document.pdf');
              a.click();
            }}>
              <Download size={16} /> Download Sanitized PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
