import { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerPara, setWordsPerPara] = useState(60);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const paras = [];
    for (let p = 0; p < paragraphs; p++) {
      const sentenceWords = [];
      const totalWords = wordsPerPara;

      for (let w = 0; w < totalWords; w++) {
        if (p === 0 && w === 0 && startWithLorem) {
          sentenceWords.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
          w += 7;
          continue;
        }
        const randWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        sentenceWords.push(randWord);
      }

      // Group into sentences
      let text = sentenceWords.join(' ');
      // Capitalize first letter and ensure ending period
      text = text.charAt(0).toUpperCase() + text.slice(1) + '.';
      paras.push(text);
    }

    setOutput(paras.join('\n\n'));
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Number of Paragraphs</label>
          <input
            type="number"
            min={1}
            max={20}
            className="input-field"
            value={paragraphs}
            onChange={e => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Words Per Paragraph</label>
          <input
            type="number"
            min={10}
            max={200}
            className="input-field"
            value={wordsPerPara}
            onChange={e => setWordsPerPara(Math.max(10, Math.min(200, parseInt(e.target.value) || 10)))}
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} />
          Start with &quot;Lorem ipsum dolor sit amet...&quot;
        </label>
      </div>

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={generate}>Generate Lorem Ipsum</button>
      </div>

      {output && (
        <div className="tool-result">
          <div className="form-group">
            <textarea
              className="textarea-field"
              rows={10}
              readOnly
              value={output}
            />
          </div>
          <div className="tool-actions">
            <button className="btn btn-secondary" onClick={async () => {
              const ok = await copyToClipboard(output);
              if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
            }}>
              <Copy size={16} /> {copied ? 'Copied' : 'Copy All Text'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
