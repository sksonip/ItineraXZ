"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Compass,
  MapPin,
  Menu,
  MoveUpRight,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const journeys = [
  { name: "Karnataka", meta: "Forest · Coffee · Rain", number: "01" },
  { name: "Ladakh", meta: "Silence · Altitude · Light", number: "02" },
  { name: "Konkan", meta: "Coast · Mango · Monsoon", number: "03" },
];

const steps = [
  ["01", "Start with a feeling", "Tell us what you want more of: space, wonder, stillness, or a little bit of all three."],
  ["02", "Shape the pace", "We build the in-between moments too, so the journey feels like yours from the first mile."],
  ["03", "Leave room for more", "A thoughtfully planned escape, with enough space to follow the road when it surprises you."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Bettadjeeva home">
          <span className="brand-mark"><Compass size={23} strokeWidth={1.5} /></span>
          <span>
            <strong>Bettadjeeva</strong>
            <small>Travel, thoughtfully</small>
          </span>
        </a>

        <nav className={`desktop-nav ${menuOpen ? "mobile-nav-open" : ""}`}>
          <a href="#journeys" onClick={() => setMenuOpen(false)}>Journeys</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#escapes" onClick={() => setMenuOpen(false)}>Escapes</a>
          <a className="mobile-cta" href="#journeys" onClick={() => setMenuOpen(false)}>Plan a journey <ArrowUpRight size={15} /></a>
        </nav>

        <div className="header-actions">
          <button className="icon-button" aria-label="Open settings"><Settings size={17} strokeWidth={1.7} /></button>
          <a className="header-cta" href="#journeys">Plan a journey <ArrowUpRight size={15} /></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span />A Bettadjeeva original</div>
          <h1>Go where the day<br />feels <em>longer.</em></h1>
          <p className="hero-description">Beautifully paced journeys for people who want to notice more: the warm cup, the unmarked road, the view that was worth taking the long way for.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#journeys">Begin your journey <span><ArrowUpRight size={16} /></span></a>
            <a className="text-link" href="#journeys">See your journeys</a>
          </div>
        </div>

        <div className="hero-card" id="escapes">
          <div className="card-grid" />
          <div className="card-topline"><span>The next chapter</span><span className="card-compass"><Compass size={17} /></span></div>
          <div className="card-content">
            <span className="card-label">Suggested escape</span>
            <h2>The hills are<br />calling softly.</h2>
          </div>
          <div className="card-bottomline"><div><MapPin size={15} /> Coorg, Karnataka</div><span>Long weekend · Monsoon air</span></div>
          <div className="card-orbit orbit-one" /><div className="card-orbit orbit-two" />
          <button className="card-arrow" aria-label="View suggested escape"><MoveUpRight size={17} /></button>
        </div>
      </section>

      <section className="quote-strip">
        <span>Not a holiday.</span><strong>A change in tempo.</strong><span>Made for the quietly curious.</span>
      </section>

      <section className="journeys-section" id="journeys">
        <div className="section-heading"><div><div className="eyebrow"><span />Choose your direction</div><h2>Somewhere<br /><em>worth going.</em></h2></div><p>Journeys shaped around a place, a season, and the kind of pause you have been meaning to take.</p></div>
        <div className="journey-list">{journeys.map((journey) => <a className="journey-row" href="#approach" key={journey.number}><span className="journey-number">{journey.number}</span><span className="journey-name">{journey.name}</span><span className="journey-meta">{journey.meta}</span><ArrowUpRight size={18} /></a>)}</div>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-intro"><div className="eyebrow light"><span />Our approach</div><h2>Leave room<br />for <em>the good stuff.</em></h2><p>We plan the things that matter and leave space for everything else. No rushed checklists. No copy-paste itineraries. Just the right amount of structure to let a place find you.</p></div>
        <div className="steps">{steps.map(([number, title, body]) => <div className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
      </section>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark"><Compass size={21} strokeWidth={1.5} /></span><span><strong>Bettadjeeva</strong><small>Travel, thoughtfully</small></span></a><span className="footer-note"><Sparkles size={14} /> Go gently. Go further.</span><span>© 2024 Bettadjeeva</span></footer>
    </main>
  );
}
