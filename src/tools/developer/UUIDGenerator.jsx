import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState(() => generateUUIDs(5, false, true));
  const [copied, setCopied] = useState(false);

  function generateUUIDs(qty, isUpper, useHyphens) {
    const list = [];
    for (let i = 0; i < qty; i++) {
      let id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      if (!useHyphens) id = id.replace(/-/g, '');
      if (isUpper) id = id.toUpperCase();
      list.push(id);
    }
    return list;
  }

  const handleGenerate = () => {
    setUuids(generateUUIDs(count, uppercase, hyphens));
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            min={1}
            max={50}
            className="input-field"
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
          Uppercase characters
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} />
          Include hyphens
        </label>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={handleGenerate}>
          <RefreshCw size={16} /> Generate New UUIDs (v4)
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(uuids.join('\n'));
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>

      <div className="tool-result">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {uuids.map((id, idx) => (
            <div key={idx} className="card" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-mono)' }}>{id}</code>
              <button className="btn btn-ghost btn-sm" onClick={() => copyToClipboard(id)} style={{ padding: 4 }}>
                <Copy size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
