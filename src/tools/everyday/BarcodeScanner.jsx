import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, Camera, Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function BarcodeScanner() {
  const [result, setResult] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef(null);
  const scannerRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResult('');
    setFormat('');
    try {
      const html5QrCode = new Html5Qrcode('barcode-file-reader');
      const res = await html5QrCode.scanFileV2(file, true);
      setResult(res.decodedText);
      setFormat(res.result?.format?.formatName || 'Detected Barcode');
      await html5QrCode.clear();
    } catch (err) {
      setError('Could not detect a clear barcode from this image. Please ensure good lighting, clear focus, and standard symbology (Code 128, EAN, UPC, etc).');
    }
  };

  const startCamera = async () => {
    setError('');
    setResult('');
    try {
      const html5QrCode = new Html5Qrcode('barcode-camera-reader');
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 300, height: 150 } },
        (decodedText, decodedResult) => {
          setResult(decodedText);
          setFormat(decodedResult.result?.format?.formatName || 'Barcode');
          stopCamera();
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError('Camera access denied or unavailable. You can upload a photo of the barcode instead.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const reset = () => {
    setResult('');
    setFormat('');
    setError('');
    stopCamera();
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'none' }}><div id="barcode-file-reader" /></div>

      <div className="tool-actions" style={{ marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Upload Barcode Photo
        </button>
        {!scanning ? (
          <button className="btn btn-secondary" onClick={startCamera}>
            <Camera size={16} /> Scan via Camera
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopCamera}>
            Stop Camera
          </button>
        )}
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <div id="barcode-camera-reader" style={{ maxWidth: 450, margin: scanning ? '0 auto var(--space-4)' : undefined, display: scanning ? 'block' : 'none' }} />

      {error && <div className="notification notification-error">{error}</div>}

      {result && (
        <div className="tool-result">
          <label className="form-label">Decoded Barcode Content ({format})</label>
          <div className="code-block" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            {result}
          </div>
          <button className="btn btn-primary btn-sm" onClick={async () => {
            const ok = await copyToClipboard(result);
            if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }}>
            <Copy size={14} /> {copied ? 'Copied to Clipboard!' : 'Copy Barcode'}
          </button>
        </div>
      )}
    </div>
  );
}
