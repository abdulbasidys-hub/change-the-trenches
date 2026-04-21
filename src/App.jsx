import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useMotionValue, useInView, useAnimationControls,
  MotionConfig
} from 'framer-motion';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CA = "AgQvpRjyd7pwtzMLZjGGbycSqwipdaRqpcC67K4xpump";
const TWITTER = "https://x.com/i/communities/2037371326072062076";
const COMMUNITY = "https://x.com/i/communities/2037371326072062076";
const GEMINI_KEY = import.meta.env?.VITE_APP_GEMINI || '';
const OR_KEY = import.meta.env?.VITE_OR_PROVIDER_ID || '';

const FALLBACK_QUOTES = [
  "The market didn't do this to you. You did this to you. That's the good news.",
  "Your worst trade wasn't the coin. It was the version of you who made it.",
  "Everyone is waiting for the meta to change. The person who changes first wins.",
  "Conviction isn't something you borrow from a CT caller. You build it yourself.",
  "Stop asking when things get better. Start asking what you're doing differently.",
  "The trenches doesn't need saving. You do.",
  "You can blame the bundler, or you can look at your own hand on the mouse.",
  "I was the noise I kept complaining about. That realization changed everything.",
  "Fear and greed aren't market forces. They're personal failures dressed up as analysis.",
  "Nobody rugged you harder than you rugged yourself with your own decisions.",
  "The chart is a mirror. It shows you exactly who you've been.",
  "Change doesn't start when the market changes. It starts when you do.",
  "You don't need a better coin. You need a better version of yourself holding it.",
  "Every cycle ends the same way. The people who changed themselves found the exit.",
  "The only position that actually matters is who you're becoming.",
];

// ─── SPRING CONFIGS ───────────────────────────────────────────────────────────
const SPRING_SOFT    = { type: 'spring', stiffness: 80,  damping: 20 };
const SPRING_BOUNCY  = { type: 'spring', stiffness: 200, damping: 18 };
const SPRING_SNAPPY  = { type: 'spring', stiffness: 300, damping: 28 };
const SPRING_GENTLE  = { type: 'spring', stiffness: 60,  damping: 25 };

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1 },
};
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};
const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};
const stagger = (delay = 0.1) => ({
  visible: { transition: { staggerChildren: delay } },
});

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rubik:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,700&family=Rubik+Mono+One&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #090909;
  --surface: #111111;
  --surface2: #181818;
  --surface3: #202020;
  --white: #f3ede4;
  --w60: rgba(243,237,228,0.6);
  --w30: rgba(243,237,228,0.3);
  --w10: rgba(243,237,228,0.1);
  --w06: rgba(243,237,228,0.06);
  --w03: rgba(243,237,228,0.03);
  --red: #e0342a;
  --red2: #ff4d42;
  --red-glow: rgba(224,52,42,0.28);
  --gold: #c9a84c;
  --border: rgba(243,237,228,0.08);
  --border2: rgba(243,237,228,0.14);
}

body.light {
  --bg: #eeead f;
  --bg: #ede8df;
  --surface: #e4dfd5;
  --surface2: #dbd5ca;
  --surface3: #d2ccc0;
  --white: #120f0c;
  --w60: rgba(18,15,12,0.6);
  --w30: rgba(18,15,12,0.3);
  --w10: rgba(18,15,12,0.1);
  --w06: rgba(18,15,12,0.06);
  --w03: rgba(18,15,12,0.02);
  --border: rgba(18,15,12,0.1);
  --border2: rgba(18,15,12,0.18);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'Rubik', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  transition: background 0.5s ease, color 0.5s ease;
  cursor: none;
}

@media(max-width: 768px) { body { cursor: auto; } }

::selection { background: var(--red); color: #fff; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

/* ── CURSOR ── */
.cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  background: var(--red);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference;
}
.cursor-ring {
  position: fixed;
  top: 0; left: 0;
  width: 32px; height: 32px;
  border: 1.5px solid rgba(243,237,228,0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
}
@media(max-width:768px){ .cursor-dot,.cursor-ring{ display:none; } }

/* ── SITE BACKGROUND ── */
.site-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.site-bg-img {
  position: absolute; inset: 0;
  background-image: url('/wall.jpg');
  background-size: cover; background-position: center;
  opacity: 0.1;
  transition: opacity 0.5s;
}
body.light .site-bg-img { opacity: 0.07; }
.site-bg-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 100% 80% at 50% -5%, rgba(224,52,42,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 70% 60% at 90% 90%, rgba(224,52,42,0.06) 0%, transparent 50%);
  transition: opacity 0.5s;
}
body.light .site-bg-glow { opacity: 0.5; }
.site-bg-noise {
  position: absolute; inset: 0; opacity: 0.45;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
}
.orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(110px);
  mix-blend-mode: screen;
}
.orb1 { width:700px; height:700px; top:-200px; right:-150px; background:radial-gradient(circle at 35% 35%, rgba(224,52,42,0.18), transparent 65%); }
.orb2 { width:500px; height:500px; bottom:15%; left:-80px; background:radial-gradient(circle at 60% 55%, rgba(243,237,228,0.04), transparent 65%); }
.orb3 { width:380px; height:380px; top:42%; right:8%; background:radial-gradient(circle at 45% 45%, rgba(201,168,76,0.06), transparent 60%); }

nav, section, .ticker-wrap, footer, .sticky-bar { position: relative; z-index: 1; }

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  background: rgba(9,9,9,0.72);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  transition: background 0.5s;
}
body.light nav { background: rgba(237,232,223,0.8); }
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px; letter-spacing: 0.07em;
  color: var(--white); text-decoration: none;
  display: flex; align-items: center;
}
.nav-logo-red { color: var(--red); }
.nav-links { display: flex; align-items: center; gap: 6px; }
.nav-link {
  font-family: 'Rubik', sans-serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--w60); text-decoration: none;
  padding: 7px 16px;
  border: 1px solid var(--border);
  border-radius: 100px;
  background: none; cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
}
.nav-link:hover { color: var(--white); border-color: var(--border2); background: var(--w06); }
.nav-link.cta { background: var(--red); border-color: var(--red); color: #fff; }
.nav-link.cta:hover { background: var(--red2); border-color: var(--red2); }
.nav-link.icon { width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
@media(max-width:580px){ nav { padding: 0 16px; } .nav-hide { display: none; } }

/* ── STICKY BAR ── */
.sticky-bar {
  position: fixed; top: 60px; left: 0; right: 0; z-index: 150;
  height: 34px;
  display: flex; align-items: center; justify-content: center; gap: 20px;
  background: rgba(9,9,9,0.6);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(20px);
  transition: background 0.5s;
}
body.light .sticky-bar { background: rgba(237,232,223,0.65); }
.bar-dot { width: 5px; height: 5px; background: var(--red); border-radius: 50%; }
.bar-text {
  font-family: 'Rubik', sans-serif;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--w30);
}
.bar-price {
  font-family: 'Rubik Mono One', monospace;
  font-size: 10px; color: var(--w60);
  letter-spacing: 0.06em;
}

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 120px 28px 80px;
  overflow: hidden;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(224,52,42,0.1);
  border: 1px solid rgba(224,52,42,0.28);
  border-radius: 100px; padding: 6px 18px;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--red2); margin-bottom: 28px;
}
.eye-dot { width: 5px; height: 5px; background: var(--red); border-radius: 50%; }
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(90px, 18vw, 210px);
  line-height: 0.88; letter-spacing: 0.02em;
  color: var(--white); position: relative; display: block;
}
.hero-title .red { color: var(--red); display: inline-block; }
.hero-reflection {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(90px, 18vw, 210px);
  line-height: 0.88; letter-spacing: 0.02em;
  color: var(--white);
  display: block;
  transform: scaleY(-1);
  opacity: 0.07;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 65%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 65%);
  pointer-events: none; user-select: none;
  margin-bottom: 12px;
}
.hero-sub {
  font-size: clamp(15px, 2.2vw, 20px);
  font-style: italic; font-weight: 400;
  color: var(--w60); max-width: 440px;
  line-height: 1.7; margin-bottom: 40px;
}
.hero-ctas { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 48px; }
.btn-main {
  font-family: 'Rubik', sans-serif;
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 14px 32px;
  background: var(--red); color: #fff;
  border: none; border-radius: 100px;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 24px rgba(224,52,42,0.35);
}
.btn-ghost {
  font-family: 'Rubik', sans-serif;
  font-size: 13px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 14px 28px;
  background: transparent; color: var(--white);
  border: 1.5px solid var(--border2); border-radius: 100px;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
}
.ca-pill {
  display: inline-flex; align-items: center; gap: 12px;
  background: var(--w06); border: 1px solid var(--border2);
  border-radius: 14px; padding: 13px 20px;
  cursor: pointer; max-width: 100%;
}
.ca-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red2); flex-shrink: 0; }
.ca-addr { font-family: 'Rubik Mono One', monospace; font-size: 10px; color: var(--w60); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; max-width: 300px; }
.ca-action { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--white); flex-shrink: 0; }

/* ── TICKER ── */
.ticker-wrap { overflow: hidden; background: var(--red); padding: 11px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
.ticker-track { display: flex; white-space: nowrap; }
.ticker-item { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 0.1em; color: rgba(255,255,255,0.75); padding: 0 22px; flex-shrink: 0; display: flex; align-items: center; gap: 16px; }
.ticker-item.on { color: #fff; }
.ticker-sep { width: 5px; height: 5px; background: rgba(255,255,255,0.4); border-radius: 50%; flex-shrink: 0; }

/* ── SECTION LABEL ── */
.section-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--red2); margin-bottom: 48px;
  display: flex; align-items: center; gap: 14px;
}
.section-label::after { content:''; flex:1; height:1px; background:var(--border2); }

/* ── ORACLE ── */
.oracle-wrap { padding: 80px 32px; display: flex; flex-direction: column; align-items: center; }
.oracle-card {
  width: 100%; max-width: 700px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 28px; padding: 56px 52px;
  position: relative; overflow: hidden;
  cursor: default;
}
.oracle-glass {
  position: absolute; inset: 0; border-radius: 28px;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.015) 100%);
  pointer-events: none;
}
.oracle-icon { font-size: 40px; display: block; margin-bottom: 28px; }
.oracle-quote {
  font-size: clamp(17px, 2.5vw, 23px);
  font-style: italic; font-weight: 400;
  line-height: 1.75; color: var(--white);
  margin-bottom: 36px; min-height: 88px;
  display: flex; align-items: center; justify-content: center;
}
.oracle-source { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--red2); margin-bottom: 28px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.oracle-source::before, .oracle-source::after { content:''; width:20px; height:1px; background:var(--red2); opacity:.45; }
.oracle-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.oracle-btn {
  font-family: 'Rubik', sans-serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 10px 22px; border-radius: 100px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
}
.oracle-btn.next { background: var(--white); color: var(--bg); border: none; }
body.light .oracle-btn.next { background: var(--surface3); color: var(--white); }
.oracle-btn.tweet { background: transparent; color: var(--w60); border: 1px solid var(--border2); }
.oracle-dots span { display:inline-block; width:4px; height:4px; background:var(--red); border-radius:50%; margin:0 2px; animation: dotB 1.2s ease-in-out infinite; }
.oracle-dots span:nth-child(2){animation-delay:.2s}.oracle-dots span:nth-child(3){animation-delay:.4s}
@keyframes dotB{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}

/* ── STATS ── */
.stats-wrap { padding: 0 32px 80px; max-width: 1080px; margin: 0 auto; }
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; background: var(--border); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
@media(max-width:660px){ .stats-grid { grid-template-columns: 1fr; } }
.stat-card { background: var(--surface); padding: 34px 28px; position: relative; overflow: hidden; }
.stat-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--red),transparent); opacity:0; transition:opacity .3s; }
.stat-card:hover { background: var(--surface2); }
.stat-card:hover::after { opacity:1; }
.stat-lbl { font-size:9px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--w30); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.stat-live { width:5px; height:5px; background:var(--red); border-radius:50%; animation:livePulse 2s ease-in-out infinite; }
@keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(224,52,42,.5)}50%{opacity:.5;box-shadow:0 0 0 5px rgba(224,52,42,0)}}
.stat-val { font-family:'Bebas Neue',sans-serif; font-size:clamp(34px,5vw,54px); line-height:1; letter-spacing:.02em; color:var(--white); margin-bottom:6px; transition:color .4s; }
.stat-val.flash { color: var(--red2); }
.stat-sub { font-size:12px; font-style:italic; color:var(--w30); }

/* ── WHY ── */
.why-wrap { padding: 80px 32px; max-width: 1080px; margin: 0 auto; }
.why-intro { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,5.5vw,64px); line-height:1.05; letter-spacing:.03em; color:var(--white); margin-bottom:52px; max-width:700px; }
.why-intro .acc { color:var(--red); }
.why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:var(--border); border:1px solid var(--border); border-radius:20px; overflow:hidden; margin-bottom:48px; }
@media(max-width:660px){ .why-grid { grid-template-columns:1fr; } }
.wcard { background:var(--surface); padding:34px 28px; position:relative; overflow:hidden; cursor:default; }
.wcard::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--red); transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
.wcard:hover { background:var(--surface2); }
.wcard:hover::before { transform:scaleX(1); }
.wcard-n { font-family:'Bebas Neue',sans-serif; font-size:44px; line-height:1; color:var(--w06); margin-bottom:16px; }
body.light .wcard-n { color:var(--w10); }
.wcard-h { font-size:16px; font-weight:700; color:var(--white); margin-bottom:10px; line-height:1.35; }
.wcard-p { font-size:13px; line-height:1.8; color:var(--w60); }
.manifesto { background:var(--surface); border:1px solid var(--border2); border-radius:20px; padding:52px 56px; position:relative; overflow:hidden; }
.manifesto::before { content:'🪞'; position:absolute; right:32px; top:24px; font-size:96px; opacity:.04; pointer-events:none; }
.manifesto p { font-size:clamp(15px,2vw,19px); line-height:1.9; color:var(--w60); margin-bottom:14px; font-style:italic; }
.manifesto p:last-child { font-weight:700; font-style:normal; color:var(--white); font-size:clamp(17px,2.2vw,23px); margin-bottom:0; }
@media(max-width:560px){ .manifesto { padding:30px 22px; } }

/* ── PFP ── */
.pfp-wrap { background:var(--surface); border-top:1px solid var(--border); padding:96px 32px 100px; }
.pfp-inner { max-width:960px; margin:0 auto; }
.pfp-headline { font-family:'Bebas Neue',sans-serif; font-size:clamp(50px,9vw,100px); letter-spacing:.04em; line-height:1; color:var(--white); margin-bottom:10px; }
.pfp-headline .acc { color:var(--red); }
.pfp-desc { font-size:15px; font-style:italic; color:var(--w60); margin-bottom:52px; max-width:500px; line-height:1.65; }
.forge-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start; }
@media(max-width:600px){ .forge-grid { grid-template-columns:1fr; } }
.forge-col { display:flex; flex-direction:column; gap:12px; }
.col-tag { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--w30); display:flex; align-items:center; gap:8px; }
.col-num { width:22px; height:22px; border-radius:50%; background:var(--red); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.drop-zone { aspect-ratio:1; border:1.5px dashed var(--border2); border-radius:18px; background:var(--w03); display:flex; align-items:center; justify-content:center; cursor:pointer; overflow:hidden; transition:border-color .2s,background .2s; }
.drop-zone:hover { border-color:var(--w30); background:var(--w06); }
.drop-zone.has-img { border-style:solid; border-color:var(--border2); }
.drop-zone img { width:100%; height:100%; object-fit:cover; display:block; border-radius:16px; }
.drop-ph { text-align:center; padding:24px; pointer-events:none; }
.drop-ic { font-size:36px; margin-bottom:12px; display:block; opacity:.38; }
.drop-lbl { font-size:14px; font-weight:500; color:var(--w30); margin-bottom:4px; }
.drop-hint { font-family:'Rubik Mono One',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--w30); opacity:.6; }
.result-zone { aspect-ratio:1; border:1.5px solid var(--border); border-radius:18px; background:var(--w03); display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; transition:border-color .4s,box-shadow .4s; }
.result-zone::before { content:''; position:absolute; top:0; left:0; right:0; height:45%; background:linear-gradient(180deg,rgba(255,255,255,0.035),transparent); pointer-events:none; z-index:2; border-radius:16px 16px 0 0; }
.result-zone.done { border-color:rgba(224,52,42,.35); box-shadow:0 0 48px rgba(224,52,42,.1); }
.result-zone img { width:100%; height:100%; object-fit:cover; display:block; border-radius:16px; }
.result-ph { text-align:center; padding:24px; }
.result-big { font-family:'Bebas Neue',sans-serif; font-size:78px; line-height:1; letter-spacing:.04em; color:var(--white); opacity:.05; margin-bottom:10px; }
.result-hint { font-family:'Rubik Mono One',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--w30); }
.forging-ph { text-align:center; padding:24px; }
.spin-ring { width:46px; height:46px; border:2px solid var(--border2); border-top-color:var(--red); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 18px; }
@keyframes spin{to{transform:rotate(360deg)}}
.forge-stat { font-size:15px; font-style:italic; color:var(--w60); margin-bottom:6px; }
.forge-pct { font-family:'Rubik Mono One',monospace; font-size:11px; color:var(--w30); letter-spacing:.08em; }
.prog { height:2px; background:var(--border2); border-radius:2px; overflow:hidden; }
.prog-fill { height:100%; background:var(--red); border-radius:2px; transition:width .7s ease; }
.forge-actions { margin-top:28px; display:flex; flex-direction:column; gap:10px; }
.forge-main-btn { width:100%; padding:18px 28px; background:var(--red); color:#fff; border:none; border-radius:14px; font-family:'Rubik',sans-serif; font-size:15px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:0 4px 20px rgba(224,52,42,.28); }
.forge-main-btn:disabled { opacity:.3; cursor:not-allowed; }
.dl-btn { width:100%; padding:14px 24px; background:transparent; color:var(--white); border:1.5px solid var(--border2); border-radius:14px; font-family:'Rubik',sans-serif; font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all .18s; }
.dl-btn:hover { background:var(--w06); border-color:var(--w30); }
.share-note { text-align:center; font-size:13px; font-style:italic; color:var(--w30); margin-top:4px; }
.err-pill { padding:12px 16px; background:rgba(224,52,42,.1); border:1px solid rgba(224,52,42,.3); border-radius:10px; font-size:11px; color:rgba(224,52,42,.85); font-family:'Rubik Mono One',monospace; display:flex; align-items:flex-start; gap:10px; }
.err-pill button { background:none; border:none; color:rgba(224,52,42,.6); cursor:pointer; flex-shrink:0; font-size:15px; line-height:1; }
.ai-note { text-align:center; font-family:'Rubik Mono One',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--w30); margin-top:6px; }

/* ── FOOTER ── */
footer { background:var(--bg); border-top:1px solid var(--border); padding:44px 40px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; }
.foot-logo { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.06em; color:var(--white); }
.foot-logo span { color:var(--red); }
.foot-links { display:flex; gap:8px; flex-wrap:wrap; }
.foot-a { font-family:'Rubik',sans-serif; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--w60); text-decoration:none; padding:7px 15px; border:1px solid var(--border); border-radius:100px; transition:all .18s; cursor:pointer; background:none; }
.foot-a:hover { color:var(--white); border-color:var(--border2); background:var(--w06); }
.foot-tag { font-size:13px; font-style:italic; color:var(--w30); }

@media(max-width:580px){
  .hero { padding:110px 18px 64px; }
  .oracle-wrap { padding:60px 18px; }
  .oracle-card { padding:36px 24px; }
  .stats-wrap, .why-wrap { padding:60px 18px; }
  .pfp-wrap { padding:64px 18px 80px; }
  footer { padding:36px 18px; }
}
`;

// ─── CURSOR COMPONENT ─────────────────────────────────────────────────────────
function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 900, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 900, damping: 50 });
  const ringX = useSpring(mouseX, { stiffness: 140, damping: 22 });
  const ringY = useSpring(mouseY, { stiffness: 140, damping: 22 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const over = (e) => { if (e.target.closest('button,a,[role=button],.ca-pill')) setIsHovering(true); };
    const out = () => setIsHovering(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out); };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div className="cursor-dot"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 2 : 1 }}
        transition={SPRING_BOUNCY}
      />
      <motion.div className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 1.8 : 1, opacity: isHovering ? 0.6 : 0.3 }}
        transition={SPRING_SOFT}
      />
    </>
  );
}

// ─── ORACLE COMPONENT ────────────────────────────────────────────────────────
function Oracle() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const ORACLE_SYSTEM = `You are the Mirror Oracle for $ME — a Solana memecoin built on radical self-accountability.

Generate ONE short powerful quote that inspires self-reflection and personal growth. The quote should:
- 1-3 sentences max
- Feel empowering and forward-looking — like a moment of clarity, not a criticism
- Be about the potential inside the person reading it
- Celebrate the courage it takes to look at yourself honestly
- Sound like something you'd want to screenshot and save
- Never shame, judge, or lecture — only uplift and motivate
- Could be about crypto OR life — both work

Examples of the right tone:
"The version of you that finally decided to change — that's the most powerful one."
"Looking in the mirror honestly is braver than any trade you'll ever make."
"The best investment you'll ever make is in the person holding the phone."

Output ONLY the quote. No quotation marks. No explanation.`;`;

  const getNext = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 180));
    try {
      if (OR_KEY) {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${OR_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'google/gemini-2.5-flash-lite-preview-09-2025', messages: [{ role: 'system', content: ORACLE_SYSTEM }, { role: 'user', content: 'New mirror quote.' }], max_tokens: 80, temperature: 1.1 })
        });
        const d = await res.json();
        const q = (d.choices?.[0]?.message?.content || '').replace(/^["']|["']$/g, '').trim();
        if (q) { setQuote(q); setLoading(false); return; }
      }
    } catch {}
    const next = (idx + 1) % FALLBACK_QUOTES.length;
    setIdx(next); setQuote(FALLBACK_QUOTES[next]);
    setLoading(false);
  };

  const tweet = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote}"\n\n$ME — it starts with me.`)}`, '_blank');

  return (
    <section className="oracle-wrap" ref={ref}>
      <motion.div className="section-label" style={{ maxWidth: 700, width: '100%', alignSelf: 'flex-start' }}
        initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        variants={slideLeft} transition={{ ...SPRING_SNAPPY, delay: 0.1 }}>
        The Mirror Oracle
        <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
      </motion.div>

      <motion.div className="oracle-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ ...SPRING_SOFT, delay: 0.2 }}
        whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
      >
        <div className="oracle-glass" />

        <motion.span className="oracle-icon"
          animate={{ y: [0, -7, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          🪞
        </motion.span>

        <AnimatePresence mode="wait">
          <motion.div key={quote} className="oracle-quote"
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ ...SPRING_SNAPPY }}>
            {loading
              ? <span style={{ color: 'var(--w30)', fontStyle: 'italic', display:'flex', alignItems:'center', gap:8 }}>
                  Asking the mirror
                  <span className="oracle-dots"><span /><span /><span /></span>
                </span>
              : `"${quote}"`
            }
          </motion.div>
        </AnimatePresence>

        <div className="oracle-source">$ME Oracle</div>

        <div className="oracle-btns">
          <motion.button className="oracle-btn next" onClick={getNext} disabled={loading}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} transition={SPRING_BOUNCY}>
            {loading ? '...' : '↺ Next'}
          </motion.button>
          <motion.button className="oracle-btn tweet" onClick={tweet}
            whileHover={{ scale: 1.04, borderColor: 'var(--border2)' }}
            whileTap={{ scale: 0.96 }} transition={SPRING_BOUNCY}>
            Post on X →
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── STATS COMPONENT ─────────────────────────────────────────────────────────
function Stats() {
  const [holders, setHolders] = useState(null);
  const [price, setPrice] = useState(null);
  const [mcap, setMcap] = useState(null);
  const [flash, setFlash] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const fmt = (n) => { if (!n) return '—'; if (n >= 1e6) return (n/1e6).toFixed(2)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
  const fmtP = (p) => { if (!p) return '—'; const n = parseFloat(p); if (n < 0.000001) return '$'+n.toFixed(10); if (n < 0.001) return '$'+n.toFixed(8); return '$'+n.toFixed(6); };

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`);
      const d = await r.json();
      if (d.pairs?.[0]) { const p = d.pairs[0]; setPrice(p.priceUsd||null); setMcap(p.fdv||p.marketCap||null); }
    } catch {}
    try {
      const r = await fetch(`https://data.solanatracker.io/tokens/${CA}`, { headers: { 'x-api-key': '7e03dd01-b931-4fac-8e9f-06a310c1238a' } });
      if (r.ok) { const d = await r.json(); setHolders(d.holders||d.holderCount||null); }
    } catch {}
    setFlash(true); setTimeout(() => setFlash(false), 800);
  }, []);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, [fetchData]);

  const cards = [
    { label: 'Believers', value: fmt(holders), sub: 'Holders on-chain', live: true },
    { label: 'Price', value: fmtP(price), sub: 'Current $ME price', live: true },
    { label: 'Market Cap', value: fmt(mcap), sub: 'Fully diluted value', live: false },
  ];

  return (
    <section className="stats-wrap" ref={ref}>
      <motion.div className="stats-grid"
        variants={stagger(0.1)}
        initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        {cards.map((c, i) => (
          <motion.div key={i} className="stat-card"
            variants={fadeUp}
            transition={{ ...SPRING_SOFT, delay: i * 0.1 }}
            whileHover={{ y: -3, transition: SPRING_BOUNCY }}>
            <div className="stat-lbl">{c.live && <span className="stat-live" />}{c.label}</div>
            <motion.div className={`stat-val ${flash ? 'flash' : ''}`}
              key={c.value}
              initial={{ scale: 1.08, color: 'var(--red2)' }}
              animate={{ scale: 1, color: 'var(--white)' }}
              transition={SPRING_SNAPPY}>
              {c.value}
            </motion.div>
            <div className="stat-sub">{c.sub}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── TICKER COMPONENT ─────────────────────────────────────────────────────────
function Ticker() {
  const TI = ['$ME','It Starts With Me','I Am The Mirror','Change Starts Here','$ME','Be The Change','Stop Waiting','I Am The Solution','$ME','The Trenches Need You','Me vs Me'];
  const doubled = [...TI, ...TI];
  return (
    <div className="ticker-wrap">
      <motion.div className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, ease: 'linear', repeat: Infinity }}>
        {doubled.map((t, i) => (
          <div key={i} className={`ticker-item ${t === '$ME' ? 'on' : ''}`}>
            {t}<span className="ticker-sep" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── WHY COMPONENT ────────────────────────────────────────────────────────────
function Why() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const CARDS = [
    { n:'01', h:'We are the problem', p:'We snipe each other, dump on each other, follow the same callers into the same traps every cycle. Nobody waits for themselves to be the solution.' },
    { n:'02', h:'We keep looking outside', p:'New platform, new meta, new narrative — always waiting for something external to change the outcome. The answer was never out there.' },
    { n:'03', h:'Until now', p:'$ME is for the person who finally looked in the mirror. Who stopped pointing. Who decided the only thing they can control is themselves.' },
  ];
  return (
    <section className="why-wrap" ref={ref}>
      <motion.div className="section-label"
        initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        variants={slideLeft} transition={{ ...SPRING_SNAPPY, delay: 0.05 }}>
        Why $ME exists
        <div style={{ flex:1, height:1, background:'var(--border2)' }} />
      </motion.div>

      <motion.p className="why-intro"
        initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp} transition={{ ...SPRING_SOFT, delay: 0.15 }}>
        The trenches isn't dying because of bundlers.<br />
        It's dying because of <span className="acc">us.</span>
      </motion.p>

      <motion.div className="why-grid"
        variants={stagger(0.1)}
        initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        {CARDS.map((c, i) => (
          <motion.div key={c.n} className="wcard"
            variants={fadeUp}
            transition={{ ...SPRING_SOFT, delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -3, transition: SPRING_BOUNCY }}>
            <div className="wcard-n">{c.n}</div>
            <div className="wcard-h">{c.h}</div>
            <div className="wcard-p">{c.p}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="manifesto"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...SPRING_SOFT, delay: 0.5 }}
        whileHover={{ y: -4, boxShadow: '0 24px 60px rgba(0,0,0,0.3)', transition: SPRING_BOUNCY }}>
        <p>Nobody is coming to fix this. Not the platform. Not the devs. Not the next narrative. Not the bull run.</p>
        <p>The only person who changes how this goes is the person holding the phone right now.</p>
        <p>I am the floor. I am the culture. I am the solution. It starts with me. 🪞</p>
      </motion.div>
    </section>
  );
}

// ─── PFP COMPONENT ────────────────────────────────────────────────────────────
function PFP() {
  const [uploaded, setUploaded] = useState(null);
  const [b64, setB64] = useState(null);
  const [result, setResult] = useState(null);
  const [forging, setForging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const fileRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const STATUSES = ['Studying your character…','Rebuilding the scene…','Placing both versions…','Elevating the reflection…','Finalizing the mirror…'];

  useEffect(() => {
    if (!forging) return;
    let i = 0; setStatusMsg(STATUSES[0]);
    const t = setInterval(() => { i=(i+1)%STATUSES.length; setStatusMsg(STATUSES[i]); }, 2600);
    return () => clearInterval(t);
  }, [forging]);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onloadend = () => { setUploaded(r.result); setB64(r.result.split(',')[1]); setResult(null); setErr(null); };
    r.readAsDataURL(f);
  };

  const forge = async () => {
    if (!b64 || forging) return;
    if (!GEMINI_KEY) { setErr('Add VITE_APP_GEMINI to your .env file.'); return; }
    setForging(true); setResult(null); setProgress(0); setErr(null);
    const timer = setInterval(() => setProgress(p => Math.min(p + Math.random()*4.5, 88)), 1000);
    try {
      const tRes = await fetch('/template.jpg');
      if (!tRes.ok) throw new Error('template.jpg not found — add your $ME mascot to /public/template.jpg');
      const tBlob = await tRes.blob();
      const tB64 = await new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result.split(',')[1]); r.readAsDataURL(tBlob); });
      const prompt = `You are not editing the template character. You are rebuilding the entire scene using the user’s character.

Image 1 is only a pose and composition reference. Ignore the identity, body, head, and hands of the template character completely. Do not reuse or modify the original character in any way.

Take the character from Image 2 and place them into the exact same position, pose, and perspective as the character in Image 1. The user’s character must fully replace the template character, including head shape, body type, proportions, and hands, so it looks like they are naturally the one holding the mirror.

Inside the mirror, show the same character, as a more confident, powerful, elevated version of themselves. Same face, same identity — just enhanced presence.

The entire final image should match the art style of the user’s image. Adapt the full scene (character, background, lighting) so everything looks consistent in that style.

The final result should look like the user’s character is standing there, holding a mirror, and seeing the best version of themselves. No trace of the original template character should remain.

Before finalizing, confirm that:
- The template character has been completely replaced
- The pose and composition match the original template
- The same character appears both outside and inside the mirror
- The reflection clearly looks like an improved version of the same character
- The art style matches the user’s image across the entire scene
- 

If any of these are not true, correct the image before completing the task.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{parts:[{text:prompt},{inlineData:{mimeType:'image/jpeg',data:tB64}},{inlineData:{mimeType:'image/jpeg',data:b64}}]}], generationConfig:{responseModalities:['TEXT','IMAGE']} })
      });
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d?.error?.message||`API error ${res.status}`); }
      const data = await res.json();
      const imgData = data.candidates?.[0]?.content?.parts?.find(p=>p.inlineData)?.inlineData?.data;
      if (!imgData) throw new Error('No image returned — try a clearer photo.');
      setTimeout(() => { setResult(`data:image/png;base64,${imgData}`); setProgress(100); setForging(false); }, 400);
    } catch(e) { setErr(e.message||'Something went wrong.'); setForging(false); }
    finally { clearInterval(timer); }
  };

  return (
    <section className="pfp-wrap" id="pfpcult" ref={ref}>
      <div className="pfp-inner">
        <motion.div className="section-label"
          initial="hidden" animate={isInView?'visible':'hidden'}
          variants={slideLeft} transition={{...SPRING_SNAPPY,delay:0.05}}>
          PFP Cult — AI transformation
          <div style={{flex:1,height:1,background:'var(--border2)'}}/>
        </motion.div>

        <motion.h2 className="pfp-headline"
          initial="hidden" animate={isInView?'visible':'hidden'}
          variants={fadeUp} transition={{...SPRING_SOFT,delay:0.15}}>
          Upload your character.<br/>Become <span className="acc">$ME</span>.
        </motion.h2>
        <motion.p className="pfp-desc"
          initial="hidden" animate={isInView?'visible':'hidden'}
          variants={fadeUp} transition={{...SPRING_SOFT,delay:0.25}}>
          Our AI puts you into the $ME mirror scene — both as the one holding the mirror, and the reflection staring back.
        </motion.p>

        <motion.div className="forge-grid"
          initial="hidden" animate={isInView?'visible':'hidden'}
          variants={stagger(0.1)}>
          {/* Upload */}
          <motion.div className="forge-col" variants={slideLeft} transition={SPRING_SOFT}>
            <div className="col-tag"><span className="col-num">1</span>Your character / photo</div>
            <motion.div
              className={`drop-zone ${uploaded?'has-img':''}`}
              onClick={() => fileRef.current?.click()}
              onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files?.[0])}}
              onDragOver={e=>e.preventDefault()}
              whileHover={{ scale: 1.01, borderColor: 'rgba(243,237,228,0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_BOUNCY}>
              {uploaded
                ? <img src={uploaded} alt="Your character"/>
                : <div className="drop-ph">
                    <span className="drop-ic">🤳</span>
                    <div className="drop-lbl">Drop your photo here</div>
                    <div className="drop-hint">or click to browse</div>
                  </div>}
            </motion.div>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>handleFile(e.target.files?.[0])} style={{display:'none'}}/>
            {uploaded && (
              <motion.button
                onClick={()=>fileRef.current?.click()}
                style={{background:'none',border:'none',color:'var(--w30)',fontFamily:'Rubik',fontSize:12,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',padding:'4px 0'}}
                whileHover={{color:'var(--white)'}} transition={{duration:0.15}}>
                Change photo
              </motion.button>
            )}
          </motion.div>

          {/* Result */}
          <motion.div className="forge-col" variants={slideRight} transition={SPRING_SOFT}>
            <div className="col-tag"><span className="col-num">2</span>Your $ME PFP</div>
            <motion.div className={`result-zone ${result?'done':''}`}
              animate={result ? { boxShadow: '0 0 60px rgba(224,52,42,0.15)' } : {}}
              transition={SPRING_GENTLE}>
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.img key="result" src={result} alt="Your $ME PFP"
                    initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                    exit={{opacity:0}} transition={SPRING_BOUNCY}/>
                ) : forging ? (
                  <motion.div key="forging" className="forging-ph"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <div className="spin-ring"/>
                    <AnimatePresence mode="wait">
                      <motion.div key={statusMsg} className="forge-stat"
                        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                        exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                        {statusMsg}
                      </motion.div>
                    </AnimatePresence>
                    <div className="forge-pct">{Math.round(progress)}%</div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="result-ph"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <div className="result-big">$ME</div>
                    <div className="result-hint">Your transformation awaits</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {forging && <div className="prog"><div className="prog-fill" style={{width:`${progress}%`}}/></div>}
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div className="forge-actions"
          initial="hidden" animate={isInView?'visible':'hidden'}
          variants={fadeUp} transition={{...SPRING_SOFT,delay:0.5}}>
          <AnimatePresence>{err && (
            <motion.div className="err-pill"
              initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
              exit={{opacity:0,height:0}}>
              <span>{err}</span><button onClick={()=>setErr(null)}>✕</button>
            </motion.div>
          )}</AnimatePresence>

          <motion.button className="forge-main-btn" onClick={forge} disabled={!b64||forging}
            whileHover={!b64||forging?{}:{scale:1.02,y:-2,boxShadow:'0 12px 36px rgba(224,52,42,0.4)'}}
            whileTap={!b64||forging?{}:{scale:0.99}}
            transition={SPRING_BOUNCY}>
            {forging
              ? <><div style={{width:18,height:18,border:'2px solid rgba(255,255,255,.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite',flexShrink:0}}/>Forging your $ME…</>
              : result ? 'Forge Again 🪞' : 'Forge My $ME PFP 🪞'}
          </motion.button>

          <AnimatePresence>{result && (
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} transition={SPRING_SOFT}>
              <motion.button className="dl-btn"
                onClick={()=>{const a=document.createElement('a');a.href=result;a.download=`ME_PFP_${Date.now()}.png`;a.click()}}
                whileHover={{scale:1.01,borderColor:'var(--w30)'}} whileTap={{scale:0.99}} transition={SPRING_BOUNCY}>
                ↓ Download PFP
              </motion.button>
              <div className="share-note">Set it as your PFP and tag us on X 🔥</div>
            </motion.div>
          )}</AnimatePresence>

          <div className="ai-note">Powered by Gemini AI · Images are never stored</div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [priceBar, setPriceBar] = useState('—');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => { document.body.className = darkMode ? '' : 'light'; }, [darkMode]);

  useEffect(() => {
    const fetch_price = async () => {
      try {
        const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`);
        const d = await r.json();
        if (d.pairs?.[0]) {
          const p = parseFloat(d.pairs[0].priceUsd);
          const fmt = p < 0.000001 ? p.toFixed(10) : p < 0.001 ? p.toFixed(8) : p.toFixed(6);
          setPriceBar('$' + fmt);
        }
      } catch {}
    };
    fetch_price(); const t = setInterval(fetch_price, 30000); return () => clearInterval(t);
  }, []);

  const copyCA = () => {
    try { navigator.clipboard.writeText(CA); } catch { const el = document.createElement('textarea'); el.value = CA; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const TI = ['$ME','It Starts With Me','I Am The Mirror','Change Starts Here','$ME','Be The Change','Stop Waiting','I Am The Solution','$ME','The Trenches Need You','Me vs Me'];
  const TI2 = [...TI, ...TI];

  return (
    <MotionConfig reducedMotion="user">
      <style>{css}</style>
      <Cursor />

      {/* Progress bar */}
      <motion.div style={{ scaleX, transformOrigin: '0%', position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'var(--red)', zIndex: 9999 }} />

      {/* Site background */}
      <div className="site-bg">
        <div className="site-bg-img" />
        <div className="site-bg-glow" />
        <div className="site-bg-noise" />
        <motion.div className="orb orb1"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="orb orb2"
          animate={{ x: [0, -25, 15, 0], y: [0, 30, -20, 0], scale: [1, 0.95, 1.04, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
        <motion.div className="orb orb3"
          animate={{ x: [0, 20, -30, 0], y: [0, -25, 35, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 10 }} />
      </div>

      {/* NAV */}
      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING_SOFT, delay: 0.1 }}>
        <a className="nav-logo" href="#"><span className="nav-logo-red">$</span>ME</a>
        <div className="nav-links">
          <motion.a className="nav-link nav-hide" href={TWITTER} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>Twitter</motion.a>
          <motion.a className="nav-link nav-hide" href={COMMUNITY} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>Community</motion.a>
          <motion.button className="nav-link icon" onClick={() => setDarkMode(d => !d)}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9, rotate: 20 }} transition={SPRING_BOUNCY}>
            <AnimatePresence mode="wait">
              <motion.span key={darkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {darkMode ? '☀️' : '🌙'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.a className="nav-link cta" href="#pfpcult"
            whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(224,52,42,0.4)' }}
            whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>
            Make PFP 🪞
          </motion.a>
        </div>
      </motion.nav>

      {/* STICKY BAR */}
      <motion.div className="sticky-bar" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING_SOFT, delay: 0.25 }}>
        <motion.span className="bar-dot" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <span className="bar-text">$ME</span>
        <span className="bar-price">{priceBar}</span>
        <span className="bar-text">·</span>
        <span className="bar-text">It starts with me</span>
      </motion.div>

      {/* HERO */}
      <section className="hero">
        <motion.div className="hero-eyebrow"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING_BOUNCY, delay: 0.3 }}>
          <motion.span className="eye-dot" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          Solana · Radical Self-Accountability
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ perspective: 900 }}
          whileHover={{ rotateX: 1, rotateY: 2 }}
        >
          <motion.span className="hero-title"
            initial={{ opacity: 0, y: -50, scale: 1.08 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING_SOFT, delay: 0.45 }}>
            Change starts<br />with <motion.span className="red"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_BOUNCY, delay: 0.7 }}>
              $ME
            </motion.span>
          </motion.span>
          <motion.span className="hero-reflection" aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 0.07 }}
            transition={{ delay: 1, duration: 1 }}>
            Change starts with $ME
          </motion.span>
        </motion.div>

        <motion.p className="hero-sub"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 0.65 }}>
          The trenches doesn't need saving from outside.<br />
          It needs you to look in the mirror.
        </motion.p>

        <motion.div className="hero-ctas"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 0.78 }}>
          <motion.a className="btn-main" href="#pfpcult"
            whileHover={{ scale: 1.06, boxShadow: '0 12px 36px rgba(224,52,42,0.5)' }}
            whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>
            Make your $ME PFP 🪞
          </motion.a>
          <motion.a className="btn-ghost" href={COMMUNITY} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04, borderColor: 'var(--border2)', background: 'var(--w06)' }}
            whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>
            Join the community
          </motion.a>
        </motion.div>

        <motion.div className="ca-pill" onClick={copyCA}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 0.9 }}
          whileHover={{ scale: 1.02, borderColor: 'var(--border2)', background: 'var(--w10)' }}
          whileTap={{ scale: 0.98 }} style={{ cursor: 'pointer' }}>
          <span className="ca-tag">CA</span>
          <span className="ca-addr">{CA}</span>
          <AnimatePresence mode="wait">
            <motion.span key={copied ? 'copied' : 'copy'} className="ca-action"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* ORACLE */}
      <Oracle />

      {/* STATS */}
      <Stats />

      {/* WHY */}
      <Why />

      {/* PFP */}
      <PFP />

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="foot-logo">$<span>ME</span></div>
        <div className="foot-links">
          <motion.a className="foot-a" href={TWITTER} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>Twitter</motion.a>
          <motion.a className="foot-a" href={COMMUNITY} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>Community</motion.a>
          <motion.button className="foot-a" onClick={copyCA}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING_BOUNCY}>
            {copied ? '✓ Copied' : 'Copy CA'}
          </motion.button>
        </div>
        <div className="foot-tag">It starts with me. 🪞</div>
      </motion.footer>
    </MotionConfig>
  );
}
