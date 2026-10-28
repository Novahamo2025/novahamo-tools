import { useState } from 'react';
import { Download, RotateCcw, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/download';

export default function HEICToJPG() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      // Dynamic check for heic2any
      let heic2any;
      try {
        heic2any = (await import('heic2any')).default;
      } catch (err) {
        throw new Error('HEIC decoding engine is not bundled or supported in this browser. Please use standard JPG/PNG formats or upload a JPEG.');
      }

      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Failed to convert HEIC image. The file may be corrupt or encoded in an unsupported format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload HEIC / HEIF Photo</label>
        <input
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          className="input-field"
          onChange={e => {
            setFile(e.target.files?.[0]);
            setResultUrl(null);
            setError('');
          }}
        />
        {file && <p className="form-hint">{file.name} ({formatFileSize(file.size)})</p>}
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convert} disabled={!file || loading}>
          {loading ? 'Converting HEIC...' : 'Convert to JPG'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setResultUrl(null); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {resultUrl && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <img src={resultUrl} alt="Converted JPG" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)' }} />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary" onClick={() => {
              const a = document.createElement('a');
              a.href = resultUrl;
              a.download = (file?.name.replace(/\.[^/.]+$/, '') || 'photo') + '.jpg';
              a.click();
            }}><Download size={16} /> Download JPG</button>
          </div>
        </div>
      )}
    </div>
  );
}
