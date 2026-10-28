import { useState } from 'react';
import { Unlock, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFUnlocker() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');

  const unlockPDF = async () => {
    setError('');
    if (!file || !password) return;
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      // Attempt opening with user provided password
      const pdfDoc = await PDFDocument.load(buffer, { password });

      // Save without encryption to unlock
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(`Failed to unlock PDF: ${err.message}. Please ensure the password is correct.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-warning" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--color-warning)' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          <strong>Authorized Unlock Only:</strong> This tool decrypts password-protected PDFs by applying the authentic password you supply and saving an unprotected copy. We never bypass encryption or crack passwords without authorization.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Locked PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); setError(''); }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Known Password</label>
        <input
          type="password"
          className="input-field"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter the valid password for this PDF..."
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={unlockPDF} disabled={!file || !password || loading}>
          <Unlock size={16} /> {loading ? 'Validating Password & Decrypting...' : 'Unlock & Remove Password'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setPassword(''); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            Password removed successfully!
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'unlocked_' + (file?.name || 'document.pdf');
              a.click();
            }}>
              <Download size={16} /> Download Unlocked PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
