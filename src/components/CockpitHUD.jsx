import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "../data/content";

const EASE = [0.16, 1, 0.3, 1];

function useClock(active) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function TargetFrame({ id }) {
  return (
    <>
      <span className="hud__target-tag mono">TGT {id} · LOCKED</span>
      <span className="hud__target-ring hud__target-ring--outer" />
      <span className="hud__target-ring hud__target-ring--inner" />
      <span className="hud__target-tick hud__target-tick--n" />
      <span className="hud__target-tick hud__target-tick--s" />
      <span className="hud__target-tick hud__target-tick--e" />
      <span className="hud__target-tick hud__target-tick--w" />
    </>
  );
}

export default function CockpitHUD({ active, onClose }) {
  const now = useClock(active);
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

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
          className="hud"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        >
          <div className="hud__vignette" />

          <motion.button
            className="hud__exit mono"
            onClick={onClose}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.75 }}
          >
            ◄ EXIT COCKPIT
          </motion.button>

          <motion.div
            className="hud__tape mono"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            MECHANICAL ENGINEERING · UNIVERSITY OF MINNESOTA
          </motion.div>

          <div className="hud__reticle" aria-hidden="true">
            <span />
            <span />
          </div>

          <motion.a
            className="hud__box hud__box--left hud__target"
            href={`mailto:${personal.email}`}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.85, ease: EASE }}
          >
            <TargetFrame id="01" />
            <span className="hud__box-label mono">EMAIL</span>
            <span className="hud__box-value">{personal.email}</span>
          </motion.a>

          <motion.a
            className="hud__box hud__box--right hud__target"
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.9, ease: EASE }}
          >
            <TargetFrame id="02" />
            <span className="hud__box-label mono">LINKEDIN</span>
            <span className="hud__box-value">CONNECT →</span>
          </motion.a>

          <motion.div
            className="hud__bar"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
          />

          <motion.div
            className="hud__panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1, ease: EASE }}
          >
            <a
              className="hud__panel-row hud__target"
              href={`mailto:${personal.schoolEmail}`}
            >
              <TargetFrame id="03" />
              <span className="mono hud__panel-label">SCHOOL EMAIL</span>
              <span className="hud__panel-value">{personal.schoolEmail}</span>
            </a>
            <div className="hud__panel-row hud__target">
              <TargetFrame id="04" />
              <span className="mono hud__panel-label">BASE</span>
              <span className="hud__panel-value">{personal.location}</span>
            </div>
            <div className="hud__panel-row">
              <span className="mono hud__panel-label">LOCAL</span>
              <span className="hud__panel-value hud__clock">{clock}</span>
            </div>
            <a
              className="hud__btn mono"
              href={personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download
            >
              DOWNLOAD RÉSUMÉ ↓
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
