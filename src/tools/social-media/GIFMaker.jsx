import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function GIFMaker() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [fps, setFps] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);

    Promise.all(selected.map(f => new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = URL.createObjectURL(f);
    }))).then(imgs => {
      setImages(imgs);
      setCurrentFrame(0);
      setPlaying(true);
    });
  };

  useEffect(() => {
    if (playing && images.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentFrame(curr => (curr + 1) % images.length);
      }, 1000 / fps);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, images, fps]);

  useEffect(() => {
    if (images.length > 0 && canvasRef.current) {
      const img = images[currentFrame];
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#111C2E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    }
  }, [currentFrame, images]);

  const downloadFrame = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `frame_${currentFrame + 1}.png`;
    a.click();
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Upload Sequence Images / Frames (Select 2+)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="input-field"
          onChange={handleFiles}
        />
        {files.length > 0 && <p className="form-hint">{files.length} frames loaded</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Playback Speed ({fps} FPS / Frames Per Second)</label>
          <input type="range" min={1} max={15} value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      {images.length > 0 && (
        <div className="tool-result" style={{ textAlign: 'center' }}>
          <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Playing frame <strong>{currentFrame + 1}</strong> of {images.length}
          </p>

          <div className="tool-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setPlaying(!playing)}>
              {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play Animation</>}
            </button>
            <button className="btn btn-secondary" onClick={downloadFrame}>
              <Download size={16} /> Download Active Frame
            </button>
            <button className="btn btn-ghost" onClick={() => { setFiles([]); setImages([]); setPlaying(false); }}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
