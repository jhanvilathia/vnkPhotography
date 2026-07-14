import React, { useState, useEffect, useCallback } from "react";

/**
 * Minimalist photography portfolio.
 * Drop into a Vite or CRA project as src/App.js — no extra dependencies needed.
 * Swap the `photos` array below with your own images (any URL or local import works).
 */

const photos = [
  { id: 1, src: "https://picsum.photos/id/1015/900/1125", title: "Riverbend", place: "Bavaria", year: "2026", frame: "001" },
  { id: 2, src: "https://picsum.photos/id/1024/900/1125", title: "Low Light", place: "Munich", year: "2025", frame: "014" },
  { id: 3, src: "https://picsum.photos/id/1039/900/1125", title: "Terrace", place: "Lindau", year: "2026", frame: "022" },
  { id: 4, src: "https://picsum.photos/id/1043/900/1125", title: "Still Water", place: "Chiemsee", year: "2025", frame: "031" },
  { id: 5, src: "https://picsum.photos/id/1059/900/1125", title: "Passage", place: "Prague", year: "2026", frame: "045" },
  { id: 6, src: "https://picsum.photos/id/1074/900/1125", title: "Quiet Hour", place: "Franconia", year: "2025", frame: "052" },
  { id: 7, src: "https://picsum.photos/id/1084/900/1125", title: "Grain", place: "Munich", year: "2026", frame: "060" },
  { id: 8, src: "https://picsum.photos/id/110/900/1125", title: "Overcast", place: "Halkidiki", year: "2025", frame: "067" },
];

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;1,9..144,400&family=Work+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
    const t = setTimeout(() => setLoaded(true), 60);
    return () => {
      document.head.removeChild(link);
      clearTimeout(t);
    };
  }, []);

  const active = photos.find((p) => p.id === activeId);

  const closeLightbox = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox]);

  return (
    <div style={styles.page} className={loaded ? "loaded" : ""}>
      <style>{css}</style>

      <header style={styles.header}>
        <span style={styles.logo}>Nithin Kashyap</span>
        <nav style={styles.nav}>
          <a href="#work" style={styles.navLink}>Work</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Photographs, <em style={styles.heroEm}>mostly&nbsp;quiet</em>.
        </h1>
        <p style={styles.heroSub}>
          A running contact sheet of light, water, and the odd afternoon —
          shot on whatever camera was in reach.
        </p>
      </section>

      <section id="work" style={styles.gallery}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            className="frame"
            style={{ ...styles.frameBtn, animationDelay: `${i * 60}ms` }}
            onClick={() => setActiveId(p.id)}
            aria-label={`Open ${p.title}`}
          >
            <span className="frame-imgwrap" style={styles.imgWrap}>
              <img src={p.src} alt={p.title} style={styles.img} loading="lazy" />
            </span>
            <span style={styles.captionRow}>
              <span style={styles.captionTitle}>{p.title}</span>
              <span style={styles.captionFrame}>Fr. {p.frame}</span>
            </span>
            <span style={styles.captionMeta}>{p.place} — {p.year}</span>
          </button>
        ))}
      </section>

      <section id="about" style={styles.about}>
        <p style={styles.aboutText}>
          I photograph the pauses between events — a terrace after rain, the
          five minutes before a train. Based in Munich, shooting wherever the
          light insists.
        </p>
      </section>

      <footer id="contact" style={styles.footer}>
        <a href="mailto:hello@example.com" style={styles.footerLink}>
          hello@example.com
        </a>
        <span style={styles.footerNote}>© {new Date().getFullYear()} — Munich</span>
      </footer>

      {active && (
        <div style={styles.lightbox} onClick={closeLightbox}>
          <button style={styles.closeBtn} onClick={closeLightbox} aria-label="Close">
            ×
          </button>
          <figure style={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.title} style={styles.lightboxImg} />
            <figcaption style={styles.lightboxCaption}>
              Fr. {active.frame} — {active.title}, {active.place} {active.year}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Work Sans', sans-serif",
    background: "#F3F2EE",
    color: "#1C1B19",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 6vw",
  },
  logo: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.05rem",
    letterSpacing: "0.02em",
  },
  nav: { display: "flex", gap: "28px" },
  navLink: {
    color: "#4B5A43",
    textDecoration: "none",
    fontSize: "0.85rem",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  hero: {
    padding: "8vh 6vw 6vh",
    maxWidth: "780px",
  },
  heroTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 300,
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
    lineHeight: 1.08,
    margin: 0,
  },
  heroEm: { fontStyle: "italic", color: "#4B5A43" },
  heroSub: {
    marginTop: "20px",
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#68645A",
    maxWidth: "480px",
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "28px 24px",
    padding: "0 6vw 4vh",
  },
  frameBtn: {
    position: "relative",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    background: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    textAlign: "left",
  },
  imgWrap: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    background: "#E3E1DA",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.6s cubic-bezier(.2,.7,.2,1)",
  },
  captionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    marginTop: "14px",
  },
  captionTitle: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontSize: "1rem",
    color: "#1C1B19",
  },
  captionFrame: {
    fontSize: "0.68rem",
    letterSpacing: "0.06em",
    color: "#8A8578",
  },
  captionMeta: {
    display: "block",
    marginTop: "3px",
    fontSize: "0.78rem",
    letterSpacing: "0.02em",
    color: "#8A8578",
  },
  about: {
    padding: "12vh 6vw",
    maxWidth: "620px",
  },
  aboutText: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 300,
    fontSize: "1.35rem",
    lineHeight: 1.5,
    color: "#3A3833",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 6vw 40px",
    borderTop: "1px solid #D8D5CC",
  },
  footerLink: {
    color: "#1C1B19",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
  footerNote: {
    fontSize: "0.78rem",
    color: "#8A8578",
  },
  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(20,19,17,0.94)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "5vh 5vw",
  },
  closeBtn: {
    position: "absolute",
    top: "24px",
    right: "5vw",
    background: "none",
    border: "none",
    color: "#F3F2EE",
    fontSize: "2rem",
    lineHeight: 1,
    cursor: "pointer",
  },
  lightboxFigure: {
    margin: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    maxHeight: "90vh",
  },
  lightboxImg: {
    maxHeight: "82vh",
    maxWidth: "88vw",
    objectFit: "contain",
  },
  lightboxCaption: {
    color: "#D8D5CC",
    fontSize: "0.82rem",
    letterSpacing: "0.02em",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  a:hover { opacity: 0.7; }

  .frame { opacity: 0; animation: rise 0.6s ease forwards; }
  @keyframes rise {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .frame:hover img { transform: scale(1.045); }

  @media (max-width: 1100px) {
    section[style*="grid-template-columns"] { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 760px) {
    section[style*="grid-template-columns"] { grid-template-columns: repeat(2, 1fr) !important; gap: 22px 16px !important; }
  }
  @media (max-width: 460px) {
    section[style*="grid-template-columns"] { grid-template-columns: repeat(1, 1fr) !important; }
  }

  button:focus-visible, a:focus-visible { outline: 2px solid #4B5A43; outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) {
    .frame { animation: none; opacity: 1; }
    img { transition: none !important; }
  }
`;