import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function MemeGenerator() {
  const [file, setFile] = useState(null);
  const [topText, setTopText] = useState('ONE DOES NOT SIMPLY');
  const [bottomText, setBottomText] = useState('BUILD A FULL-STACK TOOLKIT IN ONE DAY');
  const [fontSize, setFontSize] = useState(48);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const generateMeme = async () => {
    if (!file) return;
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(3, fontSize / 10);
    ctx.font = `900 ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = 'center';

    // Top text
    if (topText.trim()) {
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize + 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize + 20);
    }

    // Bottom text
    if (bottomText.trim()) {
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
    }

    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Meme Template / Image</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Top Text</label>
          <input type="text" className="input-field" value={topText} onChange={e => setTopText(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Bottom Text</label>
          <input type="text" className="input-field" value={bottomText} onChange={e => setBottomText(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Font Size: {fontSize}px</label>
          <input type="range" min={20} max={100} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generateMeme} disabled={!file}>Generate Meme</button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}><RotateCcw size={16} /> Reset</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Meme Result" style={{ maxWidth: '100%', maxHeight: 450, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'meme.jpg';
              a.click();
            }}><Download size={16} /> Download Meme</button>
          </div>
        </div>
      )}
    </div>
  );
}
