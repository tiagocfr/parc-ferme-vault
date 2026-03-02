import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { chartReveal } from "@/lib/animations";

type CarProfile = "911" | "e30" | "gtr";

interface CarWireframe3DProps {
  profile?: CarProfile;
  label?: string;
}

/**
 * Each car is defined by multiple cross-sections along the X axis (length).
 * A cross-section is: { x, points: [y,z][] } — a closed polygon at that X position.
 * We connect adjacent cross-sections to form the wireframe hull.
 */
interface CrossSection {
  x: number;
  points: [number, number][]; // [y, z] pairs forming closed loop
}

function makeHalfLoop(pts: [number, number][]): [number, number][] {
  // Mirror z to create full loop: pts are top-right quarter, we mirror for left
  const full: [number, number][] = [];
  for (const [y, z] of pts) full.push([y, z]);
  for (let i = pts.length - 2; i >= 0; i--) full.push([pts[i][0], -pts[i][1]]);
  return full;
}

function getBMW_E30(): CrossSection[] {
  // Boxy 80s coupe — flat roof, sharp edges, compact
  const W = 0.72; // half width
  const H = 0.42; // body height from ground to beltline
  const RH = 1.18; // roof height
  const BH = 0.95; // beltline
  const GH = 0.32; // ground clearance

  return [
    // Rear bumper
    { x: -2.15, points: makeHalfLoop([[GH, 0], [GH, W * 0.7], [H + 0.05, W * 0.7], [H + 0.05, 0]]) },
    // Rear panel
    { x: -2.05, points: makeHalfLoop([[GH, 0], [GH, W], [H + 0.1, W], [BH, W * 0.95], [RH * 0.85, W * 0.68], [RH * 0.85, 0]]) },
    // C-pillar
    { x: -1.5, points: makeHalfLoop([[GH, 0], [GH, W], [H + 0.1, W], [BH, W], [RH, W * 0.65], [RH, 0]]) },
    // Rear door / B-pillar
    { x: -0.7, points: makeHalfLoop([[GH, 0], [GH, W], [H + 0.1, W], [BH, W], [RH, W * 0.62], [RH, 0]]) },
    // A-pillar top
    { x: -0.1, points: makeHalfLoop([[GH, 0], [GH, W], [H + 0.1, W], [BH, W], [RH, W * 0.60], [RH, 0]]) },
    // Windshield base
    { x: 0.4, points: makeHalfLoop([[GH, 0], [GH, W], [H + 0.1, W], [BH, W], [BH + 0.05, W * 0.55], [BH + 0.05, 0]]) },
    // Hood
    { x: 0.9, points: makeHalfLoop([[GH, 0], [GH, W * 0.95], [H, W * 0.95], [BH - 0.05, W * 0.85], [BH - 0.05, 0]]) },
    // Mid hood
    { x: 1.5, points: makeHalfLoop([[GH, 0], [GH, W * 0.9], [H - 0.02, W * 0.9], [BH - 0.1, W * 0.8], [BH - 0.1, 0]]) },
    // Front
    { x: 1.95, points: makeHalfLoop([[GH, 0], [GH, W * 0.85], [H - 0.05, W * 0.85], [BH - 0.15, W * 0.75], [BH - 0.15, 0]]) },
    // Front bumper
    { x: 2.15, points: makeHalfLoop([[GH, 0], [GH, W * 0.7], [H - 0.08, W * 0.7], [H + 0.05, 0]]) },
  ];
}

function getPorsche911(): CrossSection[] {
  // Iconic sloped rear, wide hips, low nose
  const W = 0.78;
  const GH = 0.28;

  return [
    // Rear bumper
    { x: -2.2, points: makeHalfLoop([[GH, 0], [GH, W * 0.75], [0.55, W * 0.75], [0.55, 0]]) },
    // Rear wide hips
    { x: -1.9, points: makeHalfLoop([[GH, 0], [GH, W], [0.65, W], [1.05, W * 0.85], [1.15, W * 0.55], [1.15, 0]]) },
    // Rear glass slope start
    { x: -1.4, points: makeHalfLoop([[GH, 0], [GH, W], [0.65, W], [1.0, W * 0.9], [1.25, W * 0.6], [1.25, 0]]) },
    // Roof peak
    { x: -0.7, points: makeHalfLoop([[GH, 0], [GH, W * 0.95], [0.6, W * 0.95], [0.95, W * 0.85], [1.18, W * 0.55], [1.18, 0]]) },
    // A-pillar
    { x: -0.1, points: makeHalfLoop([[GH, 0], [GH, W * 0.9], [0.55, W * 0.9], [0.9, W * 0.8], [1.1, W * 0.50], [1.1, 0]]) },
    // Windshield base
    { x: 0.4, points: makeHalfLoop([[GH, 0], [GH, W * 0.85], [0.5, W * 0.85], [0.82, W * 0.7], [0.82, 0]]) },
    // Hood (low, sloping)
    { x: 1.0, points: makeHalfLoop([[GH, 0], [GH, W * 0.75], [0.45, W * 0.75], [0.68, W * 0.6], [0.68, 0]]) },
    // Front fenders
    { x: 1.5, points: makeHalfLoop([[GH, 0], [GH, W * 0.7], [0.42, W * 0.7], [0.55, W * 0.5], [0.55, 0]]) },
    // Nose
    { x: 1.95, points: makeHalfLoop([[GH, 0], [GH, W * 0.6], [0.38, W * 0.6], [0.45, W * 0.4], [0.45, 0]]) },
    // Front tip
    { x: 2.2, points: makeHalfLoop([[GH, 0], [GH, W * 0.45], [0.35, W * 0.45], [0.38, 0]]) },
  ];
}

function getNissanGTR(): CrossSection[] {
  // Wide, aggressive, muscular
  const W = 0.85;
  const GH = 0.30;

  return [
    // Rear diffuser
    { x: -2.25, points: makeHalfLoop([[GH, 0], [GH, W * 0.8], [0.6, W * 0.8], [0.6, 0]]) },
    // Rear panel wide
    { x: -2.0, points: makeHalfLoop([[GH, 0], [GH, W], [0.65, W], [1.0, W * 0.78], [1.12, W * 0.55], [1.12, 0]]) },
    // C-pillar
    { x: -1.4, points: makeHalfLoop([[GH, 0], [GH, W], [0.65, W], [1.0, W * 0.82], [1.2, W * 0.58], [1.2, 0]]) },
    // B-pillar
    { x: -0.6, points: makeHalfLoop([[GH, 0], [GH, W * 0.98], [0.6, W * 0.98], [0.95, W * 0.85], [1.22, W * 0.56], [1.22, 0]]) },
    // A-pillar
    { x: 0.0, points: makeHalfLoop([[GH, 0], [GH, W * 0.95], [0.55, W * 0.95], [0.9, W * 0.8], [1.15, W * 0.52], [1.15, 0]]) },
    // Windshield base
    { x: 0.5, points: makeHalfLoop([[GH, 0], [GH, W * 0.92], [0.5, W * 0.92], [0.85, W * 0.75], [0.85, 0]]) },
    // Hood
    { x: 1.1, points: makeHalfLoop([[GH, 0], [GH, W * 0.88], [0.48, W * 0.88], [0.78, W * 0.72], [0.78, 0]]) },
    // Front fender bulge
    { x: 1.6, points: makeHalfLoop([[GH, 0], [GH, W * 0.82], [0.45, W * 0.82], [0.65, W * 0.6], [0.65, 0]]) },
    // Front
    { x: 2.0, points: makeHalfLoop([[GH, 0], [GH, W * 0.75], [0.42, W * 0.75], [0.55, W * 0.5], [0.55, 0]]) },
    // Front lip
    { x: 2.3, points: makeHalfLoop([[GH, 0], [GH, W * 0.6], [0.38, W * 0.6], [0.42, 0]]) },
  ];
}

function getCrossSections(profile: CarProfile): CrossSection[] {
  switch (profile) {
    case "e30": return getBMW_E30();
    case "911": return getPorsche911();
    case "gtr": return getNissanGTR();
  }
}

function WireframeCar({ profile = "e30" }: { profile: CarProfile }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const lines = useMemo(() => {
    const sections = getCrossSections(profile);
    const result: { pts: THREE.Vector3[]; bright: boolean }[] = [];

    // Draw each cross-section as a closed loop
    for (const sec of sections) {
      const loop = sec.points.map(([y, z]) => new THREE.Vector3(sec.x, y, z));
      loop.push(loop[0].clone()); // close
      result.push({ pts: loop, bright: false });
    }

    // Connect corresponding points across sections (longitudinal lines)
    for (let p = 0; p < sections[0].points.length; p++) {
      const spine: THREE.Vector3[] = [];
      for (const sec of sections) {
        const idx = Math.min(p, sec.points.length - 1);
        const [y, z] = sec.points[idx];
        spine.push(new THREE.Vector3(sec.x, y, z));
      }
      result.push({ pts: spine, bright: p === 0 || p === sections[0].points.length - 1 });
    }

    // Wheel arches
    const wheelRadius = 0.32;
    const wheelWidth = 0.18;
    const getGH = profile === "911" ? 0.28 : profile === "gtr" ? 0.30 : 0.32;
    const rearX = profile === "e30" ? -1.55 : profile === "911" ? -1.6 : -1.5;
    const frontX = profile === "e30" ? 1.45 : profile === "911" ? 1.4 : 1.5;
    const outerZ = profile === "e30" ? 0.72 : profile === "911" ? 0.78 : 0.85;

    const wheelPositions: [number, number][] = [[rearX, getGH], [frontX, getGH]];

    for (const [wx, wy] of wheelPositions) {
      for (const zSign of [-1, 1]) {
        // Outer wheel circle
        const z1 = zSign * (outerZ + 0.06);
        const z2 = zSign * (outerZ + 0.06 + wheelWidth);
        for (const z of [z1, z2]) {
          const wheelPts: THREE.Vector3[] = [];
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += Math.PI / 16) {
            wheelPts.push(new THREE.Vector3(
              wx + Math.cos(a) * wheelRadius,
              wy + Math.sin(a) * wheelRadius,
              z
            ));
          }
          result.push({ pts: wheelPts, bright: true });
        }
        // Spokes
        for (let s = 0; s < 5; s++) {
          const a = (s / 5) * Math.PI * 2;
          const mid = (z1 + z2) / 2;
          result.push({
            pts: [
              new THREE.Vector3(wx, wy, mid),
              new THREE.Vector3(wx + Math.cos(a) * wheelRadius * 0.9, wy + Math.sin(a) * wheelRadius * 0.9, mid),
            ],
            bright: false,
          });
        }
        // Axle connector
        result.push({
          pts: [
            new THREE.Vector3(wx, wy, z1),
            new THREE.Vector3(wx, wy, z2),
          ],
          bright: false,
        });
      }
    }

    // Floor pan
    const floorY = getGH - 0.02;
    const floorW = outerZ * 0.85;
    result.push({
      pts: [
        new THREE.Vector3(sections[0].x, floorY, -floorW),
        new THREE.Vector3(sections[sections.length - 1].x, floorY, -floorW),
        new THREE.Vector3(sections[sections.length - 1].x, floorY, floorW),
        new THREE.Vector3(sections[0].x, floorY, floorW),
        new THREE.Vector3(sections[0].x, floorY, -floorW),
      ],
      bright: false,
    });

    return result;
  }, [profile]);

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.pts}
          color="hsl(145, 100%, 50%)"
          lineWidth={line.bright ? 1.5 : 0.8}
          transparent
          opacity={line.bright ? 0.95 : 0.4}
        />
      ))}
    </group>
  );
}

function SceneContent({ profile }: { profile: CarProfile }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4.5, 2.2, 4.5]} fov={32} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.1}
      />
      <ambientLight intensity={0.3} />
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="hsl(220, 15%, 15%)"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="hsl(220, 15%, 20%)"
        fadeDistance={15}
        position={[0, 0, 0]}
      />
      <WireframeCar profile={profile} />
    </>
  );
}

const profileMap: Record<string, CarProfile> = {
  "Porsche 911 GT3 RS": "911",
  "BMW M3 E30 Restomod": "e30",
  "Nissan GT-R R35 Track": "gtr",
};

export default function CarWireframe3D({ profile = "e30", label }: CarWireframe3DProps) {
  return (
    <motion.div
      className="bg-card border border-border rounded-lg overflow-hidden relative"
      variants={chartReveal}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
          3D Wireframe View
        </span>
      </div>
      {label && (
        <div className="absolute top-3 right-3 z-10">
          <span className="font-mono text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {label}
          </span>
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          Arraste para rotacionar · Scroll para zoom
        </span>
      </div>
      <div className="h-[320px] w-full bg-background/50">
        <Canvas gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
          <SceneContent profile={profile} />
        </Canvas>
      </div>
    </motion.div>
  );
}

export { profileMap };
export type { CarProfile };
