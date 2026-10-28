import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN',
  'ON', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE FROM', 'HAVING', 'UNION', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE'
];

export default function SQLFormatter() {
  const [sql, setSql] = useState('select u.id, u.username, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.active = 1 and u.created_at >= "2024-01-01" group by u.id order by total_orders desc limit 10;');
  const [copied, setCopied] = useState(false);

  const formatSQL = () => {
    let text = sql.trim();
    // Capitalize main SQL keywords and place on newline
    SQL_KEYWORDS.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      text = text.replace(regex, `\n${kw}`);
    });

    // Clean up excessive newlines
    const formatted = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        // Indent lines that are conditions or column listings
        if (['AND', 'OR', 'ON'].some(w => line.startsWith(w))) {
          return '  ' + line;
        }
        return line;
      })
      .join('\n');

    setSql(formatted);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">SQL Query</label>
        <textarea
          className="textarea-field"
          rows={10}
          value={sql}
          onChange={e => setSql(e.target.value)}
          placeholder="Paste SQL query to format..."
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
        />
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={formatSQL} disabled={!sql.trim()}>
          Format SQL Query
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(sql);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!sql.trim()}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy SQL'}
        </button>
        <button className="btn btn-ghost" onClick={() => setSql('')}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
