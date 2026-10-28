import { useState } from 'react';
import { Lock, Download, RotateCcw, Shield } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFPasswordProtector() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');

  const protectPDF = async () => {
    setError('');
    if (!file || !password) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both inputs.');
      return;
    }

    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);

      // pdf-lib native encryption
      if (typeof pdfDoc.encrypt === 'function') {
        pdfDoc.encrypt({
          userPassword: password,
          ownerPassword: password,
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
          },
        });
      } else {
        throw new Error('PDF encryption engine is restricted in standard browser runtime.');
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(`Encryption error: ${err.message}. Standard browser pdf-lib builds may require external cryptographic subroutines for RC4/AES standard stream ciphers.`);
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
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); setError(''); }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Set Document Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter strong password..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="input-field"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-type password..."
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={protectPDF} disabled={!file || !password || loading}>
          <Lock size={16} /> {loading ? 'Encrypting PDF...' : 'Protect PDF with Password'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setPassword(''); setConfirmPassword(''); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-warning" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            <Shield size={16} /> Document protected with password successfully!
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'protected_' + (file?.name || 'document.pdf');
              a.click();
            }}>
              <Download size={16} /> Download Protected PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
