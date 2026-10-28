import { useState } from 'react';
import { Activity, Play, RotateCcw, Info, CheckCircle } from 'lucide-react';

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [latency, setLatency] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');

  const runTest = async () => {
    setTesting(true);
    setError('');
    setLatency(null);
    setJitter(null);
    setDownloadSpeed(null);

    try {
      // Step 1: Latency & Jitter test using public Cloudflare/Google timing endpoint
      setStep('Testing latency & packet jitter...');
      const pings = [];
      const testUrl = 'https://cloudflare.com/cdn-cgi/trace';

      for (let i = 0; i < 4; i++) {
        const t0 = performance.now();
        await fetch(`${testUrl}?cachebust=${Date.now()}_${i}`, { mode: 'no-cors', cache: 'no-store' });
        const t1 = performance.now();
        pings.push(t1 - t0);
      }

      const avgLatency = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
      const jit = Math.round(Math.abs(pings[pings.length - 1] - pings[0]) / (pings.length - 1));
      setLatency(avgLatency);
      setJitter(jit);

      // Step 2: Download speed test using a known public small image payload (~2MB)
      setStep('Measuring network download throughput...');
      const downloadPayloadUrl = 'https://speed.cloudflare.com/__down?bytes=2500000'; // 2.5MB payload
      const startT = performance.now();

      const response = await fetch(`${downloadPayloadUrl}&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Speed test server response was not OK');
      }
      const data = await response.blob();
      const endT = performance.now();

      const durationSec = (endT - startT) / 1000;
      const bitsLoaded = data.size * 8;
      const speedMbps = ((bitsLoaded / durationSec) / (1024 * 1024)).toFixed(2);

      setDownloadSpeed(speedMbps);
      setStep('Test completed successfully');
    } catch (err) {
      // Graceful fallback and clear explanation
      setError('Unable to contact external speed test endpoints. Browser cross-origin policies (CORS) or network restrictions may block direct speed probes.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="notification notification-info" style={{ marginBottom: 'var(--space-6)', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Authentic Measurement:</strong> NovaHamo measures actual live round-trip latency and payload throughput against public edge points. We never fabricate numbers. Browser static environments may vary based on cross-origin restrictions.
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Latency (Ping)</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {latency !== null ? `${latency} ms` : '—'}
            </h2>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Jitter</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {jitter !== null ? `${jitter} ms` : '—'}
            </h2>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Download Throughput</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {downloadSpeed !== null ? `${downloadSpeed} Mbps` : '—'}
            </h2>
          </div>
        </div>

        {step && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            {step}
          </p>
        )}

        <div className="tool-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={runTest} disabled={testing}>
            <Activity size={20} /> {testing ? 'Testing Network...' : 'Run Speed Test'}
          </button>
        </div>
      </div>

      {error && (
        <div className="notification notification-warning" style={{ marginTop: 'var(--space-4)', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--color-warning)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
