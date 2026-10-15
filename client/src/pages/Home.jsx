
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: "📊",
    title: "Marks Overview",
    description:
      "View student marks, subject-wise scores, grades and results in one place.",
  },
  {
    icon: "🎓",
    title: "Student Records",
    description:
      "Keep student information organized and access academic records easily.",
  },
  {
    icon: "📈",
    title: "Performance Analysis",
    description:
      "Understand academic performance with clear summaries and statistics.",
  },
  {
    icon: "🔐",
    title: "Secure Access",
    description:
      "Provide students with a dedicated login and personalized dashboard.",
  },
];

const highlights = [
  { icon: "📝", title: "Marks Management", text: "Organized academic records" },
  { icon: "🏆", title: "Grade Tracking", text: "Quick result visibility" },
  { icon: "📚", title: "Student Database", text: "Student details in one place" },
];

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-navbar">
        <Link to="/" className="home-brand">
          <span className="brand-icon">🎓</span>
          <span>
            <strong>MarkSphere</strong>
            <small>INTERNAL MARKS SYSTEM</small>
          </span>
        </Link>

        <nav className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="nav-login">
            Login
          </Link>
          <Link to="/register" className="nav-register">
            Get Started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="status-dot" />
              SMART ACADEMIC MANAGEMENT
            </div>

            <h1>
              Every mark tells
              <br />
              <span>a story.</span>
            </h1>

            <p className="hero-description">
              Manage student marks, track academic progress, and access
              results with a simple, organized, and secure system.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="primary-button">
                Student Login <span aria-hidden="true">→</span>
              </Link>
              <Link to="/register" className="secondary-button">
                Create Account
              </Link>
            </div>

            <div className="hero-trust">
              <span className="trust-icon">✓</span>
              Simple to use
              <span className="trust-separator">•</span>
              <span className="trust-icon">✓</span>
              Organized records
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="dashboard-preview">
              <div className="preview-topbar">
                <div>
                  <span className="preview-eyebrow">ACADEMIC OVERVIEW</span>
                  <h3>Student Dashboard</h3>
                </div>
                <span className="preview-avatar">🎓</span>
              </div>

              <div className="preview-welcome">
                <div>
                  <span>Welcome back!</span>
                  <h4>Your progress matters.</h4>
                </div>
                <span className="welcome-emoji">✨</span>
              </div>

              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="stat-icon purple">📚</span>
                  <span className="stat-label">Subjects</span>
                  <strong>Track</strong>
                  <small>Subject records</small>
                </div>

                <div className="preview-stat">
                  <span className="stat-icon blue">📈</span>
                  <span className="stat-label">Performance</span>
                  <strong>Review</strong>
                  <small>Progress summary</small>
                </div>
              </div>

              <div className="preview-bottom">
                <span className="preview-check">✓</span>
                <div>
                  <strong>All in one place</strong>
                  <small>Your academic information, organized.</small>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">📊</span>
              <div>
                <strong>Smart Tracking</strong>
                <small>Academic records</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-icon trophy">🏆</span>
              <div>
                <strong>Keep Improving</strong>
                <small>Track your progress</small>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights-section" aria-label="System highlights">
          {highlights.map((item) => (
            <article className="highlight-card" key={item.title}>
              <span className="highlight-icon">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-kicker">BUILT FOR BETTER LEARNING</span>
            <h2>
              Everything you need,
              <br />
              <span>in one platform.</span>
            </h2>
            <p>
              Spend less time searching for records and more time focusing
              on academic progress.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <span className={`feature-icon feature-icon-${index + 1}`}>
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="#about" className="feature-link">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="about">
          <div>
            <span className="section-kicker">YOUR ACADEMIC JOURNEY</span>
            <h2>Ready to get started?</h2>
            <p>
              Sign in to access your account or create one to get started.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/login" className="primary-button">
              Login Now →
            </Link>
            <Link to="/register" className="secondary-button">
              Create Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <Link to="/" className="footer-brand">
          🎓 MarkSphere
        </Link>
        <p>Internal Marks Management System</p>
        <span>© {new Date().getFullYear()} MarkSphere. All rights reserved.</span>
      </footer>
    </div>
  );
}
