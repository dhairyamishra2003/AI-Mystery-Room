import { Link } from 'react-router-dom';
import { ArrowRight, Fingerprint, Lightbulb, Scale, Search, ShieldAlert } from 'lucide-react';
import { Layout } from '../components/Layout.jsx';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">AI-POWERED DETECTIVE CASES</p>
          <h1>
            Every Mystery<br />
            <i>Has a Secret.</i>
          </h1>
          <p className="lead">
            Enter a new case file, follow the evidence, and name the one person who thought they could get away with it.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/create">
              Start investigation <ArrowRight size={18} />
            </Link>
            <span className="hero-badge">
              <span className="pulse-indicator"></span>
              Live AI Case Generator
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="scene-card">
            <div className="scene-lighting"></div>
            <div className="scene-frame">
              <img
                src="/images/investigation-board.jpg"
                alt="Detective Investigation Board with Suspect Photos, Clues, and Red Connecting Strings"
                className="scene-image"
                loading="eager"
              />
              <div className="scene-overlay-gradient"></div>

              <div className="scene-tag scene-tag-top">
                <ShieldAlert size={13} className="tag-icon" />
                <span>CASE EVIDENCE // ACTIVE DOSSIER</span>
              </div>

              <div className="scene-tag scene-tag-bottom">
                <Search size={13} className="tag-icon gold" />
                <span>EVIDENCE BOARD · SUSPECT PROFILES</span>
              </div>

              <div className="scene-pin-note">
                <span className="pushpin"></span>
                <p>“All alibis break under forensic scrutiny.”</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how">
        <p className="eyebrow">HOW IT WORKS</p>
        <div className="three">
          <article>
            <Fingerprint />
            <h3>1. Open a case</h3>
            <p>Choose a premise and difficulty. A fresh mystery is generated just for you.</p>
          </article>
          <article>
            <Lightbulb />
            <h3>2. Follow the evidence</h3>
            <p>Question every alibi, uncover each clue, and use hints with care.</p>
          </article>
          <article>
            <Scale />
            <h3>3. Make the call</h3>
            <p>Accuse one suspect. Your score reflects the investigation you conducted.</p>
          </article>
        </div>
      </section>

      <section className="difficulty">
        <p className="eyebrow">CHOOSE YOUR PRESSURE</p>
        <div className="difficulty-grid">
          <div>
            <b>Easy</b>
            <span>3 suspects · 5 clues · 2 hints</span>
          </div>
          <div>
            <b>Medium</b>
            <span>4 suspects · 7 clues · 3 hints</span>
          </div>
          <div>
            <b>Hard</b>
            <span>5 suspects · 9 clues · 3 hints</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
