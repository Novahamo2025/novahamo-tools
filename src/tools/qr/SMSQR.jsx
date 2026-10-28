import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { MessageSquare, Download, RotateCcw } from 'lucide-react';

export default function SMSQR() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    const cleaned = phone.trim();
    if (!cleaned) {
      setError('Please enter a phone number.');
      return;
    }
    setError('');

    let smsUri = `sms:${cleaned}`;
    if (message.trim()) {
      smsUri += `?body=${encodeURIComponent(message.trim())}`;
    }

    try {
      await QRCode.toCanvas(canvasRef.current, smsUri, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [phone, message]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sms-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setPhone('');
    setMessage('');
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
          <div className="tool-header-icon"><MessageSquare size={24} /></div>
          <h1 className="tool-title">SMS QR Code</h1>
          <p className="tool-description">Generate a QR code that opens the messaging app with a pre-filled phone number and optional message.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="input-field"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="form-hint">Include country code for international numbers.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Pre-filled Message (optional)</label>
            <textarea
              className="textarea-field"
              placeholder="Hey! I wanted to let you know..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{ minHeight: '80px' }}
            />
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!phone.trim()}>
              <MessageSquare size={18} /> Generate QR Code
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
