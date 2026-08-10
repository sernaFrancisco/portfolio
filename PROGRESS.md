# Portfolio — Progress Summary

A mechanical engineering portfolio for Francisco D. Serna (Junior ME, University of Minnesota),
built around an interactive 3D fighter jet as the central navigation device. Different parts of
the jet open different portfolio sections. Built with **React + Vite**, **React Three Fiber**
(`@react-three/fiber` / `drei`) for the 3D scene, and **Framer Motion** for UI transitions.

## Where things live

- `src/App.jsx` — top-level layout, wires the 3D scene together with the side panel and the
  three full-screen "immersive" views.
- `src/components/Jet3D.jsx` — the 3D scene: model loading, materials, hotspot markers, sky/cloud
  backdrop, and the custom camera rig that drives every transition.
- `src/components/InfoPanel.jsx` — right-side slide-in panel for Education / Experience /
  Activities.
- `src/components/CockpitHUD.jsx` + `src/styles/cockpit.css` — full-screen green HUD overlay for
  the Contact section.
- `src/components/ProjectsView.jsx` + `src/styles/blueprint.css` — full-screen dark blueprint
  takeover for CAD Projects.
- `src/components/AboutView.jsx` + `src/styles/about.css` — full-screen light "spec sheet"
  takeover for the About section.
- `src/data/content.js` — all site copy (personal info, education, experience, activities,
  skills, CAD projects, personal facts, F-15 fact sheet data) lives here.
- `src/data/hotspots.js` — the list of clickable jet components and which section each opens.
- `public/models/jet.glb` — the 3D aircraft model.
- `src/assets/f15-blueprint.png` — F-15 three-view line drawing used as the About page backdrop.

## The 3D model

- Started with a CC-BY-licensed F-35 model, later swapped for the user's own SolidWorks-designed
  aircraft (exported from SolidWorks as GLTF, converted to a single optimized `.glb`).
- Materials tuned for a "polished aluminum" look: metal + a custom-baked reflection environment
  (a neutral grey studio gradient, not the visible blue sky) so the fuselage actually looks
  reflective instead of flat/dark. Canopy glass uses a physical material with clearcoat.
- A tail-number decal ("SERNA · N28 · ME") is projected directly onto the fin geometry using
  `DecalGeometry`, computed once at load time via raycasting against the actual mesh.
- Every hotspot marker position was located by raycasting the real geometry (not guessed), so
  each label sits directly on its physical component (nose, cockpit, wings, tail fin, engine
  nozzle).

## Interactions per jet component

| Hotspot | Opens | Behavior |
|---|---|---|
| Cockpit | Contact | Camera dives into the cockpit; green monochrome HUD overlay with circular "target lock" reticles around each contact point (email, LinkedIn, school email, base/location, résumé download), centrally clustered rather than spread across the screen. |
| Sensor Nose | About | Camera settles on a front-of-nose view, dives to a fixed low "ground observer" altitude just ahead of the nose, then translates in a straight line from ahead of the nose to past the tail at that same constant height, looking straight up — the static jet reads as flying directly overhead. Blurs into a full-screen page using the F-15 three-view blueprint as a backdrop, with a "Personal Data" panel and an "Airframe Reference" F-15 Eagle spec sheet (credited to the U.S. Air Force fact sheet). |
| Propulsion | CAD Projects | Camera rotates to a rear view framing the engine thrusters, holds, then dollies straight back along that sightline (target anchored on the engines) so the jet shrinks toward the vanishing point and blurs into a dark blueprint-style gallery of CAD projects (Spider-Bot, IoT Smart Trash Can). |
| Port Wing / Stbd Wing / Stabilizer | Education / Experience / Activities | Standard slide-in side panel. |

All three full-screen transitions share the same camera rig logic: while returning to the default
landing view, a distance-proportional blur stays active until the camera actually arrives back,
so the (sometimes long) return trip never reads as an abrupt snap.

## Known limitations

- The SolidWorks model is an exterior shell only (no modeled cockpit interior), so the cockpit
  HUD view shows mostly sky with a hint of the nose below, rather than dashboard detail.
- The F-15 fact-sheet figures were cross-checked against Wikipedia / Milavia / NASM sources
  rather than fetched directly from af.mil, since that domain blocks automated requests — worth
  a manual spot-check against the live fact sheet if precision matters.
