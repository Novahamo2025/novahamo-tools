import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Wifi, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';

function escapeWifi(str) {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/"/g, '\\"');
}

export default function WiFiQR() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState('WPA');
  const [showPassword, setShowPassword] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    if (!ssid.trim()) {
      setError('Please enter a network name (SSID).');
      return;
    }
    if (security !== 'nopass' && !password) {
      setError('Please enter a password for the selected security type.');
      return;
    }
    setError('');
    const escapedSsid = escapeWifi(ssid);
    const escapedPassword = security !== 'nopass' ? escapeWifi(password) : '';
    const wifiString = `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
    try {
      await QRCode.toCanvas(canvasRef.current, wifiString, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [ssid, password, security]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wifi-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setSsid('');
    setPassword('');
    setSecurity('WPA');
    setShowPassword(false);
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
          <div className="tool-header-icon"><Wifi size={24} /></div>
          <h1 className="tool-title">WiFi QR Code</h1>
          <p className="tool-description">Generate a QR code for your WiFi network. Guests can scan it to connect instantly without typing the password.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Network Name (SSID)</label>
            <input
              type="text"
              className="input-field"
              placeholder="My WiFi Network"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Security Type</label>
            <select className="select-field" value={security} onChange={(e) => setSecurity(e.target.value)}>
              <option value="WPA">WPA/WPA2/WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password (Open)</option>
            </select>
          </div>

          {security !== 'nopass' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter WiFi password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!ssid.trim()}>
              <Wifi size={18} /> Generate QR Code
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
