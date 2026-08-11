import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/content";

const EASE = [0.16, 1, 0.3, 1];

export default function ProjectsView({ active, onClose }) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="blueprint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.35, ease: EASE }}
        >
          <div className="blueprint__grid" aria-hidden="true" />
          <div className="blueprint__vignette" aria-hidden="true" />

          <span className="blueprint__corner blueprint__corner--tl" aria-hidden="true" />
          <span className="blueprint__corner blueprint__corner--tr" aria-hidden="true" />
          <span className="blueprint__corner blueprint__corner--bl" aria-hidden="true" />
          <span className="blueprint__corner blueprint__corner--br" aria-hidden="true" />

          <motion.button
            className="blueprint__close mono"
            onClick={onClose}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 1.55 }}
          >
            ◄ CLOSE
          </motion.button>

          <div className="blueprint__scroll">
            <motion.div
              className="blueprint__header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <span className="mono blueprint__eyebrow">
                {projects.length} SHEET{projects.length === 1 ? "" : "S"}
              </span>
              <h2>Projects</h2>
            </motion.div>

            {projects.map((p, i) => (
              <motion.section
                className="blueprint__sheet"
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.65 + i * 0.12, ease: EASE }}
              >
                <div className="blueprint__sheet-head">
                  <h3>{p.name}</h3>
                </div>

                {p.images && p.images.length > 0 ? (
                  <div className="blueprint__gallery">
                    <figure className="blueprint__hero-image">
                      <img src={p.images[0].src} alt={p.images[0].caption || p.name} />
                      {p.images[0].caption && (
                        <figcaption className="mono">{p.images[0].caption}</figcaption>
                      )}
                    </figure>
                    {p.images.length > 1 && (
                      <div className="blueprint__thumb-row">
                        {p.images.slice(1).map((img, j) => (
                          <figure className="blueprint__thumb" key={j}>
                            <img src={img.src} alt={img.caption || p.name} loading="lazy" />
                            {img.caption && <figcaption className="mono">{img.caption}</figcaption>}
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="blueprint__placeholder">
                    <span className="mono">RENDER PENDING</span>
                  </div>
                )}

                <p className="blueprint__description">{p.description}</p>
              </motion.section>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
