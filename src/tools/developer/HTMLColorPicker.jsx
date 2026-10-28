import { useState } from 'react';
import { Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function HTMLColorPicker() {
  const [color, setColor] = useState('#15803D');
  const [copiedKey, setCopiedKey] = useState(null);

  const hex = color.toUpperCase();

  // Convert hex to rgb
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  const rgb = `rgb(${r}, ${g}, ${b})`;

  // Convert to HSL
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  const copyVal = async (val, key) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{ width: 120, height: 120, border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', padding: 0 }}
        />
        <div style={{ flex: 1, minWidth: 240 }}>
          <label className="form-label">Hexadecimal Code</label>
          <input
            type="text"
            className="input-field"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem' }}
          />
        </div>
      </div>

      <div className="tool-result">
        {[
          { label: 'HEX', val: hex, key: 'hex' },
          { label: 'RGB', val: rgb, key: 'rgb' },
          { label: 'HSL', val: hsl, key: 'hsl' },
        ].map(item => (
          <div key={item.key} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-3)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{item.label}</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600 }}>{item.val}</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => copyVal(item.val, item.key)}>
              <Copy size={14} /> {copiedKey === item.key ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
