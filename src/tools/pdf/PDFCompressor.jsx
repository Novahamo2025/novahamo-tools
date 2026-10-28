import { useState, useCallback } from 'react';
import { FileDown, Upload, Minimize2, RotateCcw, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsArrayBuffer(file);
});

export default function PDFCompressor() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [compressedBytes, setCompressedBytes] = useState(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResult(null);
      setError('');
      setCompressedBytes(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResult(null);
      setError('');
      setCompressedBytes(null);
    } else {
      setError('Please drop a valid PDF file.');
    }
  }, []);

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setResult(null);
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach((p) => newDoc.addPage(p));
      const compressedData = await newDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const originalSize = file.size;
      const newSize = compressedData.length;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
      setCompressedBytes(compressedData);
      setResult({ originalSize, newSize, reduction: parseFloat(reduction) });
    } catch (err) {
      setError('Failed to compress PDF: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!compressedBytes) return;
    const blob = new Blob([compressedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.pdf', '_compressed.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setCompressedBytes(null);
    setProcessing(false);
  };

  return (
    <div className="tool-workspace">
      <p className="tool-description">
        Compress PDF files by optimizing internal structure with object streams. Upload a PDF to reduce its file size.
      </p>

      <div
        className="upload-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload size={32} />
        <p>Drag & drop a PDF here, or click to browse</p>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFile}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>

      {file && (
        <div className="card">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Original Size:</strong> {formatSize(file.size)}</p>
        </div>
      )}

      {error && <div className="tool-result" style={{ color: '#e74c3c' }}>{error}</div>}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={compress} disabled={!file || processing}>
          <Minimize2 size={16} />
          {processing ? 'Compressing...' : 'Compress PDF'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {result && (
        <div className="tool-result">
          <div className="card">
            <p><strong>Original Size:</strong> {formatSize(result.originalSize)}</p>
            <p><strong>Compressed Size:</strong> {formatSize(result.newSize)}</p>
            <p>
              <strong>Reduction:</strong>{' '}
              {result.reduction > 0
                ? `${result.reduction}% smaller`
                : 'File could not be reduced further (already optimized)'}
            </p>
          </div>
          {result.reduction <= 0 && (
            <div className="card" style={{ marginTop: 8 }}>
              <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              <span>This PDF is already well-optimized. The compressed version may be similar or slightly larger.</span>
            </div>
          )}
          <div className="tool-actions">
            <button className="btn btn-primary" onClick={download}>
              <FileDown size={16} />
              Download Compressed PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
