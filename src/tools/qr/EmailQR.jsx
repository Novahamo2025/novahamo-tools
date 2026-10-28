import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Mail, Download, RotateCcw } from 'lucide-react';

export default function EmailQR() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const generate = useCallback(async () => {
    if (!to.trim()) {
      setError('Please enter a recipient email address.');
      return;
    }
    if (!isValidEmail(to.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');

    const params = [];
    if (subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
    if (body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
    const mailto = `mailto:${to.trim()}${params.length ? '?' + params.join('&') : ''}`;

    try {
      await QRCode.toCanvas(canvasRef.current, mailto, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [to, subject, body]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setTo('');
    setSubject('');
    setBody('');
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
          <div className="tool-header-icon"><Mail size={24} /></div>
          <h1 className="tool-title">Email QR Code</h1>
          <p className="tool-description">Generate a QR code that opens the email app with a pre-filled recipient, subject, and body when scanned.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Recipient Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="contact@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject (optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Inquiry about..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body (optional)</label>
            <textarea
              className="textarea-field"
              placeholder="Hello, I wanted to reach out about..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!to.trim()}>
              <Mail size={18} /> Generate QR Code
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
