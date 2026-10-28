import { useState } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { copyToClipboard } from '../../utils/download';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;

export default function PDFToText() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const extractText = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${i} ---\n\n` + pageStrings + '\n\n';
      }

      setExtractedText(fullText.trim());
    } catch (err) {
      setError(`Extraction error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (file?.name.replace(/\.[^/.]+$/, '') || 'extracted_text') + '.txt';
    a.click();
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Text-Based PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={e => { setFile(e.target.files?.[0]); setExtractedText(''); setError(''); }}
        />
        <p className="form-hint">Extracts full document text client-side directly in the browser.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={extractText} disabled={!file || loading}>
          {loading ? 'Reading Document Content...' : 'Extract Full Text'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setExtractedText(''); setError(''); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {error && <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}

      {extractedText && (
        <div className="tool-result">
          <div className="form-group">
            <textarea
              className="textarea-field"
              rows={12}
              readOnly
              value={extractedText}
            />
          </div>

          <div className="tool-actions">
            <button className="btn btn-primary" onClick={downloadTxt}>
              <Download size={16} /> Download as .txt
            </button>
            <button className="btn btn-secondary" onClick={async () => {
              const ok = await copyToClipboard(extractedText);
              if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
            }}>
              <Copy size={16} /> {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
