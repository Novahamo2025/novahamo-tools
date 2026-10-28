import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { MessageCircle, Download, RotateCcw } from 'lucide-react';

export default function WhatsAppQR() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const sanitizePhone = (num) => num.replace(/[^0-9]/g, '');

  const generate = useCallback(async () => {
    const cleaned = sanitizePhone(phone);
    if (!cleaned || cleaned.length < 7) {
      setError('Please enter a valid phone number with country code (e.g., 919876543210).');
      return;
    }
    setError('');
    let waUrl = `https://wa.me/${cleaned}`;
    if (message.trim()) {
      waUrl += `?text=${encodeURIComponent(message.trim())}`;
    }
    try {
      await QRCode.toCanvas(canvasRef.current, waUrl, { width: 300, margin: 2 });
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
    a.download = 'whatsapp-qr-code.png';
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
          <div className="tool-header-icon"><MessageCircle size={24} /></div>
          <h1 className="tool-title">WhatsApp QR Code</h1>
          <p className="tool-description">Generate a QR code that opens a WhatsApp chat with a specific number. Optionally include a pre-filled message.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Phone Number (with country code)</label>
            <input
              type="tel"
              className="input-field"
              placeholder="e.g., 919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="form-hint">Enter number without + or spaces. Example: 919876543210 for India (+91).</p>
          </div>

          <div className="form-group">
            <label className="form-label">Pre-filled Message (optional)</label>
            <textarea
              className="textarea-field"
              placeholder="Hello! I'd like to know more about..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{ minHeight: '80px' }}
            />
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!phone.trim()}>
              <MessageCircle size={18} /> Generate QR Code
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
