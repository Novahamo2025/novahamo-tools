import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

export default function CertificateMaker() {
  const [name, setName] = useState('Alex Johnson');
  const [course, setCourse] = useState('Web Development & Advanced Coding');
  const [reason, setReason] = useState('for successfully completing the coursework with excellence.');
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [issuer, setIssuer] = useState('NovaHamo Technologies');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

    // Title
    ctx.fillStyle = '#17212B';
    ctx.textAlign = 'center';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText('CERTIFICATE OF APPRECIATION', canvas.width / 2, 160);

    ctx.fillStyle = '#15803D';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', canvas.width / 2, 220);

    // Recipient Name
    ctx.fillStyle = '#17212B';
    ctx.font = 'bold 54px "Times New Roman", serif';
    ctx.fillText(name || 'Recipient Name', canvas.width / 2, 320);

    // Divider line under name
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 345);
    ctx.lineTo(canvas.width / 2 + 250, 345);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#64748B';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText(reason, canvas.width / 2, 420);

    ctx.fillStyle = '#15803D';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(course, canvas.width / 2, 475);

    // Footer - Date & Signatures
    const bottomY = 660;

    // Date
    ctx.fillStyle = '#17212B';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(date, 280, bottomY);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, bottomY + 10);
    ctx.lineTo(380, bottomY + 10);
    ctx.stroke();
    ctx.fillStyle = '#64748B';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('DATE ISSUED', 280, bottomY + 35);

    // Signature
    ctx.fillStyle = '#17212B';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText(issuer, canvas.width - 280, bottomY);
    ctx.beginPath();
    ctx.moveTo(canvas.width - 380, bottomY + 10);
    ctx.lineTo(canvas.width - 180, bottomY + 10);
    ctx.stroke();
    ctx.fillStyle = '#64748B';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('AUTHORIZED SIGNATURE', canvas.width - 280, bottomY + 35);

    // Watermark disclaimer
    ctx.font = '12px Arial, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Generated via NovaHamo Tools. For formal/accredited certification, verify with the issuing organization.', canvas.width / 2, canvas.height - 45);

    setResultUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Recipient Full Name</label>
          <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Event / Course / Award Title</label>
          <input type="text" className="input-field" value={course} onChange={e => setCourse(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Achievement Description</label>
          <input type="text" className="input-field" value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Issue Date</label>
          <input type="text" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Issuing Authority / Organization</label>
          <input type="text" className="input-field" value={issuer} onChange={e => setIssuer(e.target.value)} />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate}>Generate Certificate</button>
        <button className="btn btn-ghost" onClick={() => { setName(''); setCourse(''); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Certificate Preview" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = `certificate_${name.replace(/\s+/g, '_')}.png`;
              a.click();
            }}><Download size={16} /> Download Certificate (PNG)</button>
          </div>
        </div>
      )}
    </div>
  );
}
