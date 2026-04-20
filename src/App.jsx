import { useState, useRef, useEffect } from 'react';

// ─── UPDATE THESE ─────────────────────────────────────────────────────────────
const CA = "PASTE_YOUR_CA_HERE";
const TWITTER = "https://x.com/your_me_handle";
const COMMUNITY = "https://x.com/i/communities/your_community_id";
const GEMINI_KEY = import.meta.env?.VITE_APP_GEMINI || '';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f7f3ed;
  --ink: #111010;
  --red: #d63a2f;
  --warm: #e8e0d4;
  --warmer: #ddd4c4;
  --text: #1a1814;
  --muted: #7a7068;
  --border: rgba(17,16,16,0.12);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Syne', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--ink); color: var(--bg); }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--ink); }

/* ── CURSOR DOT ── */
.cursor {
  position: fixed;
  width: 10px; height: 10px;
  background: var(--red);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s;
  mix-blend-mode: multiply;
}
.cursor-ring {
  position: fixed;
  width: 36px; height: 36px;
  border: 1.5px solid var(--ink);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.18s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s;
  opacity: 0.35;
}

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(247,243,237,0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
}
.nav-logo span { color: var(--red); }
.nav-links { display: flex; align-items: center; gap: 6px; }
.nav-link {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 100px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  font-family: 'Syne', sans-serif;
}
.nav-link:hover { color: var(--ink); background: var(--warm); }
.nav-link.cta {
  background: var(--ink);
  color: var(--bg);
  padding: 9px 20px;
}
.nav-link.cta:hover { background: #2a2824; }
@media(max-width: 600px) {
  nav { padding: 0 20px; }
  .nav-hide { display: none; }
}

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 48px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none; opacity: 0.6;
}

/* floating soft orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  animation: orbFloat 12s ease-in-out infinite;
}
.orb1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(214,58,47,0.12), transparent 70%); top: -100px; right: -100px; animation-delay: 0s; }
.orb2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(17,16,16,0.07), transparent 70%); bottom: 0; left: -80px; animation-delay: -5s; }
.orb3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(214,58,47,0.08), transparent 70%); top: 40%; left: 10%; animation-delay: -2s; }
@keyframes orbFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(20px,-30px) scale(1.05); }
  66% { transform: translate(-15px,20px) scale(0.95); }
}

.hero-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 28px;
  opacity: 0;
  animation: riseIn 0.8s 0.1s ease-out forwards;
  display: flex; align-items: center; gap: 12px;
}
.hero-eyebrow::before, .hero-eyebrow::after {
  content: '';
  display: block;
  width: 32px; height: 1px;
  background: var(--red);
  opacity: 0.5;
}

.hero-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(80px, 16vw, 200px);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: 32px;
  opacity: 0;
  animation: riseIn 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
  position: relative; z-index: 2;
}
.hero-title .em {
  font-style: italic;
  color: var(--red);
  position: relative;
  display: inline-block;
}
.hero-title .em::after {
  content: '';
  position: absolute;
  bottom: 4px; left: 0; right: 0;
  height: 3px;
  background: var(--red);
  opacity: 0.3;
  border-radius: 2px;
}

.hero-sub {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(18px, 3vw, 28px);
  color: var(--muted);
  max-width: 500px;
  line-height: 1.65;
  margin-bottom: 44px;
  opacity: 0;
  animation: riseIn 0.8s 0.35s ease-out forwards;
}

.hero-actions {
  display: flex; flex-wrap: wrap; gap: 12px;
  justify-content: center;
  margin-bottom: 52px;
  opacity: 0;
  animation: riseIn 0.8s 0.5s ease-out forwards;
}

.btn-primary {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 32px;
  background: var(--ink);
  color: var(--bg);
  border: none;
  border-radius: 100px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'Syne', sans-serif;
}
.btn-primary:hover {
  background: #2a2824;
  transform: scale(1.03) translateY(-1px);
  box-shadow: 0 12px 32px rgba(17,16,16,0.25);
}

.btn-ghost {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 28px;
  background: transparent;
  color: var(--ink);
  border: 1.5px solid rgba(17,16,16,0.2);
  border-radius: 100px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.2s;
  font-family: 'Syne', sans-serif;
}
.btn-ghost:hover { border-color: var(--ink); background: var(--warm); }

/* CA pill */
.ca-pill {
  display: inline-flex; align-items: center; gap: 14px;
  background: var(--warm);
  border: 1.5px solid var(--border);
  border-radius: 100px;
  padding: 12px 20px;
  cursor: pointer;
  max-width: 100%;
  transition: all 0.2s;
  opacity: 0;
  animation: riseIn 0.8s 0.65s ease-out forwards;
}
.ca-pill:hover { background: var(--warmer); border-color: rgba(17,16,16,0.22); }
.ca-tag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red);
  flex-shrink: 0;
}
.ca-addr {
  font-family: 'Syne Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  max-width: 340px;
}
.ca-act {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  flex-shrink: 0;
  transition: color 0.15s;
}
.ca-pill:hover .ca-act { color: var(--red); }

/* ── MARQUEE ── */
.ticker {
  overflow: hidden;
  background: var(--ink);
  padding: 14px 0;
  position: relative;
}
.ticker-inner {
  display: flex;
  gap: 0;
  animation: ticker 24s linear infinite;
  white-space: nowrap;
}
.ticker-item {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 17px;
  letter-spacing: 0.02em;
  color: rgba(247,243,237,0.6);
  padding: 0 28px;
  flex-shrink: 0;
  display: flex; align-items: center; gap: 20px;
}
.ticker-item.hl { color: var(--bg); }
.ticker-sep {
  width: 4px; height: 4px;
  background: var(--red);
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.6;
}
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* ── WHY SECTION ── */
.why {
  padding: 100px 48px;
  max-width: 1100px;
  margin: 0 auto;
}
.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 56px;
  display: flex; align-items: center; gap: 16px;
}
.section-label::after { content:''; flex:1; height:1px; background:var(--border); }

.why-intro {
  font-family: 'Fraunces', serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 72px;
  max-width: 680px;
}
.why-intro em { font-style: italic; color: var(--red); }

.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  margin-bottom: 72px;
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
}
@media(max-width: 700px) { .why-grid { grid-template-columns: 1fr; } }

.why-card {
  background: var(--bg);
  padding: 36px 32px;
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}
.why-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--red);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.why-card:hover { background: var(--warm); }
.why-card:hover::after { transform: scaleX(1); }
.why-n {
  font-family: 'Fraunces', serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(17,16,16,0.18);
  margin-bottom: 20px;
  letter-spacing: 0.08em;
}
.why-h {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: var(--ink);
  margin-bottom: 14px;
  line-height: 1.3;
}
.why-p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
  font-weight: 400;
}

.manifesto-card {
  border-radius: 20px;
  background: var(--ink);
  padding: 52px 56px;
  position: relative;
  overflow: hidden;
}
.manifesto-card::before {
  content: '"';
  position: absolute;
  top: -24px; left: 36px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 180px;
  color: rgba(247,243,237,0.06);
  line-height: 1;
  pointer-events: none;
}
.manifesto-card p {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: clamp(16px, 2.2vw, 22px);
  line-height: 1.85;
  color: rgba(247,243,237,0.6);
  margin-bottom: 16px;
  position: relative; z-index: 1;
}
.manifesto-card p:last-child {
  color: var(--bg);
  font-size: clamp(18px, 2.5vw, 26px);
  margin-bottom: 0;
}

/* ── PFP SECTION ── */
.pfp-wrap {
  background: var(--ink);
  padding: 100px 48px;
  position: relative;
  overflow: hidden;
}
.pfp-wrap::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

.pfp-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }

.pfp-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 40px;
  display: flex; align-items: center; gap: 16px;
}
.pfp-section-label::after { content:''; flex:1; height:1px; background:rgba(247,243,237,0.1); }

.pfp-headline {
  font-family: 'Fraunces', serif;
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 300;
  font-style: italic;
  color: var(--bg);
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.pfp-headline span { color: var(--red); }

.pfp-desc {
  font-size: 13px;
  color: rgba(247,243,237,0.45);
  margin-bottom: 56px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

/* Upload/result layout */
.forge-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}
@media(max-width: 640px) { .forge-layout { grid-template-columns: 1fr; } }

.forge-panel { display: flex; flex-direction: column; gap: 14px; }

.panel-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(247,243,237,0.35);
  display: flex; align-items: center; gap: 10px;
}
.panel-tag-dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(247,243,237,0.08);
  border: 1px solid rgba(247,243,237,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
  color: var(--red);
}

/* Upload zone */
.drop-zone {
  aspect-ratio: 1;
  border: 1.5px solid rgba(247,243,237,0.1);
  border-radius: 16px;
  background: rgba(247,243,237,0.03);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
}
.drop-zone:hover { border-color: rgba(247,243,237,0.25); background: rgba(247,243,237,0.06); }
.drop-zone.filled { border-color: rgba(247,243,237,0.2); }
.drop-zone img { width:100%; height:100%; object-fit:cover; display:block; border-radius: 14px; }

.drop-placeholder { text-align:center; padding:28px; }
.drop-icon {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: rgba(247,243,237,0.07);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  font-size: 22px;
}
.drop-label {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 15px;
  color: rgba(247,243,237,0.4);
  margin-bottom: 6px;
}
.drop-sub {
  font-family: 'Syne Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(247,243,237,0.2);
}

/* result zone */
.result-zone {
  aspect-ratio: 1;
  border: 1.5px solid rgba(247,243,237,0.1);
  border-radius: 16px;
  background: rgba(247,243,237,0.03);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s;
}
.result-zone.has-result { border-color: rgba(214,58,47,0.4); }
.result-zone img { width:100%; height:100%; object-fit:cover; display:block; border-radius: 14px; }

.result-empty { text-align:center; padding:28px; }
.result-empty-big {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 64px;
  font-weight: 300;
  color: rgba(247,243,237,0.06);
  line-height: 1;
  margin-bottom: 12px;
  letter-spacing: -0.03em;
}
.result-empty-hint {
  font-family: 'Syne Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(247,243,237,0.18);
}

/* forging state */
.forging-state { text-align:center; padding:28px; }
.forge-spinner {
  width: 48px; height: 48px;
  border: 2px solid rgba(247,243,237,0.1);
  border-top-color: var(--red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 18px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.forge-status {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 16px;
  color: rgba(247,243,237,0.45);
  margin-bottom: 8px;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
.forge-pct {
  font-family: 'Syne Mono', monospace;
  font-size: 11px;
  color: rgba(247,243,237,0.22);
  letter-spacing: 0.08em;
}

/* progress line */
.prog-track {
  height: 2px;
  background: rgba(247,243,237,0.08);
  border-radius: 2px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  background: var(--red);
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* Forge + dl buttons */
.forge-cta-wrap { margin-top: 32px; display: flex; flex-direction: column; gap: 10px; }

.forge-btn {
  width: 100%;
  padding: 18px 32px;
  background: var(--bg);
  color: var(--ink);
  border: none;
  border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.forge-btn:hover:not(:disabled) {
  background: #fff;
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}
.forge-btn:active:not(:disabled) { transform: scale(0.99); }
.forge-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

.dl-btn {
  width: 100%;
  padding: 14px 28px;
  background: transparent;
  color: var(--bg);
  border: 1.5px solid rgba(247,243,237,0.2);
  border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.dl-btn:hover { background: rgba(247,243,237,0.07); border-color: rgba(247,243,237,0.4); }

.share-hint {
  text-align: center;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(247,243,237,0.3);
  margin-top: 4px;
}

/* err */
.err-pill {
  padding: 12px 18px;
  background: rgba(214,58,47,0.12);
  border: 1px solid rgba(214,58,47,0.3);
  border-radius: 10px;
  font-size: 11px;
  color: rgba(214,58,47,0.8);
  font-family: 'Syne Mono', monospace;
  display: flex; align-items: flex-start; gap: 10px;
  letter-spacing: 0.02em;
}
.err-pill button { background: none; border: none; color: rgba(214,58,47,0.6); cursor: pointer; flex-shrink: 0; font-size: 14px; line-height: 1; }

/* ── FOOTER ── */
.footer {
  background: var(--ink);
  border-top: 1px solid rgba(247,243,237,0.07);
  padding: 48px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
}
.footer-logo {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 22px;
  color: var(--bg);
  letter-spacing: -0.02em;
}
.footer-logo span { color: var(--red); }
.footer-links { display: flex; gap: 8px; flex-wrap: wrap; }
.footer-link {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(247,243,237,0.35);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid rgba(247,243,237,0.08);
  transition: all 0.2s;
  cursor: pointer;
  background: none;
  font-family: 'Syne', sans-serif;
}
.footer-link:hover { color: var(--bg); border-color: rgba(247,243,237,0.2); }
.footer-tag {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(247,243,237,0.2);
}

@keyframes riseIn {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

@media(max-width: 600px) {
  .hero { padding: 80px 24px 56px; }
  .why { padding: 72px 24px; }
  .manifesto-card { padding: 36px 28px; }
  .pfp-wrap { padding: 72px 24px; }
  .footer { padding: 36px 24px; }
}
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
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const fileRef = useRef(null);

  const STATUSES = ['Studying your face…', 'Finding the mirror…', 'Swapping both faces…', 'Preserving the character…', 'Almost there…'];

  // Custom cursor
  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Status cycling
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
    if (!GEMINI_KEY) { setErr('Add VITE_APP_GEMINI to your .env file to enable PFP generation.'); return; }
    setForging(true); setResult(null); setProgress(0); setErr(null);
    const timer = setInterval(() => setProgress(p => Math.min(p + Math.random() * 5.5, 88)), 900);

    try {
      const tRes = await fetch('/template.jpg');
      if (!tRes.ok) throw new Error('template.jpg not found — add your mascot image to /public/template.jpg');
      const tBlob = await tRes.blob();
      const templateB64 = await new Promise(res => {
        const r = new FileReader(); r.onloadend = () => res(r.result.split(',')[1]); r.readAsDataURL(tBlob);
      });

      const prompt = `You are given two images:

- Image 1 (TEMPLATE): A composition showing a character holding a mirror and their reflection.
- Image 2 (USER IMAGE): The user’s character or face.

YOUR TASK:

Transform Image 1 so that the character becomes the user’s character from Image 2, while preserving the mirror concept.

CORE RULES:

1. IDENTITY TRANSFER
- Replace the character in Image 1 with the character from Image 2.
- This includes the face, hairstyle, skin tone, and outfit.
- The outer character (holding the mirror) and the reflection must represent the SAME identity.

2. MIRROR CONCEPT (CRITICAL)
- The outer character = the “current” version.
- The reflection = the “uplifted / ideal / best version” of the same character.
- The reflection should look more confident, refined, powerful, or successful.
- Do NOT change identity — only enhance presence, expression, and subtle details.

3. STYLE ADAPTATION
- The FINAL IMAGE must adopt the art style of Image 2 (the user’s image).
- Convert the entire scene (including background, lighting, and rendering) to match the user’s style.
- Ensure everything looks cohesive in that style (anime, realistic, cartoon, etc.).

4. CLOTHING & DESIGN
- The character’s outfit should match or be inspired by the outfit in Image 2.
- You may adapt it to fit the pose naturally, but keep it recognizable.

5. COMPOSITION PRESERVATION
- Keep the composition of Image 1:
  - Character holding a mirror
  - Reflection visible inside the mirror
  - Same framing and layout
- Do NOT remove the mirror or change the core concept.

6. LIGHTING & INTEGRATION
- Adjust lighting, shading, and colors to match the new style.
- Ensure both the character and reflection feel naturally integrated.

7. FACE & ANGLES
- Adapt the face to match the head angles in both positions.
- Maintain consistency between outer character and reflection.

8. OUTPUT
- Square format (1:1)
- High quality
- Clean, seamless, and visually striking
- The result should feel like the user’s character discovering their best self`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: templateB64 } }, { inlineData: { mimeType: 'image/jpeg', data: b64 } }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
          })
        }
      );

      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error?.message || `API error ${res.status}`); }
      const data = await res.json();
      const imgData = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (!imgData) throw new Error('No image returned — try a clearer, well-lit photo.');

      setTimeout(() => { setResult(`data:image/png;base64,${imgData}`); setProgress(100); setForging(false); }, 400);
    } catch (e) {
      setErr(e.message || 'Something went wrong. Try again.');
      setForging(false);
    } finally { clearInterval(timer); }
  };

  const TQ = ['It starts with me','The trenches need you','Change starts here','I am the mirror','Stop waiting','Be the change','$ME','You are the solution'];
  const TQ2 = [...TQ, ...TQ];

  return (
    <>
      <style>{css}</style>

      {/* Custom cursor — desktop only */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* NAV */}
      <nav>
        <div className="nav-logo">$<span>ME</span></div>
        <div className="nav-links">
          <a className="nav-link nav-hide" href={TWITTER} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a className="nav-link nav-hide" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Community</a>
          <a className="nav-link cta" href="#pfpcult">Make your PFP</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />

        <div className="hero-eyebrow">Solana · Radical Self-Accountability</div>

        <h1 className="hero-title">
          Change starts<br/>with <span className="em">$ME</span>
        </h1>

        <p className="hero-sub">
          The trenches doesn't need saving from outside.<br/>
          It needs you to look in the mirror.
        </p>

        <div className="hero-actions">
          <a className="btn-primary" href="#pfpcult">Make your $ME PFP →</a>
          <a className="btn-ghost" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Join the community</a>
        </div>

        <div className="ca-pill" onClick={copyCA}>
          <span className="ca-tag">CA</span>
          <span className="ca-addr">{CA}</span>
          <span className="ca-act">{copied ? '✓ Copied' : 'Copy'}</span>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {TQ2.map((t, i) => (
            <div key={i} className={`ticker-item ${i % 4 === 0 ? 'hl' : ''}`}>
              {t}<span className="ticker-sep" />
            </div>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section className="why">
        <div className="section-label">Why $ME exists</div>

        <p className="why-intro">
          The trenches isn't dying because of <em>bundlers or bots.</em><br />
          It's dying because of us.
        </p>

        <div className="why-grid">
          {[
            { n: '01', h: 'We are the problem', p: 'We snipe each other, dump on each other, follow the same callers into the same traps. Every cycle. Nobody is waiting for themselves to be the solution.' },
            { n: '02', h: 'We keep looking outside', p: 'New platform, new meta, new narrative. Always waiting for something external to change the outcome. The answer was never out there.' },
            { n: '03', h: 'The change is internal', p: '$ME is for the person who finally looked in the mirror. Who stopped pointing. Who decided the only thing they can control is themselves.' },
          ].map(c => (
            <div key={c.n} className="why-card">
              <div className="why-n">{c.n}</div>
              <div className="why-h">{c.h}</div>
              <div className="why-p">{c.p}</div>
            </div>
          ))}
        </div>

        <div className="manifesto-card">
          <p>Nobody is coming to fix this. Not the platform. Not the devs. Not the next narrative. Not the bull run.</p>
          <p>The only person who changes how this goes is the person holding the phone right now.</p>
          <p>I am the floor. I am the culture. I am the solution. It starts with me.</p>
        </div>
      </section>

      {/* PFP CULT */}
      <section className="pfp-wrap" id="pfpcult">
        <div className="pfp-inner">
          <div className="pfp-section-label">PFP Cult — AI face swap</div>

          <h2 className="pfp-headline">
            Upload your face.<br />
            Become <span>$ME</span>.
          </h2>
          <p className="pfp-desc">
            Our AI places your face on both figures in the $ME mirror artwork — the one holding the mirror, and the reflection.
          </p>

          <div className="forge-layout">
            {/* Upload */}
            <div className="forge-panel">
              <div className="panel-tag"><span className="panel-tag-dot">1</span>Your photo</div>
              <div
                className={`drop-zone ${uploaded ? 'filled' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
                onDragOver={e => e.preventDefault()}
              >
                {uploaded
                  ? <img src={uploaded} alt="Your face" />
                  : (
                    <div className="drop-placeholder">
                      <div className="drop-icon">📷</div>
                      <div className="drop-label">Drop your photo here</div>
                      <div className="drop-sub">or click to browse</div>
                    </div>
                  )
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
              {uploaded && (
                <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: 'rgba(247,243,237,0.3)', fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 0', transition: 'color .2s' }} onMouseOver={e => e.currentTarget.style.color = 'rgba(247,243,237,0.7)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(247,243,237,0.3)'}>
                  Change photo
                </button>
              )}
            </div>

            {/* Result */}
            <div className="forge-panel">
              <div className="panel-tag"><span className="panel-tag-dot">2</span>Your $ME PFP</div>
              <div className={`result-zone ${result ? 'has-result' : ''}`}>
                {result ? (
                  <img src={result} alt="Your $ME PFP" />
                ) : forging ? (
                  <div className="forging-state">
                    <div className="forge-spinner" />
                    <div className="forge-status">{statusMsg}</div>
                    <div className="forge-pct">{Math.round(progress)}%</div>
                  </div>
                ) : (
                  <div className="result-empty">
                    <div className="result-empty-big">$ME</div>
                    <div className="result-empty-hint">Your transformation awaits</div>
                  </div>
                )}
              </div>
              {forging && <div className="prog-track"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>}
            </div>
          </div>

          {/* CTA */}
          <div className="forge-cta-wrap">
            {err && <div className="err-pill"><span>{err}</span><button onClick={() => setErr(null)}>✕</button></div>}

            <button className="forge-btn" onClick={forge} disabled={!b64 || forging}>
              {forging
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(17,16,16,0.15)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} /> Forging your $ME…</>
                : result ? 'Forge Again →' : 'Forge My $ME PFP →'
              }
            </button>

            {result && (
              <>
                <button className="dl-btn" onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `ME_PFP_${Date.now()}.png`; a.click(); }}>
                  Download PFP
                </button>
                <div className="share-hint">Set it as your PFP and tag us on X →</div>
              </>
            )}

            <div style={{ textAlign: 'center', fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(247,243,237,0.18)', marginTop: 6 }}>
              Powered by Gemini AI · Images are never stored
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">$<span>ME</span></div>
        <div className="footer-links">
          <a className="footer-link" href={TWITTER} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a className="footer-link" href={COMMUNITY} target="_blank" rel="noopener noreferrer">Community</a>
          <button className="footer-link" onClick={copyCA}>{copied ? '✓ Copied' : 'Copy CA'}</button>
        </div>
        <div className="footer-tag">It starts with me.</div>
      </footer>
    </>
  );
}
