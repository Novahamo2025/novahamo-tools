import { useState, useRef } from 'react';
import { Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export default function VideoThumbnail() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setThumbnails([]);
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const extractThumbnails = async () => {
    if (!videoRef.current || duration <= 0) return;
    setLoading(true);
    setThumbnails([]);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const snaps = [];

    // Extract 6 frames uniformly distributed
    const count = 6;
    for (let i = 1; i <= count; i++) {
      const seekTime = (duration / (count + 1)) * i;
      await new Promise(res => {
        video.currentTime = seekTime;
        video.onseeked = () => {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          snaps.push({
            id: i,
            time: Math.round(seekTime),
            timeFormatted: formatDuration(seekTime * 1000),
            dataUrl: canvas.toDataURL('image/jpeg', 0.9),
          });
          res();
        };
      });
    }

    setThumbnails(snaps);
    setLoading(false);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Video File (MP4, WebM)</label>
        <input
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          className="input-field"
          onChange={handleFile}
        />
      </div>

      {videoUrl && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 'var(--radius-md)' }}
          />
          <p className="form-hint">Duration: {Math.round(duration)} seconds</p>
        </div>
      )}

      <div className="tool-actions">
        <button className="btn btn-primary" onClick={extractThumbnails} disabled={!videoUrl || loading}>
          {loading ? 'Capturing Video Frames...' : 'Extract High-Res Thumbnails'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setFile(null); setVideoUrl(null); setThumbnails([]); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {thumbnails.length > 0 && (
        <div className="tool-result">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Extracted Thumbnails ({thumbnails.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {thumbnails.map(t => (
              <div key={t.id} className="card" style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                <img src={t.dataUrl} alt={`Timestamp ${t.timeFormatted}`} style={{ width: '100%', borderRadius: 'var(--radius-sm)' }} />
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 'var(--space-2) 0' }}>
                  Timestamp: {t.timeFormatted}
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = t.dataUrl;
                    a.download = `thumbnail_${t.time}s.jpg`;
                    a.click();
                  }}
                >
                  <Download size={14} /> Download Thumbnail
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
