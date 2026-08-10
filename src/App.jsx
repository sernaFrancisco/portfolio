import { lazy, Suspense, useState } from "react";
import Header from "./components/Header";
import InfoPanel from "./components/InfoPanel";
import CockpitHUD from "./components/CockpitHUD";
import ProjectsView from "./components/ProjectsView";
import AboutView from "./components/AboutView";
import { personal, f15 } from "./data/content";
import "./App.css";

const Jet3D = lazy(() => import("./components/Jet3D"));

function App() {
  const [activeId, setActiveId] = useState(null);
  const immersive = activeId === "contact" || activeId === "projects" || activeId === "about";

  return (
    <>
      <Header hidden={immersive} />

      <main className="hero">
        <div className="hero__jet-wrap">
          <Suspense fallback={<div className="jet3d-canvas-wrap" />}>
            <Jet3D activeId={activeId} onSelect={setActiveId} />
          </Suspense>
        </div>

        <div className={`hero__overlay${immersive ? " hero__overlay--hidden" : ""}`}>
          <div className="hero__intro">
            <p className="mono eyebrow">MECHANICAL ENGINEERING · UNIVERSITY OF MINNESOTA</p>
            <h1 className="hero__title">{personal.name}</h1>
          </div>

          <div className="hero__bottom">
            <p className="hero__jet-caption mono">{f15.name}</p>
            <p className="hero__hint mono">
              {activeId
                ? "SELECT ANOTHER COMPONENT OR CLOSE PANEL"
                : "DRAG TO ROTATE · SELECT A COMPONENT TO BEGIN"}
            </p>
          </div>
        </div>
      </main>

      <InfoPanel activeId={activeId} onClose={() => setActiveId(null)} />
      <CockpitHUD active={activeId === "contact"} onClose={() => setActiveId(null)} />
      <ProjectsView active={activeId === "projects"} onClose={() => setActiveId(null)} />
      <AboutView active={activeId === "about"} onClose={() => setActiveId(null)} />

      <footer className="site-footer mono">
        <span>© {new Date().getFullYear()} {personal.name}</span>
        <span>{personal.location}</span>
      </footer>
    </>
  );
}

export default App;
