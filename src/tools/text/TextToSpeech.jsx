import { useState, useEffect } from 'react';
import { Volume2, Pause, Play, Square, RotateCcw } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('Welcome to NovaHamo Tools. All your everyday productivity tools in one unified browser platform.');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        setSelectedVoice(available[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!text.trim() || !supported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find(v => v.name === selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  if (!supported) {
    return (
      <div className="tool-workspace">
        <div className="notification notification-error">
          Web Speech API is not supported in this browser. Please try Chrome, Edge, or Safari.
        </div>
      </div>
    );
  }

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Text to Speak</label>
        <textarea
          className="textarea-field"
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste the speech script..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Voice</label>
          <select className="select-field" value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}>
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Speed / Rate: {rate}x</label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Pitch: {pitch}</label>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="tool-actions">
        {!speaking ? (
          <button className="btn btn-primary btn-lg" onClick={speak} disabled={!text.trim()}>
            <Volume2 size={20} /> Read Aloud
          </button>
        ) : (
          <button className="btn btn-danger btn-lg" onClick={stop}>
            <Square size={18} /> Stop Speaking
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => { stop(); setText(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>
    </div>
  );
}
