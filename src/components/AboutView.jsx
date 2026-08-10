import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal, personalFacts } from "../data/content";

const EASE = [0.16, 1, 0.3, 1];

export default function AboutView({ active, onClose }) {
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
          className="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 3.05, ease: EASE }}
        >
          <div className="about__sheen" aria-hidden="true" />

          <span className="about__corner about__corner--tl" aria-hidden="true" />
          <span className="about__corner about__corner--tr" aria-hidden="true" />
          <span className="about__corner about__corner--bl" aria-hidden="true" />
          <span className="about__corner about__corner--br" aria-hidden="true" />

          <motion.button
            className="about__close mono"
            onClick={onClose}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 3.25 }}
          >
            ◄ CLOSE
          </motion.button>

          <div className="about__scroll">
            <motion.div
              className="about__header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 3.2 }}
            >
              <span className="mono about__eyebrow">SENSOR NOSE · IDENT</span>
              <h2>{personal.name}</h2>
            </motion.div>

            <motion.div
              className="about__panel about__panel--facts"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 3.35, ease: EASE }}
            >
              <span className="mono about__panel-eyebrow">PERSONAL DATA</span>
              <div className="about__facts-grid">
                {personalFacts.map((f) => (
                  <div className="about__fact" key={f.label}>
                    <span className="mono about__fact-label">{f.label}</span>
                    <span className="about__fact-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
