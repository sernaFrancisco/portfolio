import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress, Html, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
import { HOTSPOTS } from "../data/hotspots";

const MODEL_URL = "/models/jet.glb";
const MODEL_CENTER = [0, -3.4576, 6.209];
const MODEL_SCALE = 33;
const SUN_POSITION = [60, 45, -40];

const DEFAULT_CAM_POS = new THREE.Vector3(32, 12, 38);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_FOV = 34;
const COCKPIT_CAM_POS = new THREE.Vector3(0, 1.15, 6.0);
const COCKPIT_TARGET = new THREE.Vector3(0, 0.9, 40);
const COCKPIT_FOV = 74;

// "projects" mode: rotate to a rear view looking at the engine thrusters, hold, then dolly
// straight back along that same sightline (target stays anchored on the engines) so the jet
// shrinks toward the vanishing point and blurs out before the blueprint backdrop fades in.
const BACK_CAM_POS = new THREE.Vector3(0, 2.2, -28);
const BACK_TARGET = new THREE.Vector3(0, 0.3, -13);
const BACK_FOV = 32;
const FAR_CAM_POS = new THREE.Vector3(0, 2.2, -95);
const FAR_FOV = 38;
const BACK_HOLD_SECONDS = 1.05;
const DEPART_SECONDS = 0.85;
const MAX_BLUR_PX = 34;
const RETURN_BLUR_PX = 22;

// "about" mode: settle on a front-of-nose view, dive down to a fixed low "ground observer"
// vantage just ahead of the nose, then translate straight along Z at that same low altitude
// while looking locked straight up — the jet never moves, but because the camera slides
// underneath it nose-to-tail, the (static) jet reads as flying directly overhead. Blur ramps
// in during the last stretch of the flyover, while the camera is still down low — it never
// climbs back up, so the shot doesn't end on a top-down note.
const ABOUT_CAM_POS = new THREE.Vector3(0, 1.6, 27);
const ABOUT_TARGET = new THREE.Vector3(0, 1.0, 8);
const ABOUT_FOV = 34;
const ABOUT_FLYOVER_Y = -5.8;
const ABOUT_FLYOVER_LOOK_Y = 1.2;
const ABOUT_FLYOVER_START_Z = 17;
const ABOUT_FLYOVER_END_Z = -17;
const ABOUT_FLYOVER_START = new THREE.Vector3(0, ABOUT_FLYOVER_Y, ABOUT_FLYOVER_START_Z);
const ABOUT_FLYOVER_START_TARGET = new THREE.Vector3(0, ABOUT_FLYOVER_LOOK_Y, ABOUT_FLYOVER_START_Z);
const ABOUT_FLYOVER_FOV = 52;
const ABOUT_DIVE_SECONDS = 0.65;
const ABOUT_FLYOVER_SECONDS = 1.7;
const ABOUT_HOLD_SECONDS = 1.0;
const ABOUT_BLUR_START = 0.62;

const POSITIONS = {
  contact: [0, 1.2, 6.5],
  about: [0, -2.15, 13.6],
  education: [-7.5, -1.1, -6.5],
  experience: [7.5, -1.1, -6.5],
  projects: [1.0, -1.9, -14.5],
};

const HOTSPOTS_3D = HOTSPOTS.map((h) => ({ ...h, position: POSITIONS[h.id] }));

function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((node) => {
      if (!node.isMesh || !node.material) return;
      node.castShadow = true;
      node.receiveShadow = true;

      const mat = node.material;
      if (mat.name === "polishedaluminum") {
        mat.color.set("#53575d");
        mat.roughness = 0.16;
        mat.metalness = 1;
        mat.envMapIntensity = 1.9;
      } else if (mat.name === "clearthickglass") {
        node.material = new THREE.MeshPhysicalMaterial({
          color: "#3a4248",
          transparent: true,
          opacity: 0.55,
          roughness: 0.06,
          metalness: 0,
          ior: 1.5,
          reflectivity: 0.6,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          envMapIntensity: 1.2,
          side: THREE.DoubleSide,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} position={MODEL_CENTER} scale={MODEL_SCALE} rotation={[0, Math.PI, 0]} />;
}

function makeStudioTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#5a5e64");
  gradient.addColorStop(0.35, "#82878e");
  gradient.addColorStop(0.55, "#a4aab2");
  gradient.addColorStop(0.68, "#4c5056");
  gradient.addColorStop(1, "#1e2124");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function StudioDome() {
  const texture = useMemo(() => makeStudioTexture(), []);
  return (
    <mesh>
      <sphereGeometry args={[300, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function ReflectionEnvironment() {
  return (
    <Environment resolution={512} background={false}>
      <StudioDome />
      <mesh position={[170, 130, -110]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial color="#fffaf0" toneMapped={false} />
      </mesh>
    </Environment>
  );
}

function makeTailNumberTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e9ebee";
  ctx.font = "700 96px 'Arial Narrow', Arial, sans-serif";
  ctx.fillText("SERNA", 256, 70);
  ctx.font = "600 56px 'Arial Narrow', Arial, sans-serif";
  ctx.fillStyle = "#c3c8cf";
  ctx.fillText("N28 · ME", 256, 142);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const DECAL_TARGETS = [
  { id: "tail-r", origin: [15, 1.6, -11], dir: [-1, 0, 0], size: [1.7, 0.64, 0.4] },
  { id: "tail-l", origin: [-15, 1.6, -11], dir: [1, 0, 0], size: [1.7, 0.64, 0.4] },
];

function Decals({ groupRef }) {
  const [decals, setDecals] = useState([]);
  const tailTexture = useMemo(() => makeTailNumberTexture(), []);

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const savedRotation = group.rotation.y;
    group.rotation.y = 0;
    group.updateWorldMatrix(true, true);

    let targetMesh = null;
    group.traverse((node) => {
      if (node.isMesh && node.material && node.material.name === "polishedaluminum") {
        targetMesh = node;
      }
    });

    if (targetMesh) {
      const raycaster = new THREE.Raycaster();
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(targetMesh.matrixWorld);
      const built = [];

      for (const target of DECAL_TARGETS) {
        raycaster.set(new THREE.Vector3(...target.origin), new THREE.Vector3(...target.dir));
        const hits = raycaster.intersectObject(targetMesh, false);
        if (!hits.length) continue;
        const hit = hits[0];
        const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
        const position = hit.point.clone().addScaledVector(normal, 0.015);
        const dummy = new THREE.Object3D();
        dummy.position.copy(position);
        dummy.lookAt(position.clone().add(normal));

        const geometry = new DecalGeometry(targetMesh, position, dummy.rotation, new THREE.Vector3(...target.size));
        built.push({ id: target.id, geometry });
      }

      setDecals(built);
    }

    group.rotation.y = savedRotation;
  }, [groupRef]);

  return (
    <>
      {decals.map((d) => (
        <mesh key={d.id} geometry={d.geometry} renderOrder={2}>
          <meshStandardMaterial
            map={tailTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-4}
            roughness={0.5}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function AutoRotate({ groupRef, paused }) {
  useFrame((_, delta) => {
    if (!paused && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });
  return null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CameraRig({ groupRef, controlsRef, mode, canvasWrapRef }) {
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3().copy(DEFAULT_CAM_POS));
  const camTarget = useRef(new THREE.Vector3().copy(DEFAULT_TARGET));
  const blur = useRef(0);
  const modeElapsed = useRef(0);
  const prevMode = useRef(mode);

  useFrame((_, delta) => {
    if (mode !== prevMode.current) {
      modeElapsed.current = 0;
      prevMode.current = mode;
    } else {
      modeElapsed.current += delta;
    }

    let waypointPos = DEFAULT_CAM_POS;
    let waypointTarget = DEFAULT_TARGET;
    let waypointFov = DEFAULT_FOV;
    let targetBlur = 0;
    let smoothing = 2.8;
    let aboutSwooping = false;
    const distanceToDefaultCam = camPos.current.distanceTo(DEFAULT_CAM_POS);

    if (mode === "cockpit") {
      waypointPos = COCKPIT_CAM_POS;
      waypointTarget = COCKPIT_TARGET;
      waypointFov = COCKPIT_FOV;
    } else if (mode === "projects") {
      waypointTarget = BACK_TARGET;
      if (modeElapsed.current < BACK_HOLD_SECONDS) {
        waypointPos = BACK_CAM_POS;
        waypointFov = BACK_FOV;
      } else {
        waypointPos = FAR_CAM_POS;
        waypointFov = FAR_FOV;
        const departT = Math.min((modeElapsed.current - BACK_HOLD_SECONDS) / DEPART_SECONDS, 1);
        targetBlur = departT * MAX_BLUR_PX;
      }
    } else if (mode === "about") {
      waypointPos = ABOUT_CAM_POS;
      waypointTarget = ABOUT_TARGET;
      waypointFov = ABOUT_FOV;
      const diveElapsed = modeElapsed.current - ABOUT_HOLD_SECONDS;
      if (diveElapsed >= 0 && diveElapsed < ABOUT_DIVE_SECONDS) {
        // Dive from the front-of-nose hold down to a fixed low vantage just ahead of the
        // nose, already looking straight up, ready for the flyover to begin.
        const diveT = easeInOutCubic(diveElapsed / ABOUT_DIVE_SECONDS);
        camPos.current.lerpVectors(ABOUT_CAM_POS, ABOUT_FLYOVER_START, diveT);
        camTarget.current.lerpVectors(ABOUT_TARGET, ABOUT_FLYOVER_START_TARGET, diveT);
        camera.fov = THREE.MathUtils.lerp(ABOUT_FOV, ABOUT_FLYOVER_FOV, diveT);
        aboutSwooping = true;
      } else if (diveElapsed >= ABOUT_DIVE_SECONDS) {
        // Slide underneath at constant low altitude, from just ahead of the nose to past the
        // tail, with the look target locked directly overhead — the static jet reads as
        // flying past above the camera, nose first.
        const flyT = Math.min((diveElapsed - ABOUT_DIVE_SECONDS) / ABOUT_FLYOVER_SECONDS, 1);
        camPos.current.set(0, ABOUT_FLYOVER_Y, THREE.MathUtils.lerp(ABOUT_FLYOVER_START_Z, ABOUT_FLYOVER_END_Z, flyT));
        camTarget.current.set(camPos.current.x, ABOUT_FLYOVER_LOOK_Y, camPos.current.z);
        camera.fov = ABOUT_FLYOVER_FOV;
        aboutSwooping = true;
        if (flyT > ABOUT_BLUR_START) {
          const blurT = (flyT - ABOUT_BLUR_START) / (1 - ABOUT_BLUR_START);
          targetBlur = blurT * MAX_BLUR_PX;
        }
      }
    } else if (distanceToDefaultCam > 0.5) {
      // Returning to the landing view from an immersive mode: the camera still has to
      // travel a long way back (from deep inside the cockpit or far off past the departure
      // point), so keep a blur veil up — proportional to remaining distance — until it
      // actually arrives, instead of revealing a fast, sharp whip back across the scene.
      // A slightly slower glide gives the blur time to do its job.
      targetBlur = Math.min(distanceToDefaultCam / 3, 1) * RETURN_BLUR_PX;
      smoothing = 2.1;
    }

    const immersive = mode !== "default";
    const closeToDefault = distanceToDefaultCam < 0.5;

    if (immersive || !closeToDefault) {
      if (!aboutSwooping) {
        camPos.current.x = THREE.MathUtils.damp(camPos.current.x, waypointPos.x, smoothing, delta);
        camPos.current.y = THREE.MathUtils.damp(camPos.current.y, waypointPos.y, smoothing, delta);
        camPos.current.z = THREE.MathUtils.damp(camPos.current.z, waypointPos.z, smoothing, delta);
        camTarget.current.x = THREE.MathUtils.damp(camTarget.current.x, waypointTarget.x, smoothing, delta);
        camTarget.current.y = THREE.MathUtils.damp(camTarget.current.y, waypointTarget.y, smoothing, delta);
        camTarget.current.z = THREE.MathUtils.damp(camTarget.current.z, waypointTarget.z, smoothing, delta);
        camera.fov = THREE.MathUtils.damp(camera.fov, waypointFov, smoothing, delta);
      }
      camera.position.copy(camPos.current);
      camera.updateProjectionMatrix();
      camera.lookAt(camTarget.current);
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
        controlsRef.current.target.copy(camTarget.current);
      }
    } else if (controlsRef.current && !controlsRef.current.enabled) {
      controlsRef.current.target.copy(DEFAULT_TARGET);
      controlsRef.current.enabled = true;
      controlsRef.current.update();
    }

    blur.current = THREE.MathUtils.damp(blur.current, targetBlur, 3.5, delta);
    if (canvasWrapRef.current) {
      canvasWrapRef.current.style.filter = blur.current > 0.5 ? `blur(${blur.current.toFixed(1)}px)` : "";
    }

    if (groupRef.current && (immersive || modeElapsed.current < 2)) {
      const current = groupRef.current.rotation.y;
      const TWO_PI = Math.PI * 2;
      const wrapped = ((current % TWO_PI) + TWO_PI) % TWO_PI;
      const shortest = wrapped > Math.PI ? wrapped - TWO_PI : wrapped;
      const nearestZero = current - shortest;
      groupRef.current.rotation.y = THREE.MathUtils.damp(current, nearestZero, 3.2, delta);
    }
  });

  return null;
}

function makeSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#1560b8");
  gradient.addColorStop(0.35, "#3f8ed8");
  gradient.addColorStop(0.62, "#7fbdec");
  gradient.addColorStop(0.82, "#c3e2f7");
  gradient.addColorStop(1, "#eef6fc");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function SkyDome() {
  const texture = useMemo(() => makeSkyTexture(), []);
  return (
    <mesh>
      <sphereGeometry args={[300, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function makeCloudTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "lighter";

  const blobs = [
    [0.5, 0.55, 0.42],
    [0.3, 0.52, 0.26],
    [0.7, 0.52, 0.28],
    [0.4, 0.36, 0.24],
    [0.62, 0.38, 0.22],
    [0.5, 0.68, 0.28],
  ];

  for (const [bx, by, br] of blobs) {
    const cx = bx * size;
    const cy = by * size;
    const r = br * size;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, "rgba(255,255,255,0.85)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function CloudField() {
  const texture = useMemo(() => makeCloudTexture(), []);
  const puffs = useMemo(() => {
    const rand = (min, max) => min + Math.random() * (max - min);
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = rand(35, 68);
      arr.push({
        position: [Math.cos(angle) * radius, rand(-32, -8), Math.sin(angle) * radius],
        scale: rand(16, 32),
        opacity: rand(0.55, 0.9),
      });
    }
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = rand(42, 65);
      arr.push({
        position: [Math.cos(angle) * radius, rand(14, 26), Math.sin(angle) * radius],
        scale: rand(11, 19),
        opacity: rand(0.25, 0.45),
      });
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <group ref={ref}>
      {puffs.map((p, i) => (
        <sprite key={i} position={p.position} scale={[p.scale, p.scale * 0.6, 1]}>
          <spriteMaterial map={texture} transparent depthWrite={false} opacity={p.opacity} fog={false} />
        </sprite>
      ))}
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="jet3d-loader mono">LOADING AIRFRAME — {Math.round(progress)}%</div>
    </Html>
  );
}

export default function Jet3D({ activeId, onSelect }) {
  const groupRef = useRef();
  const controlsRef = useRef();
  const canvasWrapRef = useRef();
  const [interacting, setInteracting] = useState(false);
  const mode =
    activeId === "contact"
      ? "cockpit"
      : activeId === "projects"
        ? "projects"
        : activeId === "about"
          ? "about"
          : "default";
  const hideHotspots = mode !== "default";

  return (
    <div
      ref={canvasWrapRef}
      className={`jet3d-canvas-wrap${hideHotspots ? " jet3d-canvas-wrap--cockpit" : ""}`}
    >
      <Canvas
        camera={{ position: [32, 12, 38], fov: 34 }}
        dpr={[1, 2]}
        shadows="soft"
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          antialias: true,
        }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#8fc6f4", "#eef6ff", 0.9]} />
        <directionalLight
          position={SUN_POSITION}
          intensity={2.4}
          color="#fff6e6"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <SkyDome />
        <CloudField />
        <ReflectionEnvironment />

        <Suspense fallback={<Loader />}>
          <group ref={groupRef}>
            <Model />
            <Decals groupRef={groupRef} />
            {!hideHotspots &&
              HOTSPOTS_3D.map((h) => (
                <group key={h.id} position={h.position}>
                  <mesh>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial
                      color={activeId === h.id ? "#1f5fa8" : "#ffffff"}
                      emissive={activeId === h.id ? "#1f5fa8" : "#8fa8c4"}
                      emissiveIntensity={0.6}
                      roughness={0.3}
                    />
                  </mesh>
                  <Html distanceFactor={22} zIndexRange={[10, 0]}>
                    <motion.button
                      className={`hotspot-label3d${activeId === h.id ? " hotspot-label3d--active" : ""}`}
                      onClick={() => onSelect(h.id)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <span className="mono hotspot-label3d__tag">{h.label}</span>
                      <span className="hotspot-label3d__sub">{h.sub}</span>
                    </motion.button>
                  </Html>
                </group>
              ))}
          </group>
        </Suspense>

        <AutoRotate groupRef={groupRef} paused={interacting || Boolean(activeId)} />
        <CameraRig groupRef={groupRef} controlsRef={controlsRef} mode={mode} canvasWrapRef={canvasWrapRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={20}
          maxDistance={70}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.68}
          onStart={() => setInteracting(true)}
          onEnd={() => setInteracting(false)}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
