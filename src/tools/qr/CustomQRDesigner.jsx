import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download, RotateCcw, AlertTriangle } from 'lucide-react';

export default function CustomQRDesigner() {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(300);
  const [ecl, setEcl] = useState('M');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size, margin: 2,
        errorCorrectionLevel: ecl,
        color: { dark: fgColor, light: bgColor },
      });
      if (logoFile) {
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
          const logoSize = size * 0.2;
          const x = (size - logoSize) / 2;
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - 4, x - 4, logoSize + 8, logoSize + 8);
          ctx.drawImage(img, x, x, logoSize, logoSize);
        };
        img.src = URL.createObjectURL(logoFile);
      }
      setGenerated(true);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }, [text, fgColor, bgColor, size, ecl, logoFile]);

  const download = (format) => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL(format === 'svg' ? 'image/png' : 'image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode.${format === 'svg' ? 'png' : 'png'}`;
    a.click();
  };

  const reset = () => {
    setText(''); setGenerated(false); setLogoFile(null);
    setFgColor('#000000'); setBgColor('#FFFFFF'); setSize(300); setEcl('M');
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Content</label>
        <textarea className="textarea-field" placeholder="Enter text or URL..." value={text} onChange={e => setText(e.target.value)} rows={3} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Foreground Color</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: '100%', height: 40, border: 'none', cursor: 'pointer' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Background Color</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 40, border: 'none', cursor: 'pointer' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Size (px)</label>
          <input type="number" className="input-field" min={128} max={1024} value={size} onChange={e => setSize(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Error Correction</label>
          <select className="select-field" value={ecl} onChange={e => setEcl(e.target.value)}>
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Logo (optional)</label>
        <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="input-field" />
      </div>
      <div className="notification notification-warning" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--color-warning)' }}>
        <AlertTriangle size={16} /> Custom colors and logos may reduce QR scannability. Use high error correction with logos.
      </div>
      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate} disabled={!text.trim()}>Generate QR Code</button>
        <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>
      <div className="tool-result" style={{ textAlign: 'center', display: generated ? 'block' : 'none' }}>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
        <div className="tool-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => download('png')}><Download size={16} /> Download PNG</button>
        </div>
      </div>
      {!generated && <canvas ref={canvasRef} style={{ display: 'none' }} />}
    </div>
  );
}
