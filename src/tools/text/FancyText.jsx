import { useState } from 'react';
import { Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const STYLES = [
  {
    name: 'Mathematical Bold',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
        return c;
      }).join('');
    }
  },
  {
    name: 'Mathematical Italic',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97);
        return c;
      }).join('');
    }
  },
  {
    name: 'Double Struck / Blackboard',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
        return c;
      }).join('');
    }
  },
  {
    name: 'Circled Letters Ⓢⓣⓨⓛⓔ',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
        return c;
      }).join('');
    }
  },
  {
    name: 'Fullwidth / Aesthetic Ｗｉｄｅ',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) return String.fromCharCode(code + 0xFEE0);
        return c;
      }).join('');
    }
  },
  {
    name: 'Squared Boxed 🄲🄾🄾🄻',
    convert: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97);
        return c;
      }).join('');
    }
  }
];

export default function FancyText() {
  const [input, setInput] = useState('NovaHamo Tools');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = async (str, idx) => {
    const ok = await copyToClipboard(str);
    if (ok) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Type Your Normal Text</label>
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your bio, social post, or caption..."
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
        {STYLES.map((style, idx) => {
          const transformed = style.convert(input);
          return (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) var(--space-4)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>{style.name}</span>
                <p style={{ fontSize: '1.25rem', marginTop: 2 }}>{transformed || '—'}</p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleCopy(transformed, idx)}
                disabled={!input}
              >
                <Copy size={14} /> {copiedIdx === idx ? 'Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
