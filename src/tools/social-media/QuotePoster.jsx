import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function QuotePoster() {
  const [quote, setQuote] = useState('The future belongs to those who believe in the beauty of their dreams.');
  const [author, setAuthor] = useState('Eleanor Roosevelt');
  const [theme, setTheme] = useState('emerald'); // emerald, midnight, sunset, slate
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const generate = () => {
    const canvas = canvasRef.current;
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Background themes
    if (theme === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#15803D');
      grad.addColorStop(1, '#064E3B');
      ctx.fillStyle = grad;
    } else if (theme === 'midnight') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E1B4B');
      ctx.fillStyle = grad;
    } else if (theme === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#BE123C');
      grad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#1E293B';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative quote mark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = 'bold 220px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('“', canvas.width / 2, 280);

    // Quote text wrapping
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 52px Georgia, serif';
    ctx.textAlign = 'center';

    const words = quote.split(' ');
    let line = '';
    let y = 460;
    const maxW = 860;

    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line, canvas.width / 2, y);
        line = w + ' ';
        y += 72;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Author
    if (author.trim()) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(`— ${author.toUpperCase()} —`, canvas.width / 2, y + 90);
    }

    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Quote Text</label>
        <textarea
          className="textarea-field"
          rows={4}
          value={quote}
          onChange={e => setQuote(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Author / Speaker</label>
          <input type="text" className="input-field" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Color Theme</label>
          <select className="select-field" value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="emerald">NovaHamo Emerald Green</option>
            <option value="midnight">Midnight Deep Blue</option>
            <option value="sunset">Sunset Ruby / Amber</option>
            <option value="slate">Minimal Slate</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate}>Generate 1080×1080 Quote Poster</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Quote Poster" style={{ maxWidth: 400, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'quote_poster.png';
              a.click();
            }}><Download size={16} /> Download Quote Poster</button>
          </div>
        </div>
      )}
    </div>
  );
}
