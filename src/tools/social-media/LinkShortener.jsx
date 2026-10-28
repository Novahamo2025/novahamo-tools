import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { validateUrl } from '../../utils/validation';

export default function LinkShortener() {
  const [url, setUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const handleGenerateQR = async () => {
    setError('');
    if (!url.trim()) return;

    if (!validateUrl(url.trim())) {
      setError('Please enter a valid, complete web URL including http:// or https://');
      return;
    }

    try {
      await QRCode.toCanvas(canvasRef.current, url.trim(), {
        width: 280,
        margin: 2,
        color: { dark: '#15803D', light: '#FFFFFF' },
      });
      setQrGenerated(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-6)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Architecture Transparency:</strong> Creating a public shortened link (like bit.ly or tinyurl) requires a backend routing domain and centralized database to map and redirect incoming traffic.
          <br /><br />
          Because NovaHamo Tools operates on a <strong>100% private frontend architecture</strong> without storing user URLs in a remote database, we do not fabricate non-functional short links. As an instant, secure alternative, generate a scannable QR code below for your destination URL!
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Destination URL</label>
        <input
          type="url"
          className="input-field"
          placeholder="https://example.com/very/long/web/address"
          value={url}
          onChange={e => { setUrl(e.target.value); setQrGenerated(false); setError(''); }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleGenerateQR} disabled={!url.trim()}>
          <QrCode size={16} /> Generate Instant QR for URL
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      <div className="tool-result" style={{ textAlign: 'center', display: qrGenerated ? 'block' : 'none' }}>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = canvasRef.current.toDataURL('image/png');
            a.download = 'link_qr_code.png';
            a.click();
          }}><Download size={16} /> Download QR Code (PNG)</button>
        </div>
      </div>

      {!qrGenerated && <canvas ref={canvasRef} style={{ display: 'none' }} />}
    </div>
  );
}
