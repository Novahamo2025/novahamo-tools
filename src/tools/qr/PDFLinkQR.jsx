import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { FileText, Download, RotateCcw, Info } from 'lucide-react';

export default function PDFLinkQR() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const isValidUrl = (str) => {
    try {
      const url = new URL(str);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const generate = useCallback(async () => {
    const trimmed = pdfUrl.trim();
    if (!trimmed) {
      setError('Please enter a PDF URL.');
      return;
    }
    const fullUrl = trimmed.match(/^https?:\/\//) ? trimmed : 'https://' + trimmed;
    if (!isValidUrl(fullUrl)) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');

    try {
      await QRCode.toCanvas(canvasRef.current, fullUrl, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [pdfUrl]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf-link-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setPdfUrl('');
    setGenerated(false);
    setError('');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <div className="tool-page">
      <div className="container">
        <div className="tool-header">
          <div className="tool-header-icon"><FileText size={24} /></div>
          <h1 className="tool-title">PDF Link QR Code</h1>
          <p className="tool-description">Generate a QR code that links to an online PDF document. Scanning opens the PDF in a browser or PDF viewer.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">PDF URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com/document.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
            />
            <p className="form-hint">Enter the full URL of a publicly accessible PDF file.</p>
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!pdfUrl.trim()}>
              <FileText size={18} /> Generate QR Code
            </button>
            <button className="btn btn-secondary" onClick={reset}>
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          <div className="tool-result" style={{ textAlign: 'center' }}>
            <canvas ref={canvasRef} style={{ display: generated ? 'inline-block' : 'none', maxWidth: '100%' }} />
            {generated && (
              <div className="tool-actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={download}>
                  <Download size={18} /> Download PNG
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tool-info">
          <h3><Info size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />Important Notes</h3>
          <p>• The PDF must be hosted online and publicly accessible for the QR code to work.</p>
          <p>• Local PDF files on your computer cannot be linked directly. Upload them to a cloud service (Google Drive, Dropbox, etc.) first.</p>
          <p>• Make sure the sharing link allows public access without login.</p>
        </div>
      </div>
    </div>
  );
}
