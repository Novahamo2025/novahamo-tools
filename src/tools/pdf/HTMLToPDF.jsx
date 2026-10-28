import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function HTMLToPDF() {
  const [htmlContent, setHtmlContent] = useState(`<h1>Invoice #1042</h1>
<p><strong>Customer:</strong> John Doe</p>
<p><strong>Date:</strong> 2024-05-18</p>
<hr />
<table border="1" cellpadding="6" style="border-collapse:collapse; width:100%;">
  <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
  <tr><td>Web Design</td><td>1</td><td>$500.00</td></tr>
  <tr><td>Domain Registration</td><td>1</td><td>$15.00</td></tr>
</table>
<p style="text-align:right;"><strong>Total Due: $515.00</strong></p>`);
  const [loading, setLoading] = useState(false);

  const convertHTML = async () => {
    if (!htmlContent.trim()) return;
    setLoading(true);

    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.width = '550px';
      container.style.padding = '20px';
      container.style.fontFamily = 'Helvetica, Arial, sans-serif';
      document.body.appendChild(container);

      await doc.html(container, {
        x: 20,
        y: 20,
        callback: function (pdf) {
          document.body.removeChild(container);
          pdf.save('html_export.pdf');
          setLoading(false);
        },
      });
    } catch (err) {
      alert('HTML to PDF rendering error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">HTML Content / Code to Convert</label>
        <textarea
          className="textarea-field"
          rows={12}
          value={htmlContent}
          onChange={e => setHtmlContent(e.target.value)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
        />
        <p className="form-hint">Renders and compiles standard HTML tables, typography, and styling directly to a vectorized PDF.</p>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={convertHTML} disabled={!htmlContent.trim() || loading}>
          <Download size={16} /> {loading ? 'Rendering PDF...' : 'Convert & Download PDF'}
        </button>
        <button className="btn btn-ghost" onClick={() => setHtmlContent('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
