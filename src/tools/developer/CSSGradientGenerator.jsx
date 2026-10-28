import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function CSSGradientGenerator() {
  const [color1, setColor1] = useState('#15803D');
  const [color2, setColor2] = useState('#22C55E');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState('linear'); // 'linear' or 'radial'
  const [copied, setCopied] = useState(false);

  const gradientCSS = type === 'linear'
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const fullCSS = `background: ${color1};\nbackground: ${gradientCSS};`;

  return (
    <div className="tool-workspace">
      <div
        style={{
          width: '100%',
          height: 180,
          borderRadius: 'var(--radius-xl)',
          background: gradientCSS,
          boxShadow: 'var(--shadow-lg)',
          marginBottom: 'var(--space-6)',
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Gradient Type</label>
          <select className="select-field" value={type} onChange={e => setType(e.target.value)}>
            <option value="linear">Linear Gradient</option>
            <option value="radial">Radial Gradient</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Color Stop 1</label>
          <input type="color" value={color1} onChange={e => setColor1(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Color Stop 2</label>
          <input type="color" value={color2} onChange={e => setColor2(e.target.value)} style={{ width: '100%', height: 42, border: 'none', cursor: 'pointer' }} />
        </div>

        {type === 'linear' && (
          <div className="form-group">
            <label className="form-label">Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        )}
      </div>

      <div className="tool-result">
        <label className="form-label">Generated CSS Code</label>
        <pre className="code-block" style={{ marginBottom: 'var(--space-4)' }}>
          {fullCSS}
        </pre>
        <button className="btn btn-primary" onClick={async () => {
          const ok = await copyToClipboard(fullCSS);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }}>
          <Copy size={16} /> {copied ? 'Copied CSS!' : 'Copy CSS Code'}
        </button>
      </div>
    </div>
  );
}
