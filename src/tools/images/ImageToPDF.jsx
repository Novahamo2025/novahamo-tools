import { useState, useCallback } from 'react';
import { Upload, Download, RotateCcw, FileText, X } from 'lucide-react';
import { jsPDF } from 'jspdf';

const loadImage = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

export default function ImageToPDF() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [fitMode, setFitMode] = useState('fit');

  const handleFiles = useCallback((e) => {
    const selected = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (selected.length === 0) { setError('Please select valid image files.'); return; }
    setError('');
    setFiles(prev => [...prev, ...selected]);
    setResult(null);
  }, []);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, dir) => {
    setFiles(prev => {
      const arr = [...prev];
      const ni = index + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[index], arr[ni]] = [arr[ni], arr[index]];
      return arr;
    });
  };

  const generatePDF = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError('');
    try {
      const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;

      for (let i = 0; i < files.length; i++) {
        if (i > 0) pdf.addPage();
        const img = await loadImage(files[i]);
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        let w, h;
        if (fitMode === 'fill') {
          w = availW; h = availH;
        } else {
          const ratio = Math.min(availW / img.width, availH / img.height);
          w = img.width * ratio;
          h = img.height * ratio;
        }
        const x = margin + (availW - w) / 2;
        const y = margin + (availH - h) / 2;
        pdf.addImage(dataUrl, 'JPEG', x, y, w, h);
      }

      const blob = pdf.output('blob');
      setResult(URL.createObjectURL(blob));
      setProcessing(false);
    } catch (err) {
      setError('Failed to generate PDF: ' + err.message);
      setProcessing(false);
    }
  }, [files, orientation, fitMode]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result; a.download = 'images.pdf'; a.click();
  };

  const reset = () => {
    setFiles([]); setResult(null); setError('');
  };

  return (
    <div className="tool-workspace">
      <p>Convert multiple images into a single PDF file. Each image is placed on its own page.</p>

      <div className="form-group">
        <label className="form-label">Upload Images</label>
        <label className="upload-area">
          <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
          <Upload size={24} />
          <span>{files.length > 0 ? `${files.length} image(s) selected` : 'Click to upload images'}</span>
        </label>
      </div>

      {files.length > 0 && (
        <>
          <div className="card">
            <p><strong>{files.length} image(s)</strong> — drag to reorder:</p>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
                <span style={{ width: 24, textAlign: 'center', opacity: 0.5 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: '0.9rem' }}>{f.name}</span>
                <button className="btn btn-secondary" onClick={() => moveFile(i, -1)} disabled={i === 0} style={{ padding: '2px 6px', fontSize: '0.8rem' }}>↑</button>
                <button className="btn btn-secondary" onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} style={{ padding: '2px 6px', fontSize: '0.8rem' }}>↓</button>
                <button className="btn btn-secondary" onClick={() => removeFile(i)} style={{ padding: '2px 6px' }}><X size={14} /></button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Orientation</label>
              <select className="input-field" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Fit Mode</label>
              <select className="input-field" value={fitMode} onChange={(e) => setFitMode(e.target.value)}>
                <option value="fit">Fit (maintain ratio)</option>
                <option value="fill">Fill page</option>
              </select>
            </div>
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={generatePDF} disabled={processing}>
              <FileText size={16} /> {processing ? 'Generating...' : 'Generate PDF'}
            </button>
            <button className="btn btn-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}

      {error && <div className="tool-result"><p style={{ color: '#e74c3c' }}>{error}</p></div>}

      {result && (
        <div className="tool-result">
          <p><strong>PDF ready!</strong> {files.length} page(s)</p>
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}><Download size={16} /> Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
