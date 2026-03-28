/**
 * ============================================================
 * SURVEYCLASS — Educational Survey Platform
 * Multi-page React app with React Router-style navigation
 * ============================================================
 *
 * FOLDER STRUCTURE (if splitting into files):
 *  src/
 *   components/
 *     Navbar.jsx
 *     Footer.jsx
 *     Card.jsx
 *     TestimonialCard.jsx
 *     WhatsAppButton.jsx
 *     SectionContainer.jsx
 *   pages/
 *     Home.jsx
 *     HowItWorks.jsx
 *     GettingStarted.jsx
 *     Testimonials.jsx
 *     AccessGuide.jsx
 *   App.jsx
 *
 * All components are included in this single file for portability.
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// GLOBAL STYLES (injected via <style> tag)
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #f8f7f4;
      --surface:   #ffffff;
      --border:    #e4e0d8;
      --ink:       #1c1917;
      --ink-muted: #6b6560;
      --ink-light: #a09b95;
      --accent:    #2d6a4f;
      --accent-lt: #d8ede4;
      --accent-2:  #e07a2f;
      --warn:      #fff3cd;
      --radius:    10px;
      --shadow:    0 2px 12px rgba(0,0,0,0.07);
      --shadow-md: 0 6px 24px rgba(0,0,0,0.10);
      --max-w:     1080px;
      --font-head: 'Lora', Georgia, serif;
      --font-body: 'Outfit', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--ink);
      font-size: 16px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ── UTILITY ── */
    .max-w   { max-width: var(--max-w); margin: 0 auto; padding: 0 1.5rem; }
    .section { padding: 5rem 0; }
    .section-sm { padding: 3rem 0; }

    /* ── LABEL ── */
    .eyebrow {
      display: inline-block;
      font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--accent);
      margin-bottom: 0.75rem;
    }

    /* ── HEADINGS ── */
    h1,h2,h3,h4 { font-family: var(--font-head); line-height: 1.2; }
    h1 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; }
    h2 { font-size: clamp(1.5rem, 3.5vw, 2.3rem); font-weight: 600; }
    h3 { font-size: 1.15rem; font-weight: 600; }

    /* ── PARAGRAPH ── */
    p { color: var(--ink-muted); line-height: 1.75; }

    /* ── CARD ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      box-shadow: var(--shadow);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

    /* ── GRID ── */
    .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.6rem; border-radius: var(--radius);
      font-family: var(--font-body); font-size: 0.9rem; font-weight: 500;
      cursor: pointer; border: none; text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: var(--accent); color: #fff;
    }
    .btn-primary:hover { background: #245940; transform: translateY(-1px); }
    .btn-outline {
      background: transparent; color: var(--ink);
      border: 1.5px solid var(--border);
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
    .btn-wa {
      background: #25d366; color: #fff;
    }
    .btn-wa:hover { background: #1da851; transform: translateY(-1px); }
    .btn-accent2 { background: var(--accent-2); color: #fff; }
    .btn-accent2:hover { background: #c86820; transform: translateY(-1px); }

    /* ── NAVBAR ── */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      background: rgba(248,247,244,0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .navbar-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 62px;
    }
    .nav-logo {
      font-family: var(--font-head); font-size: 1.2rem; font-weight: 700;
      color: var(--ink); cursor: pointer;
    }
    .nav-logo span { color: var(--accent); }
    .nav-links { display: flex; align-items: center; gap: 0.25rem; }
    .nav-link {
      padding: 0.4rem 0.9rem; border-radius: 6px;
      font-size: 0.88rem; font-weight: 500; color: var(--ink-muted);
      cursor: pointer; transition: all 0.18s; border: none; background: none;
      font-family: var(--font-body);
    }
    .nav-link:hover, .nav-link.active { color: var(--accent); background: var(--accent-lt); }
    .nav-link.highlight {
      background: var(--accent); color: #fff; border-radius: 7px;
      padding: 0.4rem 1rem;
    }
    .nav-link.highlight:hover { background: #245940; color: #fff; }
    .nav-hamburger {
      display: none; background: none; border: none;
      cursor: pointer; padding: 0.4rem; color: var(--ink);
    }

    /* Mobile menu */
    .mobile-menu {
      display: none; flex-direction: column; gap: 0.25rem;
      padding: 1rem 1.5rem 1.5rem;
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    .mobile-menu.open { display: flex; }
    .mobile-link {
      padding: 0.65rem 0.9rem; border-radius: 7px;
      font-size: 0.92rem; font-weight: 500; color: var(--ink-muted);
      cursor: pointer; transition: all 0.18s; border: none; background: none;
      font-family: var(--font-body); text-align: left;
    }
    .mobile-link:hover, .mobile-link.active { color: var(--accent); background: var(--accent-lt); }
    .mobile-link.highlight {
      background: var(--accent); color: #fff; margin-top: 0.25rem;
    }

    /* ── HERO ── */
    .hero {
      padding: 8rem 0 5rem;
      background: linear-gradient(160deg, #f0f7f3 0%, var(--bg) 60%);
      border-bottom: 1px solid var(--border);
    }
    .hero-inner { display: grid; grid-template-columns: 1fr 420px; gap: 3rem; align-items: center; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--accent-lt); color: var(--accent);
      padding: 0.3rem 0.9rem; border-radius: 99px;
      font-size: 0.78rem; font-weight: 600; letter-spacing: 0.05em;
      margin-bottom: 1.2rem;
    }
    .hero-title { margin-bottom: 1rem; }
    .hero-title em { font-style: italic; color: var(--accent); }
    .hero-sub { font-size: 1.05rem; max-width: 480px; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; }

    .hero-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 1.8rem;
      box-shadow: var(--shadow-md);
    }
    .hero-card-title {
      font-family: var(--font-head); font-size: 1rem; font-weight: 600;
      margin-bottom: 1.2rem; padding-bottom: 0.8rem;
      border-bottom: 1px solid var(--border);
    }
    .mini-step {
      display: flex; align-items: flex-start; gap: 0.8rem;
      margin-bottom: 1rem;
    }
    .mini-step-num {
      width: 26px; height: 26px; border-radius: 50%;
      background: var(--accent-lt); color: var(--accent);
      font-size: 0.72rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 0.1rem;
    }
    .mini-step-text { font-size: 0.85rem; color: var(--ink-muted); }
    .mini-step-text strong { color: var(--ink); font-weight: 600; }

    /* ── DIVIDER ── */
    .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }

    /* ── NOTICE BOX ── */
    .notice {
      background: var(--warn); border: 1px solid #ffc107;
      border-radius: var(--radius); padding: 1rem 1.25rem;
      font-size: 0.88rem; color: #856404;
    }

    /* ── PAGE HEADER ── */
    .page-header {
      background: linear-gradient(150deg, #f0f7f3 0%, var(--bg) 70%);
      border-bottom: 1px solid var(--border);
      padding: 7rem 0 3.5rem;
      text-align: center;
    }
    .page-header p { max-width: 540px; margin: 0.75rem auto 0; font-size: 1.05rem; }

    /* ── MYTH CARD ── */
    .myth-card { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
    .myth-top { background: #fef2f2; padding: 1.2rem 1.5rem; }
    .myth-bottom { background: #f0fdf4; padding: 1.2rem 1.5rem; }
    .myth-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
    .myth-label.red { color: #dc2626; }
    .myth-label.green { color: var(--accent); }

    /* ── SCREENSHOT PLACEHOLDER ── */
    .screenshot-placeholder {
      background: var(--surface); border: 2px dashed var(--border);
      border-radius: var(--radius); padding: 3rem 2rem;
      text-align: center; color: var(--ink-light);
    }
    .screenshot-placeholder .icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .screenshot-placeholder .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); }

    /* ── TESTIMONIAL CARD ── */
    .testi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.5rem;
      box-shadow: var(--shadow);
    }
    .testi-stars { color: #f59e0b; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .testi-quote { font-size: 0.9rem; color: var(--ink-muted); font-style: italic; margin-bottom: 1rem; line-height: 1.65; }
    .testi-author { font-weight: 600; font-size: 0.85rem; color: var(--ink); }
    .testi-role { font-size: 0.78rem; color: var(--ink-light); margin-top: 0.15rem; }

    /* ── WA BUTTON ── */
    .wa-btn-wrap { display: flex; justify-content: center; }

    /* ── FOOTER ── */
    footer {
      background: var(--ink); color: rgba(255,255,255,0.6);
      padding: 3rem 0 2rem;
    }
    .footer-inner {
      display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
      text-align: center;
    }
    .footer-logo { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: #fff; }
    .footer-logo span { color: #86efac; }
    .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .footer-link {
      font-size: 0.82rem; color: rgba(255,255,255,0.5);
      text-decoration: none; cursor: pointer; transition: color 0.2s;
      background: none; border: none; font-family: var(--font-body);
    }
    .footer-link:hover { color: #fff; }
    .footer-disclaimer {
      font-size: 0.75rem; max-width: 560px;
      color: rgba(255,255,255,0.35); line-height: 1.6;
    }
    .footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

    /* ── CTA BAND ── */
    .cta-band {
      background: var(--accent); color: #fff;
      border-radius: var(--radius); padding: 2.5rem 2rem;
      text-align: center;
    }
    .cta-band h2 { color: #fff; margin-bottom: 0.75rem; }
    .cta-band p { color: rgba(255,255,255,0.8); max-width: 440px; margin: 0 auto 1.5rem; }

    /* ── ACCESS GUIDE ── */
    .access-hero {
      background: linear-gradient(150deg, #f0f7f3 0%, var(--bg) 80%);
      border-bottom: 1px solid var(--border);
      padding: 7rem 0 4rem; text-align: center;
    }
    .access-hero p { max-width: 520px; margin: 1rem auto 2rem; font-size: 1.05rem; }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero { padding: 6.5rem 0 3.5rem; }
      .grid-3, .grid-4 { grid-template-columns: repeat(2,1fr); }
      .grid-2 { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .nav-hamburger { display: flex; }
    }
    @media (max-width: 580px) {
      .grid-3, .grid-4, .grid-2 { grid-template-columns: 1fr; }
      .section { padding: 3.5rem 0; }
    }
  `}</style>
);

// ─────────────────────────────────────────────
// WHATSAPP BUTTON COMPONENT
// ─────────────────────────────────────────────
/**
 * WhatsAppButton
 * ───────────────
 * INSERT WHATSAPP NUMBER HERE
 * Replace the number in the href below with your WhatsApp number.
 * Format: https://wa.me/[COUNTRY_CODE][PHONE_NUMBER]
 * Example: https://wa.me/2348012345678
 */
const WhatsAppButton = ({ label = "Chat on WhatsApp", size = "normal" }) => (
  <a
    className={`btn btn-wa`}
    href="https://wa.me/YOURPHONENUMBERHERE" /* ← INSERT WHATSAPP NUMBER HERE */
    target="_blank"
    rel="noopener noreferrer"
    style={size === "large" ? { padding: "0.85rem 2rem", fontSize: "1rem" } : {}}
  >
    <span>💬</span> {label}
  </a>
);

// ─────────────────────────────────────────────
// SECTION CONTAINER COMPONENT
// ─────────────────────────────────────────────
const SectionContainer = ({ children, className = "", id = "" }) => (
  <section className={`section ${className}`} id={id}>
    <div className="max-w">{children}</div>
  </section>
);

// ─────────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────────
const Card = ({ icon, title, body, accent = false }) => (
  <div className="card" style={accent ? { borderTop: "3px solid var(--accent)" } : {}}>
    {icon && <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{icon}</div>}
    {title && <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>}
    {body && <p style={{ fontSize: "0.9rem" }}>{body}</p>}
  </div>
);

// ─────────────────────────────────────────────
// TESTIMONIAL CARD COMPONENT
// ─────────────────────────────────────────────
/**
 * TestimonialCard
 * ───────────────
 * REPLACE WITH REAL TESTIMONIAL TEXT when ready.
 * Props: name, role, quote, stars (1–5)
 */
const TestimonialCard = ({ name, role, quote, stars = 5 }) => (
  <div className="testi-card">
    <div className="testi-stars">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
    {/* REPLACE WITH REAL TESTIMONIAL TEXT */}
    <p className="testi-quote">"{quote}"</p>
    <div className="testi-author">{name}</div>
    <div className="testi-role">{role}</div>
  </div>
);

// ─────────────────────────────────────────────
// SCREENSHOT PLACEHOLDER COMPONENT
// ─────────────────────────────────────────────
const ScreenshotPlaceholder = ({ label, hint }) => (
  <div className="screenshot-placeholder">
    <div className="icon">🖼️</div>
    <div className="label">{label}</div>
    {hint && <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>{hint}</p>}
  </div>
);

// ─────────────────────────────────────────────
// NAVBAR COMPONENT
// ─────────────────────────────────────────────
const Navbar = ({ currentPage, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home",           label: "Home" },
    { id: "how-it-works",   label: "How it Works" },
    { id: "getting-started",label: "Getting Started" },
    { id: "testimonials",   label: "Testimonials" },
    { id: "access-guide",   label: "Access Guide", highlight: true },
  ];

  const go = (id) => { navigate(id); setMenuOpen(false); };

  return (
    <nav className="navbar">
      <div className="max-w">
        <div className="navbar-inner">
          {/* EDIT SITE NAME HERE */}
          <div className="nav-logo" onClick={() => go("home")}>
            Survey<span>Class</span>
          </div>
          <div className="nav-links">
            {links.map(l => (
              <button
                key={l.id}
                className={`nav-link ${l.highlight ? "highlight" : ""} ${currentPage === l.id ? "active" : ""}`}
                onClick={() => go(l.id)}
              >{l.label}</button>
            ))}
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map(l => (
          <button
            key={l.id}
            className={`mobile-link ${l.highlight ? "highlight" : ""} ${currentPage === l.id ? "active" : ""}`}
            onClick={() => go(l.id)}
          >{l.label}</button>
        ))}
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────
// FOOTER COMPONENT
// ─────────────────────────────────────────────
const Footer = ({ navigate }) => (
  <footer>
    <div className="max-w">
      <div className="footer-inner">
        {/* EDIT SITE NAME HERE */}
        <div className="footer-logo">Survey<span>Class</span></div>
        <div className="footer-links">
          {/* REPLACE PLACEHOLDER LINKS WITH REAL PAGES */}
          <button className="footer-link" onClick={() => navigate("home")}>Home</button>
          <button className="footer-link">Privacy Policy</button>  {/* LINK TO PRIVACY PAGE */}
          <button className="footer-link" onClick={() => navigate("access-guide")}>Contact</button>
          <button className="footer-link">Disclaimer</button>  {/* LINK TO DISCLAIMER PAGE */}
        </div>
        {/* EDIT DISCLAIMER TEXT BELOW */}
        <p className="footer-disclaimer">
          Disclaimer: This website is for educational purposes only. We do not guarantee
          any specific earnings from survey participation. Results vary based on individual
          effort and platform availability. Always read the terms of any platform you join.
          {/* REPLACE THIS WITH YOUR REAL DISCLAIMER */}
        </p>
        <div className="footer-copy">© {new Date().getFullYear()} SurveyClass. All rights reserved.</div>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────
const HomePage = ({ navigate }) => (
  <>
    {/* ── HERO ── */}
    <section className="hero">
      <div className="max-w">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <span>📚</span>
              {/* EDIT BADGE TEXT HERE */}
              Free Educational Guide
            </div>
            {/* EDIT MAIN HEADLINE HERE */}
            <h1 className="hero-title">
              Learn How <em>Online Surveys</em> Work — Step by Step
            </h1>
            {/* EDIT HERO DESCRIPTION HERE */}
            <p className="hero-sub">
              A beginner-friendly guide to understanding how survey platforms work,
              how to get started safely, and what to realistically expect.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("how-it-works")}>
                How Surveys Work →
              </button>
              {/* INSERT WHATSAPP NUMBER IN WhatsAppButton COMPONENT */}
              <WhatsAppButton label="Ask on WhatsApp" />
            </div>
          </div>

          {/* HERO SIDE CARD — EDIT STEPS BELOW */}
          <div className="hero-card">
            <div className="hero-card-title">📋 What you'll learn here</div>
            {[
              ["What online surveys are", "Understand the basics clearly"],
              ["How platforms reward users", "Learn the mechanics honestly"],
              ["How to get started safely", "Step-by-step beginner guide"],
              ["What to realistically expect", "No hype, just facts"],
            ].map(([title, desc], i) => (
              <div className="mini-step" key={i}>
                <div className="mini-step-num">{i + 1}</div>
                <div className="mini-step-text">
                  <strong>{title}</strong><br />{desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── INTRODUCTION ── */}
    <SectionContainer id="intro">
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="eyebrow">About This Guide</span>
        {/* EDIT INTRO SECTION TITLE HERE */}
        <h2>What this website is about</h2>
      </div>
      <div className="grid-3">
        {/* EDIT THESE THREE INTRO CARDS */}
        <Card
          icon="🎯"
          title="Our Purpose"
          body="Placeholder: Explain clearly why you created this guide and what problem it solves for beginners. Replace this text with your real explanation."
          accent
        />
        <Card
          icon="📖"
          title="What You'll Find Here"
          body="Placeholder: Describe the type of content on this site — guides, explanations, step-by-step instructions. Replace this with real content."
          accent
        />
        <Card
          icon="🤝"
          title="Our Approach"
          body="Placeholder: Explain that the information is honest, beginner-friendly, and free of exaggerated claims. Replace this with real content."
          accent
        />
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* ── WHO THIS IS FOR ── */}
    <SectionContainer>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="eyebrow">Audience</span>
        {/* EDIT SECTION TITLE HERE */}
        <h2>Who is this guide for?</h2>
      </div>
      <div className="grid-4">
        {/* EDIT THESE AUDIENCE CARDS */}
        {[
          { icon: "🧑‍💻", title: "Complete Beginners", body: "Placeholder: People who have never tried surveys and want to understand before jumping in." },
          { icon: "🤔", title: "Curious Learners", body: "Placeholder: People who have heard about surveys and want honest, clear information." },
          { icon: "📱", title: "Students", body: "Placeholder: Students looking for a simple side activity that fits around their schedule." },
          { icon: "🏠", title: "Anyone with Spare Time", body: "Placeholder: People who want to understand what survey participation actually involves." },
        ].map((c, i) => <Card key={i} {...c} />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* ── PREVIEW NAVIGATION ── */}
    <SectionContainer>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="eyebrow">Explore</span>
        {/* EDIT SECTION TITLE HERE */}
        <h2>Where would you like to start?</h2>
      </div>
      <div className="grid-3">
        {[
          {
            icon: "📊", title: "How Surveys Work",
            body: "Placeholder: Brief description of what the How it Works page covers. Encourage the reader to click.",
            page: "how-it-works", label: "Read: How it Works →"
          },
          {
            icon: "🚀", title: "Getting Started",
            body: "Placeholder: Brief description of what the Getting Started page covers.",
            page: "getting-started", label: "Read: Getting Started →"
          },
          {
            icon: "🔑", title: "Access Guide",
            body: "Placeholder: Brief description of what the Access Guide page offers for people ready to proceed.",
            page: "access-guide", label: "View Access Guide →"
          },
        ].map((c, i) => (
          <div className="card" key={i} style={{ borderTop: "3px solid var(--accent)" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{c.icon}</div>
            <h3 style={{ marginBottom: "0.5rem" }}>{c.title}</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "1.2rem" }}>{c.body}</p>
            <button className="btn btn-outline" onClick={() => navigate(c.page)}>{c.label}</button>
          </div>
        ))}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* ── TESTIMONIAL PREVIEW ── */}
    <SectionContainer>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="eyebrow">Feedback</span>
        {/* EDIT SECTION TITLE HERE */}
        <h2>What readers are saying</h2>
      </div>
      {/* REPLACE WITH REAL TESTIMONIAL TEXT */}
      <div className="grid-2" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <TestimonialCard
          name="[Placeholder Name]"
          role="[Placeholder — e.g. Student, Lagos]"
          quote="Placeholder testimonial text. Replace this with a real quote from someone who found the guide helpful."
          stars={5}
        />
        <TestimonialCard
          name="[Placeholder Name]"
          role="[Placeholder — e.g. Beginner, Kano]"
          quote="Placeholder testimonial text. This is a short and honest review. Replace with a real one when available."
          stars={5}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button className="btn btn-outline" onClick={() => navigate("testimonials")}>
          Read all testimonials →
        </button>
      </div>
    </SectionContainer>
  </>
);

// ─────────────────────────────────────────────
// PAGE: HOW SURVEYS WORK
// ─────────────────────────────────────────────
const HowItWorksPage = ({ navigate }) => (
  <>
    <div className="page-header">
      <div className="max-w">
        <span className="eyebrow">Education</span>
        {/* EDIT PAGE TITLE HERE */}
        <h1>How Online Surveys Work</h1>
        {/* EDIT PAGE DESCRIPTION HERE */}
        <p>A clear, honest overview of what online surveys are and how they operate — no hype included.</p>
      </div>
    </div>

    {/* SECTION 1 — What surveys are */}
    <SectionContainer id="what-are-surveys">
      <span className="eyebrow">Section 1</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "1.25rem" }}>What are online surveys?</h2>
      {/* EDIT EXPLANATION TEXT HERE */}
      <p style={{ maxWidth: "680px", marginBottom: "2rem" }}>
        Placeholder: Explain clearly what online surveys are. Describe how companies and researchers
        use them to collect opinions and data. Keep the language simple and beginner-friendly.
        Replace this entire paragraph with your real explanation.
      </p>
      <div className="grid-3">
        {/* EDIT THESE EXPLANATION CARDS */}
        {[
          { icon: "🏢", title: "Who creates surveys?", body: "Placeholder: Explain that surveys are created by companies, researchers, or brands who want consumer feedback." },
          { icon: "💬", title: "What kind of questions?", body: "Placeholder: Explain the types of questions typically found in surveys — multiple choice, ratings, open-ended." },
          { icon: "📬", title: "How are you invited?", body: "Placeholder: Explain how participants receive surveys — via email, platform dashboard, or notifications." },
        ].map((c, i) => <Card key={i} {...c} />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 2 — How platforms reward users */}
    <SectionContainer id="rewards">
      <span className="eyebrow">Section 2</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "1.25rem" }}>How do survey platforms reward participants?</h2>
      {/* EDIT EXPLANATION TEXT HERE */}
      <p style={{ maxWidth: "680px", marginBottom: "2rem" }}>
        Placeholder: Explain how survey platforms compensate participants. Include points systems,
        gift cards, PayPal, or bank transfers. Be honest about how much is typically earned and
        how long it can take. Replace this paragraph with your real content.
      </p>
      <div className="grid-2">
        {/* EDIT REWARD CARDS */}
        {[
          { icon: "⭐", title: "Points & Credits", body: "Placeholder: Explain how most platforms use a points system that converts to cash or gifts." },
          { icon: "💳", title: "Cash Withdrawals", body: "Placeholder: Explain withdrawal options — PayPal, bank transfer, mobile money, etc." },
          { icon: "🎁", title: "Gift Cards & Vouchers", body: "Placeholder: Explain that some platforms reward with shopping vouchers or gift cards." },
          { icon: "⏱️", title: "Time to Earn", body: "Placeholder: Set realistic expectations — earning takes consistent time and effort." },
        ].map((c, i) => <Card key={i} {...c} />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 3 — Myths vs Reality */}
    <SectionContainer id="myths">
      <span className="eyebrow">Section 3</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "0.75rem" }}>Myths vs. Reality</h2>
      <p style={{ maxWidth: "580px", marginBottom: "2rem" }}>
        {/* EDIT INTRO TEXT HERE */}
        There are many misconceptions about online surveys. Here is an honest look at what is true and what is not.
      </p>
      <div className="grid-3">
        {/* EDIT MYTH/REALITY PAIRS BELOW */}
        {[
          {
            myth: "Placeholder myth: 'You can make a full-time income from surveys alone.'",
            reality: "Placeholder reality: Surveys are best used as a supplementary activity, not a primary income source."
          },
          {
            myth: "Placeholder myth: 'All survey sites are scams.'",
            reality: "Placeholder reality: Many legitimate platforms exist. The key is knowing how to identify them."
          },
          {
            myth: "Placeholder myth: 'You get paid for every survey you start.'",
            reality: "Placeholder reality: You typically only earn if you qualify for and complete a survey fully."
          },
        ].map((m, i) => (
          <div className="myth-card" key={i}>
            <div className="myth-top">
              <div className="myth-label red">✗ Myth</div>
              {/* REPLACE WITH REAL MYTH TEXT */}
              <p style={{ fontSize: "0.88rem", color: "#7f1d1d" }}>{m.myth}</p>
            </div>
            <div className="myth-bottom">
              <div className="myth-label green">✓ Reality</div>
              {/* REPLACE WITH REAL REALITY TEXT */}
              <p style={{ fontSize: "0.88rem", color: "#14532d" }}>{m.reality}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 4 — Screenshots */}
    <SectionContainer id="examples">
      <span className="eyebrow">Section 4</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "0.75rem" }}>What survey dashboards look like</h2>
      <p style={{ maxWidth: "580px", marginBottom: "2rem" }}>
        {/* EDIT INTRO TEXT HERE */}
        Placeholder: Briefly explain what a survey dashboard is and what to expect when you log into a platform.
      </p>
      <div className="grid-2">
        {/* PLACE SCREENSHOT OF SURVEY PLATFORM DASHBOARD HERE */}
        <ScreenshotPlaceholder
          label="PLACE SCREENSHOT OF SURVEY PLATFORM DASHBOARD HERE"
          hint="Replace this box with an actual screenshot of the platform dashboard"
        />
        {/* PLACE IMAGE OF SURVEY PROFILE PAGE HERE */}
        <ScreenshotPlaceholder
          label="PLACE IMAGE OF SURVEY PROFILE PAGE HERE"
          hint="Replace this box with an actual screenshot of the profile/settings page"
        />
      </div>
    </SectionContainer>

    {/* NEXT BUTTON */}
    <SectionContainer className="section-sm">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontSize: "0.88rem" }}>Next: learn how to get started as a beginner.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("getting-started")}>
          Next: Getting Started →
        </button>
      </div>
    </SectionContainer>
  </>
);

// ─────────────────────────────────────────────
// PAGE: GETTING STARTED
// ─────────────────────────────────────────────
const GettingStartedPage = ({ navigate }) => (
  <>
    <div className="page-header">
      <div className="max-w">
        <span className="eyebrow">Beginner Guide</span>
        {/* EDIT PAGE TITLE HERE */}
        <h1>Getting Started with Online Surveys</h1>
        {/* EDIT PAGE DESCRIPTION HERE */}
        <p>A practical, honest guide for complete beginners — covering what to expect and how to proceed safely.</p>
      </div>
    </div>

    {/* SECTION 1 — Beginner challenges */}
    <SectionContainer id="challenges">
      <span className="eyebrow">Section 1</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "1.25rem" }}>Common challenges for beginners</h2>
      {/* EDIT EXPLANATION TEXT HERE */}
      <p style={{ maxWidth: "680px", marginBottom: "2rem" }}>
        Placeholder: Describe the common frustrations and difficulties that beginners face when
        starting with surveys — e.g., not knowing which platforms to trust, getting disqualified,
        low survey availability, etc. Be honest and empathetic. Replace this with your real content.
      </p>
      <div className="grid-3">
        {/* EDIT CHALLENGE CARDS BELOW */}
        {[
          { icon: "😕", title: "Not knowing where to start", body: "Placeholder: Explain the overwhelm of finding the right platform when starting out." },
          { icon: "🚫", title: "Getting disqualified", body: "Placeholder: Explain how survey screening works and why beginners often get screened out." },
          { icon: "⏳", title: "Low patience for slow results", body: "Placeholder: Explain that results take time and consistency, not overnight success." },
        ].map((c, i) => <Card key={i} {...c} />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 2 — What this guide provides */}
    <SectionContainer id="what-we-provide">
      <span className="eyebrow">Section 2</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "1.25rem" }}>What this guide helps you with</h2>
      <div className="grid-2">
        {/* EDIT THESE GUIDE FEATURE CARDS */}
        {[
          { icon: "📋", title: "Platform Selection", body: "Placeholder: Explain that the guide helps you identify legitimate and beginner-friendly platforms." },
          { icon: "🛡️", title: "Safety Tips", body: "Placeholder: Explain the safety practices covered — e.g., avoiding scams, protecting personal info." },
          { icon: "⚙️", title: "Profile Optimization", body: "Placeholder: Explain how to set up your profile correctly to receive more relevant surveys." },
          { icon: "📈", title: "Consistency Strategy", body: "Placeholder: Explain that the guide covers how to stay consistent and track your progress." },
        ].map((c, i) => <Card key={i} {...c} accent />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 3 — Screenshots */}
    <SectionContainer id="examples">
      <span className="eyebrow">Section 3</span>
      {/* EDIT SECTION TITLE HERE */}
      <h2 style={{ marginBottom: "0.75rem" }}>Examples of survey websites</h2>
      <p style={{ maxWidth: "580px", marginBottom: "2rem" }}>
        {/* EDIT INTRO TEXT HERE */}
        Placeholder: Briefly describe what legitimate survey websites look like and what features to expect when you sign up.
      </p>
      {/* PLACE SCREENSHOT OF SURVEY WEBSITE HERE */}
      <ScreenshotPlaceholder
        label="PLACE SCREENSHOT OF SURVEY WEBSITE HERE"
        hint="Replace this box with an actual screenshot of a legitimate survey platform website"
      />
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* SECTION 4 — CTA to Access Guide */}
    <SectionContainer id="next-step" className="section-sm">
      <div className="cta-band">
        {/* EDIT CTA HEADLINE HERE */}
        <h2>Ready to access the full guide?</h2>
        {/* EDIT CTA DESCRIPTION HERE */}
        <p>
          Placeholder: Encourage the reader to visit the Access Guide page where they can get
          the complete resource. Keep the language calm and informational.
        </p>
        <button className="btn" style={{ background: "#fff", color: "var(--accent)" }} onClick={() => navigate("access-guide")}>
          View the Access Guide →
        </button>
      </div>
    </SectionContainer>
  </>
);

// ─────────────────────────────────────────────
// PAGE: TESTIMONIALS
// ─────────────────────────────────────────────

/**
 * TESTIMONIALS DATA
 * ──────────────────
 * REPLACE WITH REAL TESTIMONIAL TEXT
 * Edit each object below: name, role, quote, stars
 */
const TESTIMONIALS_DATA = [
  { name: "[Placeholder Name 1]", role: "[Role / Location]", quote: "Placeholder testimonial 1. Replace this with a real, honest quote from someone who used the guide.", stars: 5 },
  { name: "[Placeholder Name 2]", role: "[Role / Location]", quote: "Placeholder testimonial 2. Keep testimonials short, genuine, and specific. Replace with real feedback.", stars: 5 },
  { name: "[Placeholder Name 3]", role: "[Role / Location]", quote: "Placeholder testimonial 3. Describe what was helpful — e.g., clarity of the guide, safety tips, etc.", stars: 4 },
  { name: "[Placeholder Name 4]", role: "[Role / Location]", quote: "Placeholder testimonial 4. Mention something specific the person liked about the resource.", stars: 5 },
  { name: "[Placeholder Name 5]", role: "[Role / Location]", quote: "Placeholder testimonial 5. Honest and balanced feedback is more trustworthy than exaggerated praise.", stars: 4 },
  { name: "[Placeholder Name 6]", role: "[Role / Location]", quote: "Placeholder testimonial 6. You can include how long they have been using surveys and how it has helped.", stars: 5 },
  { name: "[Placeholder Name 7]", role: "[Role / Location]", quote: "Placeholder testimonial 7. Mention what the person was struggling with before and how the guide helped.", stars: 5 },
  { name: "[Placeholder Name 8]", role: "[Role / Location]", quote: "Placeholder testimonial 8. Keep this authentic. Replace with your real testimonial when available.", stars: 4 },
];

const TestimonialsPage = ({ navigate }) => (
  <>
    <div className="page-header">
      <div className="max-w">
        <span className="eyebrow">Reviews</span>
        {/* EDIT PAGE TITLE HERE */}
        <h1>What Readers Are Saying</h1>
        {/* EDIT PAGE DESCRIPTION HERE */}
        <p>Honest feedback from people who have used this guide. Replace all placeholders with real testimonials.</p>
      </div>
    </div>

    <SectionContainer>
      <div className="notice" style={{ marginBottom: "2rem" }}>
        ⚠️ <strong>Note for editor:</strong> All testimonial cards below are placeholders.
        Replace each one with real, verified feedback before publishing.
        {/* REPLACE WITH REAL TESTIMONIAL TEXT */}
      </div>
      {/* TESTIMONIALS GRID — REPLACE WITH REAL TESTIMONIAL TEXT */}
      <div className="grid-3">
        {TESTIMONIALS_DATA.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </SectionContainer>

    <SectionContainer className="section-sm">
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "1.25rem" }}>
          {/* EDIT CTA TEXT HERE */}
          Ready to get started? View the Access Guide to learn how to proceed.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("access-guide")}>
          View Access Guide →
        </button>
      </div>
    </SectionContainer>
  </>
);

// ─────────────────────────────────────────────
// PAGE: ACCESS GUIDE
// ─────────────────────────────────────────────
const AccessGuidePage = () => (
  <>
    <div className="access-hero">
      <div className="max-w">
        <span className="eyebrow">Final Step</span>
        {/* EDIT PAGE HEADLINE HERE */}
        <h1>Get the Full Access Guide</h1>
        {/* EDIT PAGE DESCRIPTION HERE */}
        <p>
          Placeholder: Explain what the full guide includes and why the reader should take this
          next step. Keep the tone calm and helpful — not pushy or sales-heavy.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {/* INSERT WHATSAPP NUMBER IN WhatsAppButton COMPONENT */}
          <WhatsAppButton label="Contact via WhatsApp" size="large" />
          <a className="btn btn-outline" href="#proof">View Proof →</a>
        </div>
      </div>
    </div>

    {/* WHAT'S INCLUDED */}
    <SectionContainer>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="eyebrow">What You Get</span>
        {/* EDIT SECTION TITLE HERE */}
        <h2>What's included in the guide</h2>
      </div>
      <div className="grid-3">
        {/* EDIT THESE FEATURE CARDS */}
        {[
          { icon: "📄", title: "Step-by-Step Instructions", body: "Placeholder: Describe what the instructions cover — signing up, completing profiles, avoiding scams." },
          { icon: "🔍", title: "Platform Recommendations", body: "Placeholder: Mention that the guide includes a curated list of beginner-friendly platforms." },
          { icon: "💡", title: "Tips & Best Practices", body: "Placeholder: Explain that the guide includes practical tips to get the most from surveys." },
        ].map((c, i) => <Card key={i} {...c} accent />)}
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* PROOF SECTION */}
    <SectionContainer id="proof">
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="eyebrow">Proof</span>
        {/* EDIT PROOF SECTION TITLE HERE */}
        <h2>Evidence it works</h2>
        <p style={{ maxWidth: "480px", margin: "0.75rem auto 0" }}>
          {/* EDIT PROOF INTRO TEXT HERE */}
          Placeholder: Briefly explain what the screenshots below show and why they are relevant to the reader.
        </p>
      </div>
      <div className="grid-2">
        {/* PLACE PAYMENT PROOF SCREENSHOT HERE */}
        <ScreenshotPlaceholder
          label="PLACE PAYMENT PROOF SCREENSHOT HERE"
          hint="Replace with a real screenshot showing a payment confirmation"
        />
        {/* PLACE WITHDRAWAL PROOF SCREENSHOT HERE */}
        <ScreenshotPlaceholder
          label="PLACE WITHDRAWAL PROOF SCREENSHOT HERE"
          hint="Replace with a real screenshot showing a successful withdrawal"
        />
      </div>
    </SectionContainer>

    <hr className="divider" style={{ margin: "0" }} />

    {/* WHATSAPP CTA */}
    <SectionContainer>
      <div className="cta-band">
        {/* EDIT CTA HEADLINE HERE */}
        <h2>Ready to get started?</h2>
        {/* EDIT CTA DESCRIPTION HERE */}
        <p>
          Placeholder: Provide a clear, calm call-to-action. Tell the reader what to expect
          when they contact you via WhatsApp — e.g., response time, what you will send them.
        </p>
        {/* INSERT WHATSAPP NUMBER IN WhatsAppButton COMPONENT */}
        <div className="wa-btn-wrap">
          <WhatsAppButton label="Message us on WhatsApp" size="large" />
        </div>
      </div>
    </SectionContainer>

    {/* DISCLAIMER */}
    <SectionContainer className="section-sm">
      <div className="notice">
        <strong>Important Disclaimer:</strong> Placeholder disclaimer — Replace this with your
        actual disclaimer about realistic expectations, no income guarantees, and individual results varying.
        Always be honest about what the guide does and does not promise.
        {/* REPLACE WITH YOUR REAL DISCLAIMER */}
      </div>
    </SectionContainer>
  </>
);

// ─────────────────────────────────────────────
// SCROLL-TO-TOP ON PAGE CHANGE
// ─────────────────────────────────────────────
const useScrollToTop = (page) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
};

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  useScrollToTop(page);

  const navigate = (p) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case "home":            return <HomePage navigate={navigate} />;
      case "how-it-works":   return <HowItWorksPage navigate={navigate} />;
      case "getting-started":return <GettingStartedPage navigate={navigate} />;
      case "testimonials":   return <TestimonialsPage navigate={navigate} />;
      case "access-guide":   return <AccessGuidePage />;
      default:               return <HomePage navigate={navigate} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <Navbar currentPage={page} navigate={navigate} />
      <main style={{ paddingTop: "62px" }}>
        {renderPage()}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
