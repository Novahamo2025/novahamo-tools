import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, Camera, Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function QRScanner() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef(null);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResult('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader-hidden');
      const res = await html5QrCode.scanFile(file, true);
      setResult(res);
      await html5QrCode.clear();
    } catch (err) {
      setError('Could not decode QR code from this image. Make sure the image contains a clear QR code.');
    }
  };

  const startCamera = async () => {
    setError('');
    setResult('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => { setResult(text); stopCamera(); },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError('Camera access denied or unavailable. Please allow camera permission or use image upload.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); await scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => { return () => { stopCamera(); }; }, []);

  const reset = () => { setResult(''); setError(''); stopCamera(); if (fileRef.current) fileRef.current.value = ''; };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'none' }}><div id="qr-reader-hidden" /></div>
      <div className="tool-actions" style={{ marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Upload QR Image
        </button>
        {!scanning ? (
          <button className="btn btn-secondary" onClick={startCamera}>
            <Camera size={16} /> Scan with Camera
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopCamera}>Stop Camera</button>
        )}
        <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <div id="qr-reader" style={{ maxWidth: 400, margin: scanning ? '0 auto' : undefined, display: scanning ? 'block' : 'none' }} />
      {error && <div className="notification notification-error">{error}</div>}
      {result && (
        <div className="tool-result">
          <label className="form-label">Decoded Result</label>
          <div className="code-block" style={{ marginBottom: 'var(--space-3)', wordBreak: 'break-all' }}>{result}</div>
          <button className="btn btn-primary btn-sm" onClick={async () => {
            const ok = await copyToClipboard(result);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }}><Copy size={14} /> {copied ? 'Copied!' : 'Copy Result'}</button>
        </div>
      )}
    </div>
  );
}
