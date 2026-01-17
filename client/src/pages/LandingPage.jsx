import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, ArrowRight, Check, DollarSign, Zap, X } from 'lucide-react';

export default function LandingPage() {
  const [showImage, setShowImage] = React.useState(false);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo-section">
          <Ghost color="var(--accent-primary)" size={32} strokeWidth={2.5} />
          <span className="brand-name">Spend<span className="text-highlight">SHRED</span></span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-text">Log in</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-new">
            <span className="badge-pill">New</span>
            <span className="badge-text">Inactivity Detection is live! 🧟‍♂️</span>
          </div>
          <h1 className="hero-title">
            Stop Paying for <br />
            <span className="text-gradient">Ghost Subscriptions</span>
          </h1>
          <p className="hero-subtitle">
            The average company wastes <strong>30% of their SaaS budget</strong> on unused seats and forgotton tools.
            Identify zombies, verify usage, and cancel waste in one click.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">
              Start Shredding Waste <ArrowRight size={18} />
            </Link>
            <div className="hero-trust">
              <Check size={14} color="var(--accent-success)" /> No credit card required
              <span className="dot-sep">•</span>
              <Check size={14} color="var(--accent-success)" /> Secure Gmail Integration
            </div>
          </div>
        </div>

        {/* Abstract dashboard preview */}
        <div className="hero-visual glass-panel">
          <div className="visual-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <div className="visual-chart">
            <div className="stat-card">
              <span className="stat-label">Potential Savings</span>
              <span className="stat-value text-green">$1,240<span className="stat-sub">/mo</span></span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Zombie Apps</span>
              <span className="stat-value text-red">7 <span className="stat-sub">Found</span></span>
            </div>
          </div>
          <div className="visual-list">
            <div className="visual-row">
              <div className="row-icon slack"></div>
              <div className="row-text">
                <div className="row-title">Slack Enterprise</div>
                <div className="row-sub">5 inactive seats detected</div>
              </div>
              <div className="row-badge">Zombie</div>
            </div>
            <div className="visual-row">
              <div className="row-icon jira"></div>
              <div className="row-text">
                <div className="row-title">Jira Cloud</div>
                <div className="row-sub">Last login: 8 months ago</div>
              </div>
              <div className="row-badge">Kill</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <FeatureCard
            icon={Ghost}
            title="Zombie Detection"
            desc="Automatically flags subscriptions that haven't been used in 30+ days by scanning for inactivity emails."
          />
          <FeatureCard
            icon={DollarSign}
            title="True Cost Analysis"
            desc="See exactly how much money is being wasted per team and per tool. No more estimation."
          />
          <FeatureCard
            icon={Zap}
            title="Instant Cancellation"
            desc="Generate cancellation emails with one click. We handle the awkward break-up text involved."
          />
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How SpendShred Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Connect Your Stack</h3>
            <p>Securely link your Google Workspace (G-Suite). We only scan for receipts and invoicing emails—your privacy is guaranteed.</p>
          </div>
          <div className="step-div"></div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>We Find the Zombies</h3>
            <p>Our algorithms detect inactivity signals, "We miss you" emails, and duplicate tools to flag wasted spend.</p>
          </div>
          <div className="step-div"></div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Slay the Waste</h3>
            <p>Review your "Kill List" and cancel unwanted subscriptions instantly with our auto-generated cancellation workflows.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to stop burning cash?</h2>
          <p>Join smart teams saving an average of <strong>$14k/year</strong> on unused software.</p>
          <Link to="/register" className="btn-hero-primary" style={{ margin: '32px auto 0' }}>
            Start Shredding Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="about-section">
        <h3 className="about-header">Built by an Expert</h3>
        <div className="about-card glass-panel">
          <div className="about-content centered">
            <div className="profile-img-wrapper" onClick={() => setShowImage(true)}>
              <img src="/naveen.jpg" alt="Naveenkumar" className="profile-img clickable" />
            </div>

            {/* Image Modal */}
            {showImage && (
              <div className="modal-overlay" onClick={() => setShowImage(false)}>
                <button className="modal-close">
                  <X size={32} />
                </button>
                <img
                  src="/naveen.jpg"
                  alt="Naveenkumar"
                  className="modal-img"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <h4 className="expert-name">Naveenkumar Koppala</h4>
            <p className="expert-role">Senior Backend & Product Engineer</p>
            <p className="expert-bio">
              Hi, I'm <strong className="text-highlight">Naveen</strong>. I built SpendShred because I was tired of seeing companies waste thousands on "Zombie SaaS"—tools that no one uses but everyone pays for.
            </p>
            <p className="expert-bio">
              I bring 4.7+ years of experience scaling secure fintech and enterprise systems, specializing in Python, FastAPI, and Cloud-Native Security.
            </p>
            <p className="expert-bio">
              My mission is to help 10,000 teams reclaim their budget and put it towards what matters: <strong>Building great products.</strong>
            </p>
            <div className="social-links" style={{ marginTop: '24px' }}>
              <a href="https://www.linkedin.com/in/naveenkumarkoppala/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
              <span className="dot-sep">•</span>
              <a href="https://www.reddit.com/user/naveenkumarkoppala/" target="_blank" rel="noopener noreferrer" className="social-link">Reddit</a>
              <span className="dot-sep">•</span>
              <a href="mailto:naveenkumarkoppala@gmail.com" className="social-link">Email Me</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-copy">© 2026 SpendShred. Open Source Security.</p>
          <p className="footer-credit">Built by <strong className="text-white">Naveenkumar Koppala</strong></p>
        </div>
      </footer>

      <style>{`
        .landing-container {
            min-height: 100vh;
            background: radial-gradient(circle at 15% 50%, rgba(255, 77, 77, 0.08), transparent 25%),
                        radial-gradient(circle at 85% 30%, rgba(77, 77, 255, 0.08), transparent 25%);
            color: var(--text-primary);
            overflow-x: hidden;
        }
        .landing-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 32px;
            max-width: 1440px;
            margin: 0 auto;
        }
        .logo-section {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .brand-name {
            font-size: 26px;
            font-weight: 500;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .text-highlight { 
            color: var(--accent-primary); 
            font-weight: 900;
            font-style: italic;
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .btn-text {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .btn-text:hover { color: var(--text-primary); }
        .btn-primary {
            background: var(--accent-primary);
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
        }
        
        .hero-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 80px 24px 120px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .badge-new {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: var(--bg-hover);
            border: 1px solid var(--glass-border);
            padding: 4px 12px 4px 4px;
            border-radius: 20px;
            margin-bottom: 32px;
            font-size: 13px;
        }
        .badge-pill {
            background: var(--accent-primary);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
        }
        .hero-title {
            font-size: 64px;
            line-height: 1.1;
            font-weight: 800;
            margin-bottom: 24px;
            letter-spacing: -2px;
        }
        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, #aaa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
            font-size: 18px;
            color: var(--text-secondary);
            max-width: 600px;
            line-height: 1.6;
            margin-bottom: 40px;
        }
        .hero-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }
        .btn-hero-primary {
            background: var(--accent-primary);
            color: white;
            padding: 16px 40px;
            border-radius: 30px;
            font-weight: 600;
            text-decoration: none;
            font-size: 18px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.2s;
            box-shadow: 0 4px 20px rgba(255, 77, 77, 0.3);
        }
        .btn-hero-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(255, 77, 77, 0.4);
        }
        .hero-trust {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-muted);
        }
        .dot-sep { opacity: 0.5; }

        /* Abstract Visual */
        .hero-visual {
            margin-top: 80px;
            width: 100%;
            max-width: 800px;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            background: rgba(20, 20, 20, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .visual-header {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #FF5F56; }
        .yellow { background: #FFBD2E; }
        .green { background: #27C93F; }

        .visual-chart {
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
        }
        .stat-card {
            flex: 1;
            background: rgba(255,255,255,0.03);
            padding: 16px;
            border-radius: 12px;
            text-align: left;
        }
        .stat-label { font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: 700; }
        .text-green { color: var(--accent-success); }
        .text-red { color: var(--accent-primary); }
        .stat-sub { font-size: 14px; opacity: 0.7; font-weight: 400; }

        .visual-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .visual-row {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
        }
        .row-icon { width: 32px; height: 32px; border-radius: 6px; }
        .slack { background: #4A154B; }
        .jira { background: #0052CC; }
        .row-text { flex: 1; text-align: left; }
        .row-title { font-size: 14px; font-weight: 600; }
        .row-sub { font-size: 12px; color: var(--text-muted); }
        .row-badge { 
            font-size: 11px; 
            padding: 4px 8px; 
            background: rgba(255, 77, 77, 0.2); 
            color: #ff6b6b; 
            border-radius: 4px;
            font-weight: 600;
        }

        .features-section {
            padding: 80px 24px;
            background: rgba(255,255,255,0.02);
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-card {
            padding: 24px;
            background: var(--bg-card); /* Fallback */
            background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
        }
        .feature-icon-wrapper {
            width: 48px;
            height: 48px;
            background: var(--bg-hover);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            color: var(--accent-primary);
        }
        .feature-title { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .feature-desc { color: var(--text-secondary); line-height: 1.5; font-size: 15px; }

        .landing-footer {
            padding: 40px;
            text-align: center;
            color: var(--text-muted);
            font-size: 13px;
            border-top: 1px solid var(--glass-border);
        }

        .how-it-works {
            padding: 60px 24px;
            text-align: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        .section-title {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 40px;
        }
        .steps-container {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
        }
        .step-card {
            flex: 1;
            padding: 24px;
            background: rgba(255,255,255,0.02);
            border-radius: 16px;
            border: 1px solid transparent;
            transition: border-color 0.2s;
        }
        .step-card:hover { border-color: var(--glass-border); }
        .step-number {
            font-size: 48px;
            font-weight: 800;
            color: rgba(255, 77, 77, 0.5);
            margin-bottom: 16px;
            line-height: 1;
        }
        .step-card h3 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .step-card p { font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
        .step-div {
            width: 60px;
            height: 2px;
            background: var(--glass-border);
            margin-top: 60px; /* Align with visuals */
            display: none; /* Hidden on mobile */
        }
        @media (min-width: 768px) { .step-div { display: block; } }

        .cta-section {
            padding: 80px 24px;
            text-align: center;
            background: radial-gradient(circle at 50% 50%, rgba(255, 77, 77, 0.15), transparent 60%);
        }
        .cta-content h2 { font-size: 42px; font-weight: 800; margin-bottom: 24px; }
        .cta-content p { font-size: 18px; color: var(--text-secondary); max-width: 500px; margin: 0 auto; }

        .about-section {
            padding: 80px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .about-header {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 40px;
        }
        .about-card {
            padding: 32px;
            background: rgba(10, 10, 20, 0.6);
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .about-content.centered {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .profile-img-wrapper {
            margin-bottom: 16px;
            padding: 4px;
            border: 2px solid var(--accent-primary);
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .profile-img-wrapper:hover {
            transform: scale(1.1);
        }
        .profile-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            animation: fadeIn 0.2s ease-out;
        }
        .modal-close {
            position: absolute;
            top: 24px;
            right: 24px;
            color: #888;
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.2s;
        }
        .modal-close:hover { color: #fff; }
        .modal-img {
            max-width: 90vw;
            max-height: 85vh;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            animation: zoomIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .expert-name {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
        }
        .expert-role {
            font-size: 14px;
            color: var(--accent-primary);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
        }
        .expert-bio {
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 12px;
            max-width: 700px;
        }
        .btn-linkedin {
            display: inline-block;
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s;
        }
        .btn-linkedin:hover {
            background: #0077b5;
            border-color: #0077b5;
            transform: translateY(-2px);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 12px;
            font-size: 14px;
        }
        .social-link { color: var(--text-secondary); text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .social-link:hover { color: #fff; text-decoration: underline; }

        .landing-footer {
            padding: 60px 24px;
            background: #000;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-copy { color: var(--text-muted); font-size: 14px; margin-bottom: 8px; }
        .footer-credit { color: var(--text-secondary); font-size: 14px; }
        .text-white { color: #fff; }

        /* Responsive Styles */
        @media (max-width: 768px) {
            .landing-nav {
                padding: 16px 12px;
            }
            .brand-name { font-size: 18px; }
            .nav-links { gap: 8px; }
            .btn-text, .btn-primary { 
                font-size: 13px; 
                padding: 6px 12px; 
                white-space: nowrap;
            }
            
            .hero-section {
                padding: 40px 16px 60px;
            }
            .hero-title {
                font-size: 36px;
                margin-bottom: 16px;
            }
            .hero-subtitle {
                font-size: 16px;
                margin-bottom: 32px;
            }
            .btn-hero-primary {
                width: auto;
                max-width: 100%;
                display: flex;
                justify-content: center;
                padding: 16px 32px;
                font-size: 16px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .hero-visual {
                margin-top: 40px;
                padding: 16px;
            }
            .stat-value { font-size: 20px; }
            .visual-chart { flex-direction: column; gap: 12px; }
            
            .features-section { padding: 40px 16px; }
            .features-grid { 
                grid-template-columns: 1fr;
                gap: 24px;
            }
            .feature-card { padding: 20px; }
            .feature-icon-wrapper { margin-bottom: 16px; }
            
            .steps-container {
                flex-direction: column;
                gap: 40px;
            }
            .step-div { display: none; }
            
            .how-it-works { padding: 40px 16px; }
            .cta-section { padding: 60px 16px; }
            .cta-content h2 { font-size: 32px; }
            
            .about-section { padding: 60px 16px; }
            .about-card { padding: 24px; }
            .expert-name { font-size: 20px; }
            .expert-bio { font-size: 15px; }
            .social-links { flex-wrap: wrap; }
        }

      `}</style>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon-wrapper">
        <Icon size={24} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  )
}
