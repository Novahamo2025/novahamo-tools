import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Type, Download, RotateCcw } from 'lucide-react';

export default function TextToQR() {
  const [text, setText] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }
    setError('');
    try {
      await QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2 });
      setGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message);
    }
  }, [text]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-qr-code.png';
    a.click();
  }, []);

  const reset = useCallback(() => {
    setText('');
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
          <div className="tool-header-icon"><Type size={24} /></div>
          <h1 className="tool-title">Text to QR Code</h1>
          <p className="tool-description">Convert any text into a scannable QR code. Enter your text below and generate a QR code instantly.</p>
        </div>

        <div className="tool-workspace">
          <div className="form-group">
            <label className="form-label">Your Text</label>
            <textarea
              className="textarea-field"
              placeholder="Enter text to encode into a QR code..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <p className="form-hint">{text.length} characters</p>
          </div>

          {error && <div className="notification notification-error">{error}</div>}

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generate} disabled={!text.trim()}>
              <Type size={18} /> Generate QR Code
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
