import React, { useState, useEffect, useCallback } from "react";

/**
 * Minimalist photography portfolio.
 * Drop into a Vite or CRA project as src/App.js — no extra dependencies needed.
 * Swap the `photos` array below with your own images (any URL or local import works).
 *
 * IMAGE PROTECTION — READ THIS BEFORE PUBLISHING TO A PUBLIC REPO:
 * The no-right-click / no-drag code below only stops casual saving; it does
 * NOT stop screenshots and can't. The one change that actually matters:
 * 1. Never commit full-resolution originals to the repo. Export web copies
 *    at ~1600px on the long edge, 72dpi, moderate JPEG compression — that's
 *    unusable for prints but fine for a browser.
 * 2. Host images somewhere outside the git history if you can (e.g. an
 *    image CDN, Cloudinary, or a private bucket you reference by URL) so
 *    `git clone` doesn't hand someone your asset folder directly.
 * 3. A small visible watermark (see the About photo below) survives a
 *    screenshot even when metadata doesn't.
 *
 * Note: the lightbox has a deliberate "Download" link on the full-size
 * view. That's an intentional exception to the right-click/drag blocking
 * above — anyone who opens a photo can save it on purpose. Remove the
 * `downloadBtn` block in the lightbox JSX if you'd rather not offer that.
 */

/**
 * Place your images in `public/photos/` (Vite) or `public/photos/` (CRA) —
 * both serve the `public` folder at the site root, so `/photos/VNK_1.jpg`
 * resolves correctly in either setup without any import statements.
 */
const PHOTO_COUNT = 38;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    src: `/photos/VNK_${n}.jpg`,
    filename: `VNK_${n}.jpg`,
    frame: String(n).padStart(3, "0"),
  };
});

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

  // Blocks the "right-click → save image" and drag-to-desktop shortcuts.
  // This is a deterrent, not real protection — anyone can still screenshot
  // the page. See the note near the `photos` array about the actual fix.
  const preventSave = useCallback((e) => e.preventDefault(), []);

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

      <section id="work" className="gallery-grid" style={styles.gallery}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            className="frame"
            style={{ ...styles.frameBtn, animationDelay: `${i * 60}ms` }}
            onClick={() => setActiveId(p.id)}
            aria-label={`Open frame ${p.frame}`}
          >
            <span className="frame-imgwrap" style={styles.imgWrap} onContextMenu={preventSave}>
              <img
                src={p.src}
                alt={`Frame ${p.frame}`}
                style={styles.img}
                loading="lazy"
                draggable={false}
                onDragStart={preventSave}
              />
            </span>
            <span style={styles.captionRow}>
              <span style={styles.captionFrame}>Fr. {p.frame}</span>
            </span>
          </button>
        ))}
      </section>

      <section id="about" className="about-grid" style={styles.about}>
        <div style={styles.aboutText}>
          <p style={styles.aboutParagraph}>
            Based in Germany, I explore the world through photography with a
            deep appreciation for people, culture, places, and the moments
            that make each one unique.
          </p>
          <p style={styles.aboutParagraph}>
            My work brings together travel, street, landscape, portrait, and
            documentary photography. I'm drawn to authentic experiences,
            whether it's a local festival, a quiet street, a beautiful
            landscape, or a simple moment that many people would walk past.
            I believe every place has its own character, and every person has
            a story worth remembering.
          </p>
          <p style={styles.aboutParagraph}>
            For me, photography is more than capturing what something looks
            like. It's about preserving the feeling of being there. A
            photograph has the ability to bring back emotions, memories, and
            moments that words often cannot describe.
          </p>
          <p style={styles.aboutParagraph}>
            Every journey teaches me to see the world a little differently.
            Exploring new places, learning about different cultures, and
            meeting people along the way continue to shape the way I
            photograph and the way I experience life.
          </p>
          <p style={styles.aboutParagraph}>
            I believe every place has something worth discovering.
            Photography is simply my way of sharing it.
          </p>
          <p style={styles.aboutClosing}>
            Thank you for visiting my website. If my work speaks to you,
            whether it's to share an idea, start a conversation, or explore a
            creative opportunity together, I'd be delighted to hear from you.
          </p>
        </div>
        <div className="about-photo" style={styles.aboutImgWrap} onContextMenu={preventSave}>
          <img
            src="vnk.jpeg"
            alt="Portrait of the photographer"
            style={styles.aboutImg}
            draggable={false}
            onDragStart={preventSave}
          />
          <span style={styles.watermark}>N. Kashyap</span>
        </div>
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
            <img src={active.src} alt={`Frame ${active.frame}`} style={styles.lightboxImg} />
            <figcaption style={styles.lightboxCaption}>
              <span>Fr. {active.frame}</span>
              <a
                href={active.src}
                download={active.filename}
                style={styles.downloadBtn}
              >
                Download ↓
              </a>
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
    justifyContent: "flex-start",
    width: "100%",
    marginTop: "12px",
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
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8vw",
    alignItems: "start",
    padding: "12vh 6vw",
  },
  aboutText: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    maxWidth: "480px",
  },
  aboutParagraph: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 300,
    fontSize: "1.05rem",
    lineHeight: 1.6,
    color: "#3A3833",
    margin: 0,
  },
  aboutClosing: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: "0.92rem",
    lineHeight: 1.6,
    color: "#68645A",
    fontStyle: "italic",
    margin: "6px 0 0",
    paddingTop: "18px",
    borderTop: "1px solid #D8D5CC",
  },
  aboutImgWrap: {
    position: "sticky",
    top: "100px",
    width: "100%",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    background: "#E3E1DA",
    userSelect: "none",
  },
  aboutImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    pointerEvents: "none",
  },
  watermark: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.75)",
    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
    letterSpacing: "0.02em",
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
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#D8D5CC",
    fontSize: "0.82rem",
    letterSpacing: "0.02em",
  },
  downloadBtn: {
    color: "#F3F2EE",
    textDecoration: "none",
    border: "1px solid rgba(243,242,238,0.4)",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "0.78rem",
    letterSpacing: "0.03em",
    transition: "background 0.2s ease, color 0.2s ease",
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

  a[download]:hover {
    background: #F3F2EE;
    color: #1C1B19 !important;
  }

  @media (max-width: 1100px) {
    .gallery-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 760px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 22px 16px !important; }
    .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .about-photo { position: static !important; }
  }
  @media (max-width: 460px) {
    .gallery-grid { grid-template-columns: repeat(1, 1fr) !important; }
  }

  button:focus-visible, a:focus-visible { outline: 2px solid #4B5A43; outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) {
    .frame { animation: none; opacity: 1; }
    img { transition: none !important; }
  }
`;