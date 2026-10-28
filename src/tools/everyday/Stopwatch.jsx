import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const requestRef = useRef(null);

  useEffect(() => {
    if (running) {
      startTimeRef.current = performance.now();
      const update = () => {
        const now = performance.now();
        setElapsed(accumulatedRef.current + (now - startTimeRef.current));
        requestRef.current = requestAnimationFrame(update);
      };
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [running]);

  const toggle = () => {
    if (running) {
      accumulatedRef.current = elapsed;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const lap = () => {
    if (!running) return;
    const currentLapTime = elapsed;
    const prevLapTime = laps.length > 0 ? laps[0].rawTime : 0;
    const lapDiff = currentLapTime - prevLapTime;
    setLaps([{ id: laps.length + 1, time: formatDuration(currentLapTime), diff: formatDuration(lapDiff), rawTime: currentLapTime }, ...laps]);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    setLaps([]);
  };

  return (
    <div className="tool-workspace">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>ELAPSED TIME</p>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          {formatDuration(elapsed)}
        </h1>
      </div>

      <div className="tool-actions" style={{ justifyContent: 'center' }}>
        <button className={`btn ${running ? 'btn-danger' : 'btn-primary'} btn-lg`} onClick={toggle}>
          {running ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
        </button>
        <button className="btn btn-secondary btn-lg" onClick={lap} disabled={!running}>
          <Flag size={20} /> Lap
        </button>
        <button className="btn btn-ghost btn-lg" onClick={reset}>
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="tool-result" style={{ maxWidth: 500, margin: 'var(--space-6) auto 0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Recorded Laps ({laps.length})</h3>
          <div style={{ maxHeight: 250, overflowY: 'auto' }}>
            {laps.map(l => (
              <div key={l.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-4)',
                borderBottom: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
              }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Lap #{l.id}</span>
                <span>+{l.diff}</span>
                <strong style={{ color: 'var(--color-primary)' }}>{l.time}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
