import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setCompleted(true);
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              osc.start();
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
              setTimeout(() => osc.stop(), 1000);
            } catch (e) {}
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const start = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    if (!running && remaining === totalSeconds) {
      setTotalSeconds(total);
      setRemaining(total);
    }
    setCompleted(false);
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setCompleted(false);
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(total);
    setRemaining(total);
  };

  const formatRemaining = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = n => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  };

  return (
    <div className="tool-workspace">
      {!running && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label">Hours</label>
            <input type="number" min={0} max={99} className="input-field" style={{ textAlign: 'center', fontSize: '1.25rem' }} value={hours} onChange={e => setHours(Math.max(0, parseInt(e.target.value) || 0))} />
          </div>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label">Minutes</label>
            <input type="number" min={0} max={59} className="input-field" style={{ textAlign: 'center', fontSize: '1.25rem' }} value={minutes} onChange={e => setMinutes(Math.max(0, parseInt(e.target.value) || 0))} />
          </div>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label">Seconds</label>
            <input type="number" min={0} max={59} className="input-field" style={{ textAlign: 'center', fontSize: '1.25rem' }} value={seconds} onChange={e => setSeconds(Math.max(0, parseInt(e.target.value) || 0))} />
          </div>
        </div>
      )}

      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          color: completed ? 'var(--color-error)' : 'var(--color-primary)',
          margin: 0,
        }}>
          {formatRemaining(remaining)}
        </h1>
        {completed && (
          <div className="badge badge-error" style={{ fontSize: '1rem', marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)' }}>
            <Bell size={18} /> Time&apos;s Up!
          </div>
        )}
      </div>

      <div className="tool-actions" style={{ justifyContent: 'center' }}>
        {!running ? (
          <button className="btn btn-primary btn-lg" onClick={start} disabled={hours === 0 && minutes === 0 && seconds === 0}>
            <Play size={20} /> Start Timer
          </button>
        ) : (
          <button className="btn btn-danger btn-lg" onClick={pause}>
            <Pause size={20} /> Pause
          </button>
        )}
        <button className="btn btn-ghost btn-lg" onClick={reset}>
          <RotateCcw size={20} /> Reset
        </button>
      </div>
    </div>
  );
}
