import { useState } from 'react';
import { Copy, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../../utils/download';

const CAPTION_TEMPLATES = {
  travel: [
    "Wander often, wonder always. ✈️🌍 Exploring hidden gems and making memories.",
    "Collect moments, not things. Finding peace where the wifi is weak. 🏔️✨",
    "Passport in hand, adventure in my soul. Onto the next horizon! 🌅🗺️",
    "Living on island time and soaking in every sunrise. 🌴🌊",
    "The journey is the destination. Grateful for every step along the way. 🚀",
  ],
  tech: [
    "Building tomorrow’s software, one line of clean code at a time. 💻⚡",
    "Turning coffee into reliable algorithms and user-first architecture. ☕🚀",
    "Simplicity in design, robustness in execution. Keep innovating. 🌐💡",
    "Debugging: being the detective in a crime movie where you are also the murderer. 🕵️‍♂️💻",
    "Technology is best when it empowers people to create more. 🛠️✨",
  ],
  fitness: [
    "The only bad workout is the one that didn't happen. Stronger every day! 💪🔥",
    "Consistency beats motivation every single time. Put in the reps. 🏋️‍♂️✨",
    "Sweat today, smile tomorrow. Fueling body, mind, and spirit. 🏃‍♀️🥗",
    "Progress over perfection. Falling in love with the process. 🎯👟",
    "Your body can stand almost anything. It’s your mind that you have to convince. 🧠💥",
  ],
  motivation: [
    "Your dreams don't work unless you do. Step up and make it count today. 🌟",
    "Small daily improvements over time lead to stunning results. Keep going! 📈🏆",
    "Doubt kills more dreams than failure ever will. Trust your journey. 🚀💫",
    "Be the energy you want to attract. Radiate positivity and purpose. ☀️🌻",
    "Every master was once a beginner. Start where you are with what you have. 🔑🎯",
  ],
  business: [
    "Building value, creating impact, and solving real problems every day. 💼📈",
    "Leadership isn't about being in charge; it’s about taking care of those in your charge. 🤝🏢",
    "Focus on customer value and product excellence. Everything else follows. 💡📊",
    "Work smart, stay humble, and build something that lasts. 🏆🌱",
    "Big goals require dedicated teams and relentless execution. Let's do this! 🚀👥",
  ]
};

export default function CaptionGenerator() {
  const [niche, setNiche] = useState('travel');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const captions = CAPTION_TEMPLATES[niche] || [];

  const handleCopy = async (cap, idx) => {
    const ok = await copyToClipboard(cap);
    if (ok) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    }
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Select Content Category / Niche</label>
        <select className="select-field" value={niche} onChange={e => setNiche(e.target.value)}>
          <option value="travel">Travel & Adventure</option>
          <option value="tech">Tech & Software Development</option>
          <option value="fitness">Fitness & Health</option>
          <option value="motivation">Motivation & Mindset</option>
          <option value="business">Business & Entrepreneurship</option>
        </select>
        <p className="form-hint">Note: Generates curated, engaging social media caption suggestions based on tested niche templates.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        {captions.map((cap, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)' }}>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, margin: 0, paddingRight: 'var(--space-4)' }}>{cap}</p>
            <button className="btn btn-secondary btn-sm" onClick={() => handleCopy(cap, idx)} style={{ flexShrink: 0 }}>
              <Copy size={14} /> {copiedIdx === idx ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
