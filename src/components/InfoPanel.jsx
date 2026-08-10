import { AnimatePresence, motion } from "framer-motion";
import { education, internships, workExperience, skills } from "../data/content";
import { HOTSPOTS } from "../data/hotspots";

const EASE = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function Stagger({ children }) {
  return (
    <motion.div className="stagger" variants={containerVariants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

function Reveal({ children, className }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

function EducationContent() {
  return (
    <Stagger>
      <Reveal>
        <h3>{education.school}</h3>
        <p className="panel-lede">
          {education.degree} · {education.location}
        </p>
      </Reveal>
      <Reveal>
        <div className="stat">
          <span className="mono stat__label">EXPECTED GRAD</span>
          <span className="stat__value">{education.expected}</span>
        </div>
      </Reveal>
      <Reveal>
        <p className="mono section-label">RELEVANT COURSEWORK</p>
        <div className="tag-list">
          {education.coursework.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <p className="mono section-label">TECHNICAL SKILLS</p>
        <div className="tag-list">
          {skills.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Reveal>
    </Stagger>
  );
}

function ExperienceEntry({ entry }) {
  return (
    <div className="entry">
      <div className="entry__head">
        <h4>{entry.company}</h4>
        <span className="mono entry__dates">{entry.dates}</span>
      </div>
      <p className="entry__role">
        {entry.role} · {entry.location}
      </p>
      <ul>
        {entry.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function ExperienceContent() {
  return (
    <Stagger>
      <Reveal>
        <p className="mono section-label">INTERNSHIPS</p>
      </Reveal>
      {internships.map((e) => (
        <Reveal key={e.company}>
          <ExperienceEntry entry={e} />
        </Reveal>
      ))}
      <Reveal>
        <p className="mono section-label">WORK EXPERIENCE</p>
      </Reveal>
      {workExperience.map((e) => (
        <Reveal key={e.company}>
          <ExperienceEntry entry={e} />
        </Reveal>
      ))}
    </Stagger>
  );
}

const CONTENT_MAP = {
  education: EducationContent,
  experience: ExperienceContent,
};

const IMMERSIVE_IDS = ["contact", "projects", "about"];

// Panel docks and slides in from the side of the jet its hotspot sits on — port wing (left), starboard wing (right).
const PANEL_SIDE_CLASS = {
  education: "panel--left",
};

const PANEL_ENTRY_X = {
  education: "-100%",
  experience: "100%",
};

export default function InfoPanel({ activeId, onClose }) {
  // "contact", "projects", and "about" are handled by their own full-screen immersive views instead of this side panel.
  const isOpen = Boolean(activeId) && !IMMERSIVE_IDS.includes(activeId);
  const meta = isOpen ? HOTSPOTS.find((h) => h.id === activeId) : null;
  const Body = isOpen ? CONTENT_MAP[activeId] : null;
  const entryX = PANEL_ENTRY_X[activeId] ?? "100%";
  const sideClass = PANEL_SIDE_CLASS[activeId];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="panel-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key={activeId}
            className={`panel${sideClass ? ` ${sideClass}` : ""}`}
            initial={{ x: entryX }}
            animate={{ x: 0 }}
            exit={{ x: entryX }}
            transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
          >
            <div className="panel__header">
              <AnimatePresence mode="wait">
                {meta && (
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <p className="mono eyebrow">{meta.label}</p>
                    <h2>{meta.sub}</h2>
                  </motion.div>
                )}
              </AnimatePresence>
              <button className="panel__close" onClick={onClose} aria-label="Close panel">
                ✕
              </button>
            </div>
            <AnimatePresence mode="wait">
              {Body && (
                <motion.div
                  key={activeId}
                  className="panel__body"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  <Body />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
