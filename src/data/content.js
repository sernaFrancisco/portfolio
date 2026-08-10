// Central content file — edit this to update the site's text.
// Everything the site displays is sourced from here.

export const personal = {
  name: "Francisco Serna",
  callsign: "SERNA",
  email: "Fserna0207@gmail.com",
  schoolEmail: "serna046@umn.edu",
  linkedin: "https://www.linkedin.com/in/francisco-serna-8070082b3",
  resumeUrl: "/resume/Francisco-Serna-Resume.pdf",
  location: "Minneapolis, MN",
  bilingual: "Bilingual in Spanish",
};

export const education = {
  school: "University of Minnesota – Twin Cities",
  degree: "Bachelor of Engineering, Mechanical Engineering",
  location: "Minneapolis, MN",
  expected: "Expected May 2028",
  coursework: [
    "Material Properties",
    "Mechanics of Materials",
    "Thermodynamics",
    "Statics & Dynamics",
    "Design / Manufacturing",
    "Circuits",
    "Fluid Mechanics",
    "Heat Transfer",
    "Mechanism / Machine Design",
    "System Dynamics / Control",
    "Measurements",
  ],
};

export const internships = [
  {
    company: "Abbott Laboratories",
    role: "Electrophysiology Research and Development Intern",
    dates: "May 2026 – Aug. 2026",
    location: "Plymouth, MN",
    bullets: [
      "Led an evaluation study to validate polyurethane stopcock tubing as a replacement for existing PVC tubing in an introducing catheter by assembling test samples and executing Design Verification (DV) methods, including aging, water/air leak, tensile strength, and bend/kink radius testing.",
      "Collaborated in the development of a new test method to characterize the variability of nitinol baskets through torque testing and evaluations of lateral stability.",
      "Evaluated shaft inner diameter (ID) design changes through friction testing and development of Design Control Models (DCMs) and tolerance stack-ups to assess the impact of increased ID on shaft interactions within the handle assembly using MiniTab, SolidWorks, and Excel.",
    ],
  },
  {
    company: "Cretex Medical – rms Company",
    role: "Manufacturing Engineering Intern",
    dates: "May 2025 – Dec. 2025",
    location: "Coon Rapids, MN",
    bullets: [
      "Created a visual database based on research on the different types of tumbling media, cycle times, and their impact on post-tumbling properties, helping operators achieve a desired finish, saving up to 15 minutes between tumbling cycles.",
      "Modeled and designed fixtures specific to individual components for laser marking and EDM wiring in SolidWorks.",
      "Conducted inspections and calibrations of component iterations and machines weekly.",
    ],
  },
];

export const workExperience = [
  {
    company: "Lifetime Fitness Inc.",
    role: "Facility Operations Supervisor",
    dates: "Jan. 2023 – Present",
    location: "Coon Rapids, MN",
    bullets: [
      "Directed club upkeep by overseeing 48 team members, ensuring the practice of standard club procedures.",
      "Exceeded standard customer service values with existing and new members to ensure a friendly, clean environment.",
      "Ensured team flow by completing scheduling, task lists, area designations, and other administrative tasks.",
    ],
  },
];

export const personalFacts = [
  { label: "STATUS", value: "Junior — Mechanical Engineering" },
  { label: "SCHOOL", value: "University of Minnesota – Twin Cities" },
  { label: "HOMETOWN", value: "Minneapolis, MN" },
  { label: "LANGUAGES", value: "English / Español" },
  {
    label: "FOCUS",
    value:
      "Passionate about energy transfer in automotive and aerial systems, currently gaining industry experience in medtech.",
  },
];

export const f15 = {
  name: "F-15 Eagle",
};

export const skills = [
  "SolidWorks",
  "C++",
  "MiniTab",
  "MicroVu",
  "PTC Windchill Workgroup Manager",
  "PTC Creo",
  "PTC Creo View",
  "ANSI Drawing Standards",
  "Sheet Metal Design",
  "Microsoft 365",
  "Google Workspace",
];

import spiderbotPhoto from "../assets/projects/spiderbot-photo.jpg";
import spiderbotCadFront from "../assets/projects/spiderbot-cad-front.jpg";
import spiderbotCadSide from "../assets/projects/spiderbot-cad-side.jpg";
import spiderbotCadDetail from "../assets/projects/spiderbot-cad-detail.jpg";

import trashCanPhoto from "../assets/projects/smart-trash-can-photo.jpg";
import trashCanCadHero from "../assets/projects/smart-trash-can-cad-hero.png";
import trashCanCadIso from "../assets/projects/smart-trash-can-cad-iso.png";
import trashCanCadFront from "../assets/projects/smart-trash-can-cad-front.png";
import trashCanCadDetail from "../assets/projects/smart-trash-can-cad-detail.png";

export const projects = [
  {
    id: "spider-bot",
    name: "Spider-Bot",
    context: "ME 2011 — Fall 2025",
    description:
      "An obstacle-avoiding hexapod: an ultrasonic IR-proximity sensor detects obstructions within 25cm and triggers all 12 servos — three per leg, driven through a PCA9685 16-channel driver — to rotate the robot 90° counterclockwise using a pin-and-slider knee mechanism. Left and right legs counter-rotate to pull the frame across a surface, similar to a hoverboard's turning motion. Body and legs are 3D-printed; designed and modeled entirely in SolidWorks.",
    images: [
      { src: spiderbotPhoto, caption: "Built and assembled" },
      { src: spiderbotCadFront, caption: "CAD — front view" },
      { src: spiderbotCadSide, caption: "CAD — side view" },
      { src: spiderbotCadDetail, caption: "Pin/slider knee mechanism" },
    ],
  },
  {
    id: "smart-trash-can",
    name: "IoT Smart Trash Can",
    context: "EE 1301",
    description:
      "Designed and developed an IoT-enabled smart trash can using a Particle Photon 2, integrating ultrasonic sensing, load cell weight measurement, and servo-actuated mechanisms in C++, with real-time status indication via cloud. Implemented cloud-connected monitoring and control through the Particle Cloud API, enabling remote operation and automated actuation, and modeled a 3D-printed enclosure in SolidWorks.",
    images: [
      { src: trashCanPhoto, caption: "Built and assembled" },
      { src: trashCanCadHero, caption: "CAD — sensor & servo detail" },
      { src: trashCanCadIso, caption: "CAD — chute detail" },
      { src: trashCanCadFront, caption: "CAD — front view" },
      { src: trashCanCadDetail, caption: "CAD — isometric view" },
    ],
  },
];
