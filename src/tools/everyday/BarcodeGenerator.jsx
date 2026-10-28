import { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, RotateCcw } from 'lucide-react';

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [error, setError] = useState('');
  const svgRef = useRef(null);

  useEffect(() => {
    generate();
  }, [text, format, lineColor, background, width, height, displayValue]);

  const generate = () => {
    if (!text.trim() || !svgRef.current) return;
    setError('');
    try {
      JsBarcode(svgRef.current, text.trim(), {
        format,
        lineColor,
        background,
        width,
        height,
        displayValue,
        margin: 10,
        font: 'monospace',
      });
    } catch (err) {
      setError(`Invalid data for format ${format}: ${err.message}`);
    }
  };

  const downloadPNG = () => {
    if (!svgRef.current || error) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width * 2;
    canvas.height = svgSize.height * 2;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `barcode_${format}_${text}.png`;
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Barcode Value / Data</label>
        <input
          type="text"
          className="input-field"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter numeric or alphanumeric barcode text..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Format / Symbology</label>
          <select className="select-field" value={format} onChange={e => setFormat(e.target.value)}>
            <option value="CODE128">CODE 128 (Standard alphanumeric)</option>
            <option value="EAN13">EAN-13 (13 digits for retail)</option>
            <option value="UPC">UPC-A (12 digits)</option>
            <option value="CODE39">CODE 39 (Industrial)</option>
            <option value="ITF14">ITF-14 (Packaging)</option>
            <option value="MSI">MSI / Plessey</option>
            <option value="pharmacode">Pharmacode</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Bar Color</label>
          <input type="color" value={lineColor} onChange={e => setLineColor(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Background Color</label>
          <input type="color" value={background} onChange={e => setBackground(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Height: {height}px</label>
          <input type="range" min={30} max={150} value={height} onChange={e => setHeight(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={displayValue} onChange={e => setDisplayValue(e.target.checked)} />
          Display human-readable text under barcode
        </label>
      </div>

      {error ? (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>
          {error}
        </div>
      ) : (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: 'var(--space-4)', backgroundColor: background, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <svg ref={svgRef} />
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={downloadPNG}>
              <Download size={16} /> Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
