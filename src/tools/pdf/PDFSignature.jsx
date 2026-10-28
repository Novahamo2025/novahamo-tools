import { useState, useRef } from 'react';
import { Download, RotateCcw, PenTool } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFSignature() {
  const [file, setFile] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(150);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const sigCanvasRef = useRef(null);

  // Drawing handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1E3A8A'; // Blue ink
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    setSignatureData(canvas.toDataURL('image/png'));
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  const handleUploadSignature = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSignatureData(evt.target.result);
    };
    reader.readAsDataURL(f);
  };

  const applySignature = async () => {
    if (!file || !signatureData) return;
    setLoading(true);

    try {
      const pdfBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();

      const targetIdx = Math.max(0, Math.min(pages.length - 1, pageNumber - 1));
      const targetPage = pages[targetIdx];

      // Convert data URL to bytes
      const sigImageBytes = await fetch(signatureData).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigImageBytes);

      // Embed signature at scale
      const sigDims = sigImage.scale(0.5);
      targetPage.drawImage(sigImage, {
        x: posX,
        y: posY,
        width: Math.min(180, sigDims.width),
        height: Math.min(80, sigDims.height),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error embedding signature: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">1. Upload PDF Document</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setResultUrl(null); }}
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>2. Draw Signature Pad (or Upload PNG below)</label>
          <button className="btn btn-ghost btn-sm" onClick={clearSignature}>Clear Pad</button>
        </div>
        <canvas
          ref={sigCanvasRef}
          width={400}
          height={140}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FFFFFF',
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />
        <div style={{ marginTop: 'var(--space-2)' }}>
          <input type="file" accept="image/png,image/jpeg" onChange={handleUploadSignature} className="input-field" style={{ fontSize: '0.8125rem' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Sign Page #</label>
          <input
            type="number"
            min={1}
            className="input-field"
            value={pageNumber}
            onChange={e => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Position X (from left)</label>
          <input
            type="number"
            className="input-field"
            value={posX}
            onChange={e => setPosX(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Position Y (from bottom)</label>
          <input
            type="number"
            className="input-field"
            value={posY}
            onChange={e => setPosY(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={applySignature} disabled={!file || !signatureData || loading}>
          {loading ? 'Embedding Signature...' : 'Stamp Signature on PDF'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); clearSignature(); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = 'signed_' + (file?.name || 'document.pdf');
            a.click();
          }}>
            <Download size={16} /> Download Signed PDF
          </button>
        </div>
      )}
    </div>
  );
}
