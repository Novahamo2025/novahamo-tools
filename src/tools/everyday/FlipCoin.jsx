import { useState } from 'react';
import { RotateCcw, CircleDollarSign } from 'lucide-react';

export default function FlipCoin() {
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0 });

  const flip = () => {
    setFlipping(true);
    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.random() > 0.5 ? 'HEADS' : 'TAILS');
      count++;
      if (count > 10) {
        clearInterval(interval);
        // Cryptographically secure determination
        const arr = new Uint8Array(1);
        window.crypto.getRandomValues(arr);
        const outcome = arr[0] % 2 === 0 ? 'HEADS' : 'TAILS';
        setResult(outcome);
        setFlipping(false);
        setStats(s => ({
          heads: s.heads + (outcome === 'HEADS' ? 1 : 0),
          tails: s.tails + (outcome === 'TAILS' ? 1 : 0),
          total: s.total + 1,
        }));
      }
    }, 70);
  };

  const reset = () => {
    setResult(null);
    setStats({ heads: 0, tails: 0, total: 0 });
  };

  return (
    <div className="tool-workspace">
      <div style={{ textAlign: 'center', margin: 'var(--space-6) 0' }}>
        <div style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          backgroundColor: result === 'HEADS' ? '#15803D' : result === 'TAILS' ? '#2563EB' : 'var(--color-card)',
          color: result ? '#FFFFFF' : 'var(--color-text)',
          border: '4px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)',
          transform: flipping ? 'rotateY(720deg) scale(1.1)' : 'rotateY(0deg) scale(1)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {result ? (
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{result}</span>
          ) : (
            <CircleDollarSign size={48} />
          )}
        </div>
      </div>

      <div className="tool-actions" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={flip} disabled={flipping}>
          Flip Coin
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {stats.total > 0 && (
        <div className="tool-result" style={{ maxWidth: 400, margin: 'var(--space-6) auto 0' }}>
          <div className="grid grid-3" style={{ textAlign: 'center' }}>
            <div className="card" style={{ padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>HEADS</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats.heads}</p>
              <span style={{ fontSize: '0.75rem' }}>{Math.round((stats.heads / stats.total) * 100)}%</span>
            </div>
            <div className="card" style={{ padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>TAILS</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>{stats.tails}</p>
              <span style={{ fontSize: '0.75rem' }}>{Math.round((stats.tails / stats.total) * 100)}%</span>
            </div>
            <div className="card" style={{ padding: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>TOTAL FLIPS</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
