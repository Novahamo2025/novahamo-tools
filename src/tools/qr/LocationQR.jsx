import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { MapPin, Download, RotateCcw } from 'lucide-react';

export default function LocationQR() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid numeric coordinates.');
      return;
    }
    if (latitude < -90 || latitude > 90) {
      setError('Latitude must be between -90 and 90.');
      return;
    }
    if (longitude < -180 || longitude > 180) {
      setError('Longitude must be between -180 and 180.');
      return;
    }
    setError('');

    const geoUri = `geo:${latitude},${longitude}`;

    try {
      await QRCode.toCanvas(canvasRef.current, geoUri, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [lat, lng]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'location-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setLat('');
    setLng('');
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
          <div className="tool-header-icon"><MapPin size={24} /></div>
          <h1 className="tool-title">Location QR Code</h1>
          <p className="tool-description">Generate a QR code that opens a map app at a specific location when scanned.</p>
        </div>

        <div className="tool-workspace">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., 40.7128"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                step="any"
                min="-90"
                max="90"
              />
              <p className="form-hint">Range: -90 to 90</p>
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., -74.0060"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                step="any"
                min="-180"
                max="180"
              />
              <p className="form-hint">Range: -180 to 180</p>
            </div>
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!lat || !lng}>
              <MapPin size={18} /> Generate QR Code
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
          <h3>How to find coordinates</h3>
          <p>You can find latitude and longitude from Google Maps by right-clicking on any location and copying the coordinates.</p>
        </div>
      </div>
    </div>
  );
}
