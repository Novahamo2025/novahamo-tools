import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Contact, Download, RotateCcw } from 'lucide-react';

export default function ContactQR() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [address, setAddress] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError('Please enter at least a first or last name.');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError('Please enter at least a phone number or email.');
      return;
    }
    setError('');

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName.trim()};${firstName.trim()};;;`,
      `FN:${fullName}`,
    ];
    if (phone.trim()) lines.push(`TEL:${phone.trim()}`);
    if (email.trim()) lines.push(`EMAIL:${email.trim()}`);
    if (org.trim()) lines.push(`ORG:${org.trim()}`);
    if (address.trim()) lines.push(`ADR:;;${address.trim()};;;;`);
    lines.push('END:VCARD');

    const vcard = lines.join('\n');

    try {
      await QRCode.toCanvas(canvasRef.current, vcard, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [firstName, lastName, phone, email, org, address]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setOrg('');
    setAddress('');
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
          <div className="tool-header-icon"><Contact size={24} /></div>
          <h1 className="tool-title">Contact QR Code (vCard)</h1>
          <p className="tool-description">Generate a QR code that saves contact information directly to a phone's address book when scanned.</p>
        </div>

        <div className="tool-workspace">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="input-field" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="input-field" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="input-field" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="input-field" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Organization (optional)</label>
            <input type="text" className="input-field" placeholder="Company Name" value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Address (optional)</label>
            <input type="text" className="input-field" placeholder="123 Main St, City, Country" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate}>
              <Contact size={18} /> Generate QR Code
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
