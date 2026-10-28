import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Link, Download, RotateCcw } from 'lucide-react';

export default function URLToQR() {
  const [url, setUrl] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const generate = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
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
  }, [url]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'url-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setUrl('');
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
          <div className="tool-header-icon"><Link size={24} /></div>
          <h1 className="tool-title">URL to QR Code</h1>
          <p className="tool-description">Generate a QR code from any URL. When scanned, it opens the link directly in a browser.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
            />
            <p className="form-hint">The https:// prefix will be added automatically if missing.</p>
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!url.trim()}>
              <Link size={18} /> Generate QR Code
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
      </div>
    </div>
  );
}
