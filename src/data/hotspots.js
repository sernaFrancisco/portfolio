// Shared hotspot metadata — kept separate from Jet3D.jsx so components that
// only need labels (e.g. InfoPanel) don't pull the three.js bundle in too.
export const HOTSPOTS = [
  { id: "contact", label: "COCKPIT", sub: "Contact" },
  { id: "about", label: "SENSOR NOSE", sub: "About" },
  { id: "education", label: "PORT WING", sub: "Education" },
  { id: "experience", label: "STBD WING", sub: "Experience" },
  { id: "projects", label: "PROPULSION", sub: "Projects" },
];
