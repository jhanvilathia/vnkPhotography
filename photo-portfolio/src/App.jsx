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
 *
 * ============================================================
 * EMAIL-CAPTURE POPUP — SETUP REQUIRED (3 steps, ~5 minutes)
 * ============================================================
 * A static site (GitHub Pages, Netlify, etc.) has no backend, so it can't
 * send email on its own. This uses Formspree — a free form-relay service —
 * to forward whatever the visitor types straight to your inbox.
 *
 * 1. Go to https://formspree.io and make a free account (free tier =
 *    50 submissions/month, plenty for this).
 * 2. Create a new form, and set the notification email to
 *    jhanvilathia49@gmail.com — Formspree will verify that address once.
 * 3. Formspree gives you an endpoint that looks like:
 *      https://formspree.io/f/abcd1234
 *    Paste it into FORMSPREE_ENDPOINT below, replacing the placeholder.
 *
 * Until you paste a real endpoint, the form will show a friendly error
 * instead of silently failing — so you'll know right away if it's not
 * wired up yet.
 *
 * SPAM PROTECTION: this code includes a honeypot field (bots that
 * auto-fill every input trip it, and get silently dropped before any
 * network request is even made — doesn't touch your quota). For the
 * bigger lever, also turn on reCAPTCHA in the Formspree dashboard:
 * your form → Settings → Spam Filtering → enable reCAPTCHA + the
 * built-in Akismet filter. That combo blocks the overwhelming majority
 * of bot/bulk submissions before they count against the monthly limit.
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgawnbra";

// Full-size originals are attached to this GitHub Release (the site itself
// only ships the smaller web copies in public/photos).
const ORIGINALS_URL =
  "https://github.com/jhanvilathia/vnkPhotography/releases/download/originals";

const PHOTO_COUNT = 38;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    src: `${import.meta.env.BASE_URL}photos/VNK_${n}.jpg`,
    download: `${ORIGINALS_URL}/VNK_${n}.jpg`,
    filename: `VNK_${n}.jpg`,
    frame: String(n).padStart(3, "0"),
  };
});

function CalendarModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const gotchaRef = React.useRef(null);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If the honeypot got filled in, it's a bot — silently drop it without
    // hitting the network or the Formspree quota at all.
    if (gotchaRef.current && gotchaRef.current.value) {
      setStatus("sent"); // pretend success so the bot doesn't retry
      setTimeout(onClose, 1200);
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      // Placeholder still in place — tell the developer, not the visitor.
      console.warn(
        "CalendarModal: FORMSPREE_ENDPOINT is still a placeholder. See setup notes at the top of App.js."
      );
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          _subject: "New calendar request from portfolio site",
          message: `${email} wants the printable yearly calendar.`,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        localStorage.setItem("calendarModalDismissed", "true");
        setTimeout(onClose, 1800);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const dismiss = () => {
    localStorage.setItem("calendarModalDismissed", "true");
    onClose();
  };

  return (
    <div style={modalStyles.overlay} onClick={dismiss}>
      <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeBtn} onClick={dismiss} aria-label="Close">
          ×
        </button>

        {status === "sent" ? (
          <>
            <h3 style={modalStyles.heading}>Sent. <em style={modalStyles.em}>Go check your inbox.</em></h3>
            <p style={modalStyles.sub}>Your twelve-month excuse to procrastinate is on its way.</p>
          </>
        ) : (
          <>
            <h3 style={modalStyles.heading}>
              Before you scroll, <em style={modalStyles.em}>a gift.</em>
            </h3>
            <p style={modalStyles.sub}>
              Drop your email and I'll send you a printable yearly calendar made from
              these frames. No spam, just twelve months of an excuse to hang
              something on your wall.
            </p>
            <form onSubmit={handleSubmit} style={modalStyles.form}>
              {/* Honeypot: invisible to real visitors, but bots that auto-fill
                  every field on a page will fill this in too. Formspree
                  silently discards any submission where it's non-empty. */}
              <input
                ref={gotchaRef}
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
                style={modalStyles.honeypot}
                aria-hidden="true"
              />
              <input
                type="email"
                required
                placeholder="you@somewhere.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                style={modalStyles.input}
              />
              <button
                type="submit"
                style={modalStyles.submitBtn}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send me the calendar"}
              </button>
            </form>
            {status === "error" && (
              <p style={modalStyles.errorText}>
                Couldn't send that, double-check the email, or try again in a moment.
              </p>
            )}
            <p style={modalStyles.finePrint}>One email. Twelve photos. Zero small talk.</p>
            <button style={modalStyles.laterLink} onClick={dismiss}>
              Maybe later, I'll just look.
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [loadedPhotoIds, setLoadedPhotoIds] = useState(() => new Set());

  const markPhotoLoaded = useCallback((id) => {
    setLoadedPhotoIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

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

  // Show the calendar popup once per visitor (per browser), after a short delay
  // so it doesn't slam the page the instant it loads.
  useEffect(() => {
    const alreadyDismissed = localStorage.getItem("calendarModalDismissed");
    if (!alreadyDismissed) {
      const t = setTimeout(() => setShowCalendarModal(true), 1200);
      return () => clearTimeout(t);
    }
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

      {showCalendarModal && (
        <CalendarModal onClose={() => setShowCalendarModal(false)} />
      )}

      <header style={styles.header}>
        <span style={styles.logo}>Nithin Kashyap Venkatesha</span>
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
          A running contact sheet of light, water, and the odd afternoon,
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
              {!loadedPhotoIds.has(p.id) && (
                <span className="photo-spinner" aria-hidden="true" />
              )}
              <img
                src={p.src}
                alt={`Frame ${p.frame}`}
                style={{
                  ...styles.img,
                  opacity: loadedPhotoIds.has(p.id) ? 1 : 0,
                }}
                loading="lazy"
                draggable={false}
                onDragStart={preventSave}
                onLoad={() => markPhotoLoaded(p.id)}
                onError={() => markPhotoLoaded(p.id)}
              />
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
          {!loadedPhotoIds.has("about") && (
            <span className="photo-spinner" aria-hidden="true" />
          )}
          <img
            src={`${import.meta.env.BASE_URL}vnk.jpeg`}
            alt="Portrait of the photographer"
            style={{ ...styles.aboutImg, opacity: loadedPhotoIds.has("about") ? 1 : 0 }}
            draggable={false}
            onDragStart={preventSave}
            onLoad={() => markPhotoLoaded("about")}
            onError={() => markPhotoLoaded("about")}
          />
          <span style={styles.watermark}>N. Kashyap</span>
        </div>
      </section>

      <footer id="contact" style={styles.footer}>
        <a href="mailto:vnithinkashyap@gmail.com" style={styles.footerLink}>
          vnithinkashyap@gmail.com
        </a>
        <span style={styles.footerNote}>© {new Date().getFullYear()} Munich</span>
      </footer>

      {active && (
        <div style={styles.lightbox} onClick={closeLightbox}>
          <button style={styles.closeBtn} onClick={closeLightbox} aria-label="Close">
            ×
          </button>
          <figure style={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={`Frame ${active.frame}`} style={styles.lightboxImg} />
            <figcaption style={styles.lightboxCaption}>
              <a
                href={active.download}
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

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(20,19,17,0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "5vw",
  },
  card: {
    position: "relative",
    background: "#F3F2EE",
    borderRadius: "14px",
    padding: "40px 36px",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
    fontFamily: "'Work Sans', sans-serif",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    color: "#8A8578",
    cursor: "pointer",
    lineHeight: 1,
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 300,
    fontSize: "1.7rem",
    lineHeight: 1.2,
    margin: "0 0 12px",
    color: "#1C1B19",
  },
  em: { fontStyle: "italic", color: "#4B5A43" },
  sub: {
    fontSize: "0.92rem",
    lineHeight: 1.55,
    color: "#68645A",
    margin: "0 0 22px",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "12px 14px",
    fontSize: "0.92rem",
    border: "1px solid #D8D5CC",
    borderRadius: "8px",
    background: "#fff",
    fontFamily: "'Work Sans', sans-serif",
    outline: "none",
  },
  submitBtn: {
    padding: "12px 14px",
    fontSize: "0.88rem",
    letterSpacing: "0.02em",
    border: "none",
    borderRadius: "8px",
    background: "#1C1B19",
    color: "#F3F2EE",
    cursor: "pointer",
  },
  errorText: {
    fontSize: "0.8rem",
    color: "#B0503F",
    margin: "10px 0 0",
  },
  finePrint: {
    fontSize: "0.72rem",
    color: "#8A8578",
    marginTop: "16px",
    marginBottom: "6px",
  },
  laterLink: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "0.78rem",
    color: "#8A8578",
    textDecoration: "underline",
    cursor: "pointer",
  },
  honeypot: {
    position: "absolute",
    left: "-9999px",
    width: "1px",
    height: "1px",
    opacity: 0,
    pointerEvents: "none",
  },
};

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
    color: "#68645A"
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
    position: "relative",
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
    transition: "transform 0.6s cubic-bezier(.2,.7,.2,1), opacity 0.4s ease",
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

  .photo-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 22px;
    height: 22px;
    margin: -11px 0 0 -11px;
    border: 2px solid rgba(0,0,0,0.12);
    border-top-color: #4B5A43;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .frame { animation: none; opacity: 1; }
    img { transition: none !important; }
    .photo-spinner { animation-duration: 1.6s; }
  }
`;