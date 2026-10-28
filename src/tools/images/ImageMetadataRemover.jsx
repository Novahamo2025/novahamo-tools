import { useState } from 'react';
import { Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { formatFileSize } from '../../utils/download';

export default function ImageMetadataRemover() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);

  const cleanMetadata = async () => {
    if (!file) return;
    setOrigSize(file.size);

    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob(blob => {
      if (blob) {
        setNewSize(blob.size);
        setResultUrl(URL.createObjectURL(blob));
      }
    }, mime, 0.95);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Image to Strip EXIF/Metadata</label>
        <input type="file" accept="image/*" className="input-field" onChange={e => {
          setFile(e.target.files?.[0]);
          setResultUrl(null);
        }} />
        <p className="form-hint">Stripping EXIF metadata removes geolocation GPS coordinates, camera serial numbers, device model, and exposure timestamps for privacy.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={cleanMetadata} disabled={!file}>
          <ShieldCheck size={16} /> Strip Metadata
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <div className="notification notification-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
            Metadata successfully removed! Original size: {formatFileSize(origSize)} ➔ Sanitized: {formatFileSize(newSize)}
          </div>
          <div>
            <img src={resultUrl} alt="Sanitized" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)' }} />
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = 'cleaned_' + (file?.name || 'image.jpg');
              a.click();
            }}><Download size={16} /> Download Sanitized Image</button>
          </div>
        </div>
      )}
    </div>
  );
}
