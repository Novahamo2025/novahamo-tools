import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Copy, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript + ' ';
      }
      setTranscript(current.trim());
    };

    recognition.onerror = (event) => {
      setError(`Microphone error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListen = () => {
    setError('');
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Voice Transcription</label>
        <textarea
          className="textarea-field"
          rows={10}
          placeholder="Click the 'Start Recording' button and speak into your microphone..."
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
        />
        <p className="form-hint">🔒 Privacy Notice: Microphone access is strictly activated only when you click Start. Audio is processed client-side by browser APIs without transmission to NovaHamo servers.</p>
      </div>

      <div className="tool-actions">
        <button className={`btn ${listening ? 'btn-danger' : 'btn-primary'} btn-lg`} onClick={toggleListen}>
          {listening ? <><MicOff size={18} /> Stop Listening</> : <><Mic size={18} /> Start Recording</>}
        </button>
        <button className="btn btn-secondary" onClick={async () => {
          const ok = await copyToClipboard(transcript);
          if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
        }} disabled={!transcript}>
          <Copy size={16} /> {copied ? 'Copied' : 'Copy Transcript'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setTranscript(''); setError(''); }}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && (
        <div className="notification notification-error" style={{ marginTop: 'var(--space-4)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
