import { useState, useRef, useEffect } from 'react';

// ─── UPDATE THESE ─────────────────────────────────────────────────────────────
const CA = "PASTE_YOUR_CA_HERE";
const TWITTER = "https://x.com/your_me_handle";
const COMMUNITY = "https://x.com/i/communities/your_community_id";
const GEMINI_KEY = import.meta.env?.VITE_APP_GEMINI || '';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rubik:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Rubik+Mono+One&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg: #0d0d0d;
  --card: #161616;
  --card2: #1c1c1c;
  --white: #f4efe8;
  --red: #e83a2e;
  --red2: #ff5a50;
  --border: rgba(244,239,232,0.1);
  --muted: rgba(244,239,232,0.45);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'Rubik', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--red); color: var(--white); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

/* ── BACKGROUND ── */
.site-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.site-bg-img {
  position: absolute;
  inset: 0;
  background-image: url('/wall.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.12;
}
.site-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 70% at 50% 0%, rgba(232,58,46,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 80% 80%, rgba(232,58,46,0.08) 0%, transparent 55%),
    linear-gradient(180deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.85) 100%);
}
.site-bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
}

/* everything above bg */
nav, section, footer, .ticker { position: relative; z-index: 1; }

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px;
  background: rgba(13,13,13,0.8);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(20px);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 0.06em;
  color: var(--white);
}
.nav-logo span { color: var(--red); }
.nav-r { display: flex; align-items: center; gap: 8px; }
.nav-a {
  font-family: 'Rubik', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  padding: 7px 16px;
  border: 1px solid var(--border);
  border-radius: 100px;
  transition: all 0.18s;
  cursor: pointer;
  background: none;
}
.nav-a:hover { color: var(--white); border-color: rgba(244,239,232,0.3); background: rgba(244,239,232,0.05); }
.nav-a.hot { background: var(--red); border-color: var(--red); color: var(--white); }
.nav-a.hot:hover { background: var(--red2); border-color: var(--red2); }
@media(max-width:560px){
  nav { padding: 0 18px; }
  .nav-hide { display: none; }
}

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 80px 24px 64px;
  overflow: hidden;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(232,58,46,0.15);
  border: 1px solid rgba(232,58,46,0.35);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red2);
  margin-bottom: 28px;
  animation: fadeUp 0.7s ease-out both;
}
.hero-badge-dot {
  width: 6px; height: 6px;
  background: var(--red);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

.hero-h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(90px, 18vw, 200px);
  line-height: 0.9;
  letter-spacing: 0.03em;
  color: var(--white);
  margin-bottom: 24px;
  animation: fadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both;
}
.hero-h1 .red { color: var(--red); display: inline-block; animation: tiltIn 0.9s 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes tiltIn { from{opacity:0;transform:rotate(-8deg) scale(0.8)} to{opacity:1;transform:rotate(0deg) scale(1)} }

.hero-sub {
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 400;
  font-style: italic;
  color: var(--muted);
  max-width: 460px;
  line-height: 1.65;
  margin-bottom: 40px;
  animation: fadeUp 0.7s 0.25s ease-out both;
}

.hero-btns {
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
  margin-bottom: 44px;
  animation: fadeUp 0.7s 0.38s ease-out both;
}

.btn-main {
  font-family: 'Rubik', sans-serif;
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 14px 32px;
  background: var(--red);
  color: var(--white);
  border: none; border-radius: 100px;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-main:hover { background: var(--red2); transform: scale(1.05) translateY(-2px); box-shadow: 0 12px 32px rgba(232,58,46,0.4); }

.btn-line {
  font-family: 'Rubik', sans-serif;
  font-size: 13px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 14px 28px;
  background: transparent;
  color: var(--white);
  border: 1.5px solid rgba(244,239,232,0.25);
  border-radius: 100px;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.18s;
}
.btn-line:hover { border-color: rgba(244,239,232,0.6); background: rgba(244,239,232,0.06); }

/* CA */
.ca-box {
  display: inline-flex; align-items: center; gap: 14px;
  background: rgba(244,239,232,0.05);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  max-width: 100%;
  transition: all 0.18s;
  animation: fadeUp 0.7s 0.5s ease-out both;
}
.ca-box:hover { background: rgba(244,239,232,0.08); border-color: rgba(244,239,232,0.2); }
.ca-lbl {
  font-family: 'Rubik Mono One', monospace;
  font-size: 9px; letter-spacing: 0.18em;
  color: var(--red2); flex-shrink: 0;
}
.ca-val {
  font-family: 'Rubik Mono One', monospace;
  font-size: 10px; color: var(--muted);
  min-width: 0; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  flex: 1; max-width: 320px;
}
.ca-cpy {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--white); flex-shrink: 0;
  transition: color 0.15s;
}
.ca-box:hover .ca-cpy { color: var(--red2); }

@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* ── TICKER ── */
.ticker {
  overflow: hidden;
  background: var(--red);
  padding: 12px 0;
  border-top: 1px solid rgba(244,239,232,0.1);
  border-bottom: 1px solid rgba(244,239,232,0.1);
}
.ticker-track {
  display: flex;
  animation: scroll 22s linear infinite;
  white-space: nowrap;
}
.ticker-item {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px; letter-spacing: 0.1em;
  color: var(--white);
  padding: 0 24px;
  flex-shrink: 0;
  display: flex; align-items: center; gap: 18px;
  opacity: 0.85;
}
.ticker-item.bold { opacity: 1; }
.ticker-dot { width: 6px; height: 6px; background: rgba(244,239,232,0.5); border-radius: 50%; flex-shrink: 0; }
@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* ── WHY ── */
.why {
  padding: 96px 32px;
  max-width: 1080px; margin: 0 auto;
}
.sec-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--red2);
  margin-bottom: 48px;
  display: flex; align-items: center; gap: 14px;
}
.sec-label::after { content:''; flex:1; height:1px; background:var(--border); }

.why-big {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(36px, 6vw, 64px);
  line-height: 1.1; letter-spacing: 0.03em;
  color: var(--white);
  margin-bottom: 56px;
  max-width: 700px;
}
.why-big span { color: var(--red); }

.why-cards {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 2px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 56px;
}
@media(max-width:680px){ .why-cards { grid-template-columns: 1fr; } }

.wcard {
  background: var(--card);
  padding: 32px 28px;
  transition: background 0.2s;
  cursor: default;
  position: relative; overflow: hidden;
}
.wcard::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: var(--red);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s ease;
}
.wcard:hover { background: var(--card2); }
.wcard:hover::before { transform: scaleX(1); }
.wcard-n {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 42px; line-height: 1;
  color: rgba(244,239,232,0.07);
  margin-bottom: 14px;
}
.wcard-h {
  font-size: 16px; font-weight: 700;
  color: var(--white);
  margin-bottom: 10px; line-height: 1.35;
}
.wcard-p {
  font-size: 13px; line-height: 1.75;
  color: var(--muted);
}

.manifesto {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px 52px;
  position: relative; overflow: hidden;
}
.manifesto::after {
  content: '🪞';
  position: absolute;
  right: 32px; top: 24px;
  font-size: 80px;
  opacity: 0.06;
  pointer-events: none;
}
.manifesto p {
  font-size: clamp(15px,2vw,19px);
  line-height: 1.85;
  color: var(--muted);
  margin-bottom: 14px;
  font-style: italic;
}
.manifesto p:last-child {
  font-weight: 700; font-style: normal;
  color: var(--white); font-size: clamp(17px,2.2vw,22px);
  margin-bottom: 0;
}
@media(max-width:560px){ .manifesto { padding: 32px 24px; } }

/* ── PFP ── */
.pfp-sec {
  background: var(--card);
  border-top: 1px solid var(--border);
  padding: 96px 32px 100px;
}
.pfp-inner { max-width: 960px; margin: 0 auto; }

.pfp-h {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px,8vw,90px);
  letter-spacing: 0.04em; line-height: 1;
  color: var(--white);
  margin-bottom: 12px;
}
.pfp-h span { color: var(--red); }
.pfp-sub {
  font-size: 15px; font-style: italic;
  color: var(--muted);
  margin-bottom: 52px;
  max-width: 500px;
}

.forge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px; align-items: start;
}
@media(max-width:600px){ .forge-grid { grid-template-columns: 1fr; } }

.forge-col { display: flex; flex-direction: column; gap: 12px; }

.col-tag {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--muted);
  display: flex; align-items: center; gap: 8px;
}
.col-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--red);
  color: var(--white);
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.drop {
  aspect-ratio: 1;
  border: 1.5px dashed rgba(244,239,232,0.15);
  border-radius: 16px;
  background: rgba(244,239,232,0.02);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; overflow: hidden;
}
.drop:hover { border-color: rgba(244,239,232,0.35); background: rgba(244,239,232,0.05); }
.drop.filled { border-style: solid; border-color: rgba(244,239,232,0.2); }
.drop img { width:100%; height:100%; object-fit:cover; display:block; border-radius:14px; }
.drop-ph { text-align:center; padding:24px; pointer-events:none; }
.drop-ic { font-size:36px; margin-bottom:12px; display:block; opacity:.4; }
.drop-lbl { font-size:14px; font-weight:500; color:rgba(244,239,232,.35); margin-bottom:4px; }
.drop-hint { font-family:'Rubik Mono One',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:rgba(244,239,232,.18); }

.result {
  aspect-ratio: 1;
  border: 1.5px solid rgba(244,239,232,0.1);
  border-radius: 16px;
  background: rgba(244,239,232,0.02);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
  transition: border-color 0.3s;
}
.result.done { border-color: rgba(232,58,46,0.4); }
.result img { width:100%; height:100%; object-fit:cover; display:block; border-radius:14px; }
.result-ph { text-align:center; padding:24px; }
.result-big {
  font-family:'Bebas Neue',sans-serif;
  font-size:80px; line-height:1; letter-spacing:.04em;
  color:rgba(244,239,232,.05); margin-bottom:10px;
}
.result-hint {
  font-family:'Rubik Mono One',monospace;
  font-size:9px; letter-spacing:.14em; text-transform:uppercase;
  color:rgba(244,239,232,.2);
}

/* forging */
.forging-ph { text-align:center; padding:24px; }
.spinner {
  width:44px; height:44px;
  border:2px solid rgba(244,239,232,.08);
  border-top-color:var(--red);
  border-radius:50%;
  animation:spin 1s linear infinite;
  margin:0 auto 16px;
}
@keyframes spin{to{transform:rotate(360deg)}}
.forge-status-txt {
  font-size:15px; font-style:italic; color:rgba(244,239,232,.4);
  margin-bottom:6px;
  animation:breathe 2.4s ease-in-out infinite;
}
@keyframes breathe{0%,100%{opacity:.35}50%{opacity:1}}
.forge-pct {
  font-family:'Rubik Mono One',monospace;
  font-size:11px; color:rgba(244,239,232,.2);
  letter-spacing:.08em;
}
.prog { height:2px; background:rgba(244,239,232,.07); border-radius:2px; overflow:hidden; }
.prog-fill { height:100%; background:var(--red); border-radius:2px; transition:width .6s ease; }

/* buttons */
.forge-actions { margin-top:28px; display:flex; flex-direction:column; gap:10px; }
.forge-btn {
  width:100%; padding:18px 28px;
  background:var(--red); color:var(--white);
  border:none; border-radius:14px;
  font-family:'Rubik',sans-serif;
  font-size:15px; font-weight:700;
  letter-spacing:.08em; text-transform:uppercase;
  cursor:pointer;
  transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
  display:flex; align-items:center; justify-content:center; gap:10px;
}
.forge-btn:hover:not(:disabled) { background:var(--red2); transform:scale(1.02) translateY(-2px); box-shadow:0 14px 36px rgba(232,58,46,0.35); }
.forge-btn:active:not(:disabled) { transform:scale(0.99); }
.forge-btn:disabled { opacity:.32; cursor:not-allowed; transform:none; box-shadow:none; }

.dl-btn {
  width:100%; padding:14px 24px;
  background:transparent; color:var(--white);
  border:1.5px solid rgba(244,239,232,.18);
  border-radius:14px;
  font-family:'Rubik',sans-serif;
  font-size:13px; font-weight:600;
  letter-spacing:.08em; text-transform:uppercase;
  cursor:pointer;
  transition:all .18s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.dl-btn:hover { background:rgba(244,239,232,.06); border-color:rgba(244,239,232,.35); }

.share-note {
  text-align:center; font-size:13px; font-style:italic;
  color:rgba(244,239,232,.3); margin-top:4px;
}

.err-box {
  padding:12px 16px;
  background:rgba(232,58,46,.1);
  border:1px solid rgba(232,58,46,.3);
  border-radius:10px;
  font-size:11px; color:rgba(232,58,46,.85);
  font-family:'Rubik Mono One',monospace;
  display:flex; align-items:flex-start; gap:10px;
  letter-spacing:.02em;
}
.err-box button { background:none; border:none; color:rgba(232,58,46,.6); cursor:pointer; flex-shrink:0; font-size:15px; line-height:1; }

.ai-note {
  text-align:center;
  font-family:'Rubik Mono One',monospace;
  font-size:9px; letter-spacing:.14em; text-transform:uppercase;
  color:rgba(244,239,232,.15);
  margin-top:6px;
}

/* ── FOOTER ── */
footer {
  background: var(--bg);
  border-top: 1px solid var(--border);
  padding: 40px 32px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.foot-logo {
  font-family:'Bebas Neue',sans-serif;
  font-size:24px; letter-spacing:.06em;
  color:var(--white);
}
.foot-logo span { color:var(--red); }
.foot-links { display:flex; gap:8px; flex-wrap:wrap; }
.foot-a {
  font-size:11px; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase;
  color:var(--muted);
  text-decoration:none;
  padding:7px 14px;
  border:1px solid var(--border);
  border-radius:100px;
  transition:all .18s;
  cursor:pointer; background:none;
  font-family:'Rubik',sans-serif;
}
.foot-a:hover { color:var(--white); border-color:rgba(244,239,232,.25); }
.foot-tag { font-size:13px; font-style:italic; color:rgba(244,239,232,.2); }
`;

export default function App() {
  const [uploaded, setUploaded] = useState(null);
  const [b64, setB64] = useState(null);
  const [result, setResult] = useState(null);
  const [forging, setForging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const fileRef = useRef(null);

  const STATUSES = ['Studying your character…', 'Finding the mirror…', 'Placing both faces…', 'Refining the reflection…', 'Almost ready…'];

  useEffect(() => {
    if (!forging) return;
    let i = 0; setStatusMsg(STATUSES[0]);
    const t = setInterval(() => { i = (i + 1) % STATUSES.length; setStatusMsg(STATUSES[i]); }, 2400);
    return () => clearInterval(t);
  }, [forging]);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onloadend = () => { setUploaded(r.result); setB64(r.result.split(',')[1]); setResult(null); setErr(null); };
    r.readAsDataURL(f);
  };

  const copyCA = () => {
    try { navigator.clipboard.writeText(CA); } catch {
      const el = document.createElement('textarea'); el.value = CA;
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const forge = async () => {
    if (!b64 || forging) return;
    if (!GEMINI_KEY) { setErr('Add VITE_APP_GEMINI to your .env file.'); return; }
    setForging(true); setResult(null); setProgress(0); setErr(null);
    const timer = setInterval(() => setProgress(p => Math.min(p + Math.random() * 5, 88)), 900);

    try {
      const tRes = await fetch('/template.jpg');
      if (!tRes.ok) throw new Error('template.jpg not found — add your $ME mascot to /public/template.jpg');
      const tBlob = await tRes.blob();
      const tB64 = await new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result.split(',')[1]); r.readAsDataURL(tBlob); });

      const prompt = `You are not editing the template character. You are rebuilding the entire scene using the user’s character.

Image 1 is only a pose and composition reference. Ignore the identity, body, head, and hands of the template character completely. Do not reuse or modify the original character in any way.

Take the character from Image 2 and place them into the exact same position, pose, and perspective as the character in Image 1. The user’s character must fully replace the template character, including head shape, body type, proportions, and hands, so it looks like they are naturally the one holding the mirror.

Inside the mirror, show the same character, but as an uplifted and improved version of themselves — more confident, refined, and powerful. This is the same identity, not a different character.

The entire final image should match the art style of the user’s image. Adapt the full scene (character, background, lighting) so everything looks consistent in that style.

The final result should look like the user’s character is standing there, holding a mirror, and seeing the best version of themselves.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: tB64 } }, { inlineData: { mimeType: 'image/jpeg', data: b64 } }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
          })
        }
      );

      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error?.message || `API error ${res.status}`); }
      const data = await res.json();
      const imgData = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (!imgData) throw new Error('No image returned — try a clearer photo and try again.');

      setTimeout(() => { setResult(`data:image/png;base64,${imgData}`); setProgress(100); setForging(false); }, 400);
    } catch (e) {
      setErr(e.message || 'Something went wrong. Try again.');
      setForging(false);
    } finally { clearInterval(timer); }
  };

  const TI = ['$ME', 'It Starts With Me', 'I Am The Mirror', 'Change Starts Here', '$ME', 'Be The Change', 'Stop Waiting', 'I Am The Solution', '$ME', 'The Trenches Need You'];
  const TI2 = [...TI, ...TI];

  return (
    <>
      <style>{css}</style>

      {/* fixed background — always visible */}
      <div className="site-bg">
        <div className="site-bg-img" />
        <div className="site-bg-gradient" />
        <div className="site-bg-noise" />
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-logo">$<span>ME</span></div>
        <div className="nav-r">
          <a className="nav-a nav-hide" href={TWITTER} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a className="nav-a nav-hide" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Community</a>
          <a className="nav-a hot" href="#pfpcult">Make PFP 🪞</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span className="hero-badge-dot" />Solana · Self-Accountability Coin</div>
        <h1 className="hero-h1">Change starts<br/>with <span className="red">$ME</span></h1>
        <p className="hero-sub">The trenches doesn't need saving from outside.<br/>It needs you to look in the mirror.</p>
        <div className="hero-btns">
          <a className="btn-main" href="#pfpcult">Make your $ME PFP 🪞</a>
          <a className="btn-line" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Join the community</a>
        </div>
        <div className="ca-box" onClick={copyCA}>
          <span className="ca-lbl">CA</span>
          <span className="ca-val">{CA}</span>
          <span className="ca-cpy">{copied ? '✓ Copied!' : 'Copy'}</span>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ticker-track">
          {TI2.map((t, i) => (
            <div key={i} className={`ticker-item ${t === '$ME' ? 'bold' : ''}`}>
              {t}<span className="ticker-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section className="why">
        <div className="sec-label">Why $ME exists</div>
        <p className="why-big">The trenches isn't dying because of bundlers.<br/>It's dying because of <span>us.</span></p>
        <div className="why-cards">
          {[
            { n: '01', h: 'We are the problem', p: 'We snipe each other, dump on each other, follow the same callers into the same traps every single cycle. Nobody waits for themselves to be the solution.' },
            { n: '02', h: 'We keep looking outside', p: 'New platform, new meta, new narrative — always waiting for something external to change the game. The answer was never out there.' },
            { n: '03', h: 'Until now', p: '$ME is for the person who finally looked in the mirror. Who stopped pointing. Who decided the only thing they can actually control is themselves.' },
          ].map(c => (
            <div key={c.n} className="wcard">
              <div className="wcard-n">{c.n}</div>
              <div className="wcard-h">{c.h}</div>
              <div className="wcard-p">{c.p}</div>
            </div>
          ))}
        </div>
        <div className="manifesto">
          <p>Nobody is coming to fix this. Not the platform. Not the devs. Not the next narrative. Not the bull run.</p>
          <p>The only person who changes how this goes is the person holding the phone right now.</p>
          <p>I am the floor. I am the culture. I am the solution. It starts with me. 🪞</p>
        </div>
      </section>

      {/* PFP CULT */}
      <section className="pfp-sec" id="pfpcult">
        <div className="pfp-inner">
          <div className="sec-label">PFP Cult — AI transformation</div>
          <h2 className="pfp-h">Upload your character.<br/>Become <span>$ME</span>.</h2>
          <p className="pfp-sub">Our AI puts your character into the $ME mirror scene — both the one holding the mirror and the reflection inside it.</p>

          <div className="forge-grid">
            {/* Upload */}
            <div className="forge-col">
              <div className="col-tag"><span className="col-num">1</span>Your character / photo</div>
              <div className={`drop ${uploaded ? 'filled' : ''}`} onClick={() => fileRef.current?.click()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }} onDragOver={e => e.preventDefault()}>
                {uploaded
                  ? <img src={uploaded} alt="Your character" />
                  : <div className="drop-ph"><span className="drop-ic">🤳</span><div className="drop-lbl">Drop your photo here</div><div className="drop-hint">or click to browse</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
              {uploaded && (
                <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: 'rgba(244,239,232,.3)', fontFamily: 'Rubik', fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 0', transition: 'color .18s' }} onMouseOver={e => e.currentTarget.style.color = 'rgba(244,239,232,.7)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(244,239,232,.3)'}>
                  Change photo
                </button>
              )}
            </div>

            {/* Result */}
            <div className="forge-col">
              <div className="col-tag"><span className="col-num">2</span>Your $ME PFP</div>
              <div className={`result ${result ? 'done' : ''}`}>
                {result
                  ? <img src={result} alt="Your $ME PFP" />
                  : forging
                  ? <div className="forging-ph"><div className="spinner" /><div className="forge-status-txt">{statusMsg}</div><div className="forge-pct">{Math.round(progress)}%</div></div>
                  : <div className="result-ph"><div className="result-big">$ME</div><div className="result-hint">Your transformation awaits</div></div>}
              </div>
              {forging && <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>}
            </div>
          </div>

          {/* Actions */}
          <div className="forge-actions">
            {err && <div className="err-box"><span>{err}</span><button onClick={() => setErr(null)}>✕</button></div>}
            <button className="forge-btn" onClick={forge} disabled={!b64 || forging}>
              {forging
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(244,239,232,.15)', borderTopColor: 'var(--white)', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} /> Forging your $ME…</>
                : result ? 'Forge Again 🪞' : 'Forge My $ME PFP 🪞'}
            </button>
            {result && (
              <>
                <button className="dl-btn" onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `ME_PFP_${Date.now()}.png`; a.click(); }}>
                  ↓ Download PFP
                </button>
                <div className="share-note">Set it as your PFP and tag us on X 🔥</div>
              </>
            )}
            <div className="ai-note">Powered by Gemini AI · Images are never stored</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-logo">$<span>ME</span></div>
        <div className="foot-links">
          <a className="foot-a" href={TWITTER} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a className="foot-a" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Community</a>
          <button className="foot-a" onClick={copyCA}>{copied ? '✓ Copied' : 'Copy CA'}</button>
        </div>
        <div className="foot-tag">It starts with me. 🪞</div>
      </footer>
    </>
  );
}
