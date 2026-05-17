import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import progressService from "../../../services/progressService";
import "./NSLayout.css";
import { nsPages } from "./nsConfig";

// ── Subtopic ID map: page path → id used in coreTopics.js ─────────────────
const PATH_TO_SUBTOPIC_ID = {
  "/number-systems/binary-representation": "binary-representation",
  "/number-systems/number-conversion":     "number-conversion",
  "/number-systems/bit-extension":         "bit-extension",
  "/number-systems/bcd-notation":          "bcd-notation",
  "/number-systems/ascii-notation":        "ascii-notation",
  "/number-systems/bit-converter":         "bit-converter",
  "/number-systems/calculator":            "calculator",
};

const NS_TOPIC = {
  id: "number-systems",
  title: "NUMBER SYSTEMS",
  links: Object.values(PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};

const CATALOG = { topics: [NS_TOPIC], problems: [] };

// ── Icons ──────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getCompletedSubtopics(userKey) {
  const snap = progressService.getSnapshot(userKey, CATALOG);
  return snap.state.topics?.["number-systems"]?.completedSubtopics || [];
}

// ── Component ──────────────────────────────────────────────────────────────
const NSLayout = ({ title, subtitle, intro, highlights = [], children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { user } = useAuth();

  const currentPath = location.pathname;
  const currentIndex = nsPages.findIndex((p) => p.path === currentPath);
  const subtopicId = PATH_TO_SUBTOPIC_ID[currentPath] || null;
  const userKey = progressService.getUserKey(user);

  const [completedSubtopics, setCompletedSubtopics] = useState(() =>
    getCompletedSubtopics(userKey),
  );

  useEffect(() => {
    setCompletedSubtopics(getCompletedSubtopics(userKey));
  }, [currentPath, userKey]);

  const isRead = subtopicId ? completedSubtopics.includes(subtopicId) : false;

  const toggleRead = useCallback(async () => {
    if (!subtopicId) return;
    setCompletedSubtopics((prev) =>
      prev.includes(subtopicId)
        ? prev.filter((id) => id !== subtopicId)
        : [...prev, subtopicId],
    );
    await progressService.toggleSubtopicCompleted(
      userKey,
      NS_TOPIC,
      subtopicId,
      CATALOG,
    );
    setCompletedSubtopics(getCompletedSubtopics(userKey));
  }, [subtopicId, userKey]);

  const readCount = completedSubtopics.filter((sid) =>
    Object.values(PATH_TO_SUBTOPIC_ID).includes(sid),
  ).length;
  const progress = Math.round((readCount / nsPages.length) * 100);
  const progressDash = progress * 0.879;

  const prev = currentIndex > 0 ? nsPages[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < nsPages.length - 1
      ? nsPages[currentIndex + 1]
      : null;

  return (
    <div className="ns-layout">
      <div className="ns-bg ns-bg-1" />
      <div className="ns-bg ns-bg-2" />

      {/* ── TOPBAR ──────────────────────────────────────────── */}
      <header className="ns-topbar">
        <div className="ns-topbar-left">
          <button
            className={`ns-hamburger${sidebarOpen ? " is-open" : ""}`}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
          >
            <span className="ns-ham-bar" />
            <span className="ns-ham-bar" />
            <span className="ns-ham-bar" />
          </button>
          <Link to="/" className="ns-topbar-link">
            <Home size={15} aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        <div className="ns-topbar-center">
          <span className="ns-category-pill">
            <span className="ns-pill-dot" />
            Number Systems
          </span>
        </div>

        <div className="ns-topbar-right">
          <button
            className="ns-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <div
            className="ns-progress-ring-wrap"
            title={`${readCount} of ${nsPages.length} read`}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="14" fill="none"
                stroke="rgba(20,184,166,0.2)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="3"
                strokeDasharray={`${progressDash} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="ns-progress-text">{readCount}/{nsPages.length}</span>
          </div>
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="ns-body">
        {sidebarOpen && (
          <div
            className="ns-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`ns-sidebar${sidebarOpen ? " is-open" : ""}`}
          aria-label="Number Systems module navigation"
        >
          <div className="ns-sidebar-inner">
            <div className="ns-sidebar-card">
              <p className="ns-sidebar-kicker">Learning Path</p>
              <h2 className="ns-sidebar-title">Number Systems</h2>
              <p className="ns-sidebar-copy">
                Master binary, octal, decimal, and hexadecimal — the languages every digital circuit speaks.
              </p>
              <div className="ns-sidebar-progress-bar">
                <div
                  className="ns-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="ns-sidebar-progress-label">{progress}% read</span>
            </div>

            <nav className="ns-sidebar-nav">
              {nsPages.map((page, index) => {
                const sid = PATH_TO_SUBTOPIC_ID[page.path];
                const pageRead = sid ? completedSubtopics.includes(sid) : false;
                return (
                  <NavLink
                    key={page.path}
                    to={page.path}
                    className={({ isActive }) =>
                      `ns-nav-item${isActive ? " is-active" : ""}${pageRead ? " is-read" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="ns-nav-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="ns-nav-copy">
                      <span className="ns-nav-label">{page.label}</span>
                      <span className="ns-nav-description">{page.description}</span>
                    </span>
                    <span className="ns-nav-status">
                      {pageRead && (
                        <span className="ns-nav-check" title="Read">✓</span>
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="ns-sidebar-footer">
              <Link to="/" className="ns-sidebar-home-btn">← Back to All Topics</Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────── */}
        <main className="ns-main">
          <nav className="ns-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="ns-bc-link">Home</Link>
            <span className="ns-bc-sep">›</span>
            <span className="ns-bc-mid">Number Systems</span>
            <span className="ns-bc-sep">›</span>
            <span className="ns-bc-current">{title}</span>
          </nav>

          <section className="ns-hero">
            <div className="ns-hero-badge">
              <span className="ns-hero-badge-label">Chapter</span>
              <strong className="ns-hero-badge-num">{currentIndex + 1}</strong>
            </div>
            <p className="ns-hero-kicker">Number Systems</p>
            <h1 className="ns-hero-title">{title}</h1>
            {subtitle ? <p className="ns-hero-subtitle">{subtitle}</p> : null}
            {intro ? <p className="ns-hero-intro">{intro}</p> : null}

            {highlights.length > 0 ? (
              <div className="ns-hero-highlights">
                {highlights.map((item) => (
                  <div key={item.title} className="ns-hero-highlight">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="ns-chapter-dots">
              {nsPages.map((p, i) => {
                const sid = PATH_TO_SUBTOPIC_ID[p.path];
                const done = sid ? completedSubtopics.includes(sid) : false;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`ns-dot${i === currentIndex ? " active" : ""}${done ? " done" : ""}`}
                    title={p.label}
                  />
                );
              })}
            </div>
          </section>

          <div className="ns-content">{children}</div>

          {/* ── FOOTER NAV ────────────────────────────────────── */}
          <footer className="ns-footer-nav">
            {prev ? (
              <NavLink to={prev.path} className="ns-footer-link">
                <span className="ns-footer-arrow">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="ns-footer-label">Previous</span>
                  <span className="ns-footer-title">{prev.label}</span>
                </span>
              </NavLink>
            ) : (
              <div />
            )}

            <div className="ns-footer-right">
              {subtopicId && (
                <button
                  className={`ns-mark-read-btn${isRead ? " is-read" : ""}`}
                  onClick={toggleRead}
                  aria-pressed={isRead}
                  aria-label={isRead ? "Mark as unread" : "Mark as read"}
                >
                  <CheckCircleIcon />
                  <span>{isRead ? "Marked as Read" : "Mark as Read"}</span>
                </button>
              )}

              {next ? (
                <NavLink to={next.path} className="ns-footer-link ns-footer-link-next">
                  <span>
                    <span className="ns-footer-label">Next</span>
                    <span className="ns-footer-title">{next.label}</span>
                  </span>
                  <span className="ns-footer-arrow ns-footer-arrow-next">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </NavLink>
              ) : (
                <Link to="/" className="ns-footer-link ns-footer-link-next">
                  <span>
                    <span className="ns-footer-label">All done!</span>
                    <span className="ns-footer-title">Return to Home</span>
                  </span>
                  <span className="ns-footer-arrow ns-footer-arrow-next">
                    <Home size={16} aria-hidden="true" />
                  </span>
                </Link>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default NSLayout;
