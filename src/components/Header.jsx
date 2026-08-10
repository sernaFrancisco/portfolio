import { personal } from "../data/content";

export default function Header({ hidden }) {
  return (
    <header className={`site-header${hidden ? " site-header--hidden" : ""}`}>
      <div className="site-header__brand">
        <span className="site-header__mark">✈</span>
        <span className="mono">F. SERNA</span>
      </div>
      <div className="site-header__actions">
        <a
          className="mono site-header__link"
          href={personal.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a
          className="mono site-header__link site-header__link--accent"
          href={personal.resumeUrl}
          target="_blank"
          rel="noreferrer"
          download
        >
          Résumé ↓
        </a>
      </div>
    </header>
  );
}
