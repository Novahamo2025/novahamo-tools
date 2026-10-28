import { useState, useRef, useEffect } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function TextToHandwriting() {
  const [text, setText] = useState('Dear Student,\n\nPractice makes perfect! This note was generated automatically using client-side handwriting simulation on canvas.\n\nBest regards,\nNovaHamo Tools');
  const [inkColor, setInkColor] = useState('#1E3A8A'); // Classic fountain pen blue
  const [paperType, setPaperType] = useState('ruled'); // 'ruled', 'plain', 'yellow'
  const [fontSize, setFontSize] = useState(24);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    renderHandwriting();
  }, [text, inkColor, paperType, fontSize]);

  const renderHandwriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    // Paper Background
    if (paperType === 'yellow') {
      ctx.fillStyle = '#FEF9C3';
    } else if (paperType === 'ruled') {
      ctx.fillStyle = '#FFFFFF';
    } else {
      ctx.fillStyle = '#F8FAFC';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ruled lines and red margin
    if (paperType === 'ruled') {
      // Red left vertical margin line
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(90, 0);
      ctx.lineTo(90, canvas.height);
      ctx.stroke();

      // Blue horizontal lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const lineGap = fontSize + 16;
      for (let y = 100; y < canvas.height - 40; y += lineGap) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
      }
    }

    // Handwriting simulation font
    ctx.fillStyle = inkColor;
    ctx.font = `italic ${fontSize}px "Segoe Script", "Comic Sans MS", "Caveat", cursive`;

    const startX = paperType === 'ruled' ? 110 : 60;
    let currentY = 100;
    const lineGap = fontSize + 16;
    const maxWidth = canvas.width - startX - 50;

    const lines = text.split('\n');

    for (const paragraph of lines) {
      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          // Add slight organic vertical wobble for realistic handwriting
          const wobble = (Math.random() - 0.5) * 1.5;
          ctx.fillText(currentLine, startX, currentY + wobble);
          currentLine = word + ' ';
          currentY += lineGap;
        } else {
          currentLine = testLine;
        }
      }
      const wobble = (Math.random() - 0.5) * 1.5;
      ctx.fillText(currentLine, startX, currentY + wobble);
      currentY += lineGap;
    }

    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Type or Paste Your Text</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <p className="form-hint">Note: This is a visual handwriting simulation designed for creative assignments and mockups.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Ink Color</label>
          <select className="select-field" value={inkColor} onChange={e => setInkColor(e.target.value)}>
            <option value="#1E3A8A">Fountain Pen Blue</option>
            <option value="#0F172A">Gel Pen Black</option>
            <option value="#991B1B">Teacher Red</option>
            <option value="#14532D">Forest Green</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Paper Style</label>
          <select className="select-field" value={paperType} onChange={e => setPaperType(e.target.value)}>
            <option value="ruled">Ruled Notebook with Red Margin</option>
            <option value="plain">Plain White Letterhead</option>
            <option value="yellow">Yellow Legal Notepad</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Font Size: {fontSize}px</label>
          <input type="range" min={18} max={36} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Handwriting Simulation" style={{ maxWidth: '100%', maxHeight: 450, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'handwriting_note.png';
              a.click();
            }}><Download size={16} /> Download Handwritten Page (PNG)</button>
          </div>
        </div>
      )}
    </div>
  );
}
