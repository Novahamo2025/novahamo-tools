import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { IndianRupee, Download, RotateCcw, AlertTriangle } from 'lucide-react';

export default function UPIQR() {
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const isValidUpi = (id) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(id);

  const generate = useCallback(async () => {
    if (!upiId.trim()) {
      setError('Please enter a UPI ID.');
      return;
    }
    if (!isValidUpi(upiId.trim())) {
      setError('Invalid UPI ID format. Expected format: user@bank (e.g., name@upi).');
      return;
    }
    if (!payeeName.trim()) {
      setError('Please enter the payee name.');
      return;
    }
    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      setError('Amount must be a positive number.');
      return;
    }
    setError('');

    const params = [
      `pa=${encodeURIComponent(upiId.trim())}`,
      `pn=${encodeURIComponent(payeeName.trim())}`,
      'cu=INR',
    ];
    if (amount && parseFloat(amount) > 0) {
      params.push(`am=${parseFloat(amount).toFixed(2)}`);
    }

    const upiUri = `upi://pay?${params.join('&')}`;

    try {
      await QRCode.toCanvas(canvasRef.current, upiUri, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [upiId, payeeName, amount]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upi-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setUpiId('');
    setPayeeName('');
    setAmount('');
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
          <div className="tool-header-icon"><IndianRupee size={24} /></div>
          <h1 className="tool-title">UPI Payment QR Code</h1>
          <p className="tool-description">Generate a UPI payment QR code for receiving payments via Google Pay, PhonePe, Paytm, and other UPI apps.</p>
        </div>

        <div className="tool-workspace">
          <div className="notification" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: 'var(--space-4)' }}>
            <AlertTriangle size={18} />
            <span>Scanning this QR code opens the UPI app but does <strong>NOT</strong> complete the payment automatically. The user must confirm the payment.</span>
          </div>

          <div className="form-group">
            <label className="form-label">UPI ID</label>
            <input
              type="text"
              className="input-field"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="form-hint">Format: username@bankname (e.g., john@okaxis, shop@ybl)</p>
          </div>

          <div className="form-group">
            <label className="form-label">Payee Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="John's Shop"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount in ₹ (optional)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g., 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <p className="form-hint">Leave blank to let the sender enter the amount.</p>
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!upiId.trim() || !payeeName.trim()}>
              <IndianRupee size={18} /> Generate QR Code
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
