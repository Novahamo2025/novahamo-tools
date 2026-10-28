import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play, CheckCircle } from 'lucide-react';

const SAMPLES = [
  "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower.",
  "Programming isn't about what you know; it's about what you can figure out. Consistency is the key to mastering code.",
  "The quick brown fox jumps over the lazy dog. Continuous learning and dedication pave the road to engineering excellence.",
  "Simplicity is prerequisite for reliability. Great software is built by solving one clear problem at a time with focus."
];

export default function TypingSpeedTest() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, chars: 0 });
  const inputRef = useRef(null);

  const sample = SAMPLES[sampleIndex];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTest = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(60);
    setInput('');
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e) => {
    if (!isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    const val = e.target.value;
    setInput(val);

    // If typed entire sample
    if (val.length >= sample.length) {
      finishTest(val);
    }
  };

  const finishTest = (finalInput = input) => {
    setIsActive(false);
    setIsFinished(true);

    const elapsedMinutes = (60 - timeLeft) / 60 || 1/60;
    let correctChars = 0;

    for (let i = 0; i < finalInput.length; i++) {
      if (finalInput[i] === sample[i]) {
        correctChars++;
      }
    }

    // Standard formula: (all typed chars / 5) / time in minutes
    const words = finalInput.length / 5;
    const wpm = Math.round(words / elapsedMinutes);
    const accuracy = finalInput.length > 0 ? Math.round((correctChars / finalInput.length) * 100) : 0;

    setStats({ wpm: Math.max(0, wpm), accuracy, chars: finalInput.length });
  };

  const reset = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(60);
    setInput('');
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 100, chars: 0 });
    setSampleIndex((sampleIndex + 1) % SAMPLES.length);
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <span className="badge badge-info" style={{ fontSize: '0.875rem' }}>⏱️ Time Remaining: {timeLeft}s</span>
        <button className="btn btn-secondary btn-sm" onClick={() => setSampleIndex((sampleIndex + 1) % SAMPLES.length)} disabled={isActive}>
          Next Text Sample
        </button>
      </div>

      <div className="card" style={{
        padding: 'var(--space-5)',
        fontSize: '1.125rem',
        lineHeight: 1.8,
        letterSpacing: '0.02em',
        userSelect: 'none',
        marginBottom: 'var(--space-4)'
      }}>
        {sample.split('').map((char, idx) => {
          let color = 'inherit';
          let bg = 'transparent';
          if (idx < input.length) {
            if (input[idx] === char) {
              color = 'var(--color-success)';
            } else {
              color = 'var(--color-error)';
              bg = 'rgba(239, 68, 68, 0.15)';
            }
          }
          return (
            <span key={idx} style={{ color, backgroundColor: bg, borderBottom: idx === input.length ? '2px solid var(--color-primary)' : 'none' }}>
              {char}
            </span>
          );
        })}
      </div>

      <div className="form-group">
        <textarea
          ref={inputRef}
          className="textarea-field"
          rows={3}
          placeholder="Start typing the text above here..."
          value={input}
          onChange={handleInputChange}
          disabled={isFinished}
          style={{ fontSize: '1rem' }}
        />
      </div>

      <div className="tool-actions">
        {!isActive && !isFinished ? (
          <button className="btn btn-primary" onClick={startTest}>
            <Play size={16} /> Start 60s Test
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={() => finishTest()}>Finish Test</button>
        )}
        <button className="btn btn-ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {isFinished && (
        <div className="tool-result">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>🎉 Test Completed!</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Speed</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.wpm} <span style={{ fontSize: '1rem' }}>WPM</span></h2>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Accuracy</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.accuracy}%</h2>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Characters</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.chars}</h2>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <button className="btn btn-primary" onClick={reset}>Try Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
