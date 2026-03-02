import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { chartReveal } from "@/lib/animations";

type CarProfile = "sports" | "sedan" | "suv";

interface CarWireframe3DProps {
  profile?: CarProfile;
  label?: string;
}

// Wireframe car body shape points for different profiles
function getBodyProfile(type: CarProfile): [number, number][] {
  switch (type) {
    case "sports":
      return [
        [-2.2, 0.3], [-2.0, 0.35], [-1.6, 0.4], [-1.2, 0.5],
        [-0.8, 0.75], [-0.4, 1.05], [0, 1.15], [0.4, 1.2],
        [0.8, 1.15], [1.2, 0.95], [1.6, 0.7], [1.8, 0.55],
        [2.0, 0.45], [2.2, 0.35], [2.2, 0.3],
      ];
    case "sedan":
      return [
        [-2.4, 0.35], [-2.2, 0.4], [-1.8, 0.45], [-1.4, 0.5],
        [-1.0, 0.9], [-0.6, 1.2], [-0.2, 1.3], [0.2, 1.3],
        [0.6, 1.3], [1.0, 1.2], [1.4, 0.85], [1.6, 0.55],
        [2.0, 0.45], [2.4, 0.4], [2.4, 0.35],
      ];
    case "suv":
      return [
        [-2.2, 0.5], [-2.0, 0.55], [-1.6, 0.6], [-1.2, 0.7],
        [-0.8, 1.3], [-0.4, 1.55], [0, 1.6], [0.4, 1.6],
        [0.8, 1.55], [1.2, 1.3], [1.4, 0.8], [1.6, 0.65],
        [2.0, 0.55], [2.2, 0.5], [2.2, 0.5],
      ];
  }
}

function WireframeCar({ profile = "sports" }: { profile: CarProfile }) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const bodyProfile = getBodyProfile(profile);
  const widths = [0.8, 0.7, 0.5]; // half-widths at different z-offsets

  // Generate wireframe lines
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    const primaryColor = new THREE.Color("hsl(145, 100%, 50%)");

    // Side profiles (left + right)
    for (const zSign of [-1, 1]) {
      const z = zSign * widths[0];
      const sidePoints = bodyProfile.map(([x, y]) => new THREE.Vector3(x, y, z));
      // Close bottom
      sidePoints.push(new THREE.Vector3(bodyProfile[bodyProfile.length - 1][0], 0.25, z));
      sidePoints.push(new THREE.Vector3(bodyProfile[0][0], 0.25, z));
      sidePoints.push(sidePoints[0]);
      result.push(sidePoints);
    }

    // Cross-sections (connecting left to right)
    for (let i = 0; i < bodyProfile.length; i += 2) {
      const [x, y] = bodyProfile[i];
      result.push([
        new THREE.Vector3(x, y, -widths[0]),
        new THREE.Vector3(x, y, widths[0]),
      ]);
    }

    // Bottom frame
    const bottomPts = [
      new THREE.Vector3(-2.2, 0.25, -widths[0]),
      new THREE.Vector3(2.2, 0.25, -widths[0]),
      new THREE.Vector3(2.2, 0.25, widths[0]),
      new THREE.Vector3(-2.2, 0.25, widths[0]),
      new THREE.Vector3(-2.2, 0.25, -widths[0]),
    ];
    result.push(bottomPts);

    // Roof lines
    const roofTop = bodyProfile.filter(([_, y]) => y > 1.0);
    if (roofTop.length > 1) {
      for (const [x, y] of roofTop) {
        result.push([
          new THREE.Vector3(x, y, -widths[1]),
          new THREE.Vector3(x, y, widths[1]),
        ]);
      }
    }

    // Wheel wells (circles)
    const wheelPositions: [number, number][] = [[-1.5, 0.35], [1.5, 0.35]];
    for (const [wx, wy] of wheelPositions) {
      for (const zSign of [-1, 1]) {
        const z = zSign * (widths[0] + 0.05);
        const wheelPts: THREE.Vector3[] = [];
        for (let a = 0; a <= Math.PI * 2; a += Math.PI / 12) {
          wheelPts.push(new THREE.Vector3(
            wx + Math.cos(a) * 0.35,
            wy + Math.sin(a) * 0.35,
            z
          ));
        }
        result.push(wheelPts);
      }
    }

    // Axles
    for (const [wx, wy] of wheelPositions) {
      result.push([
        new THREE.Vector3(wx, wy, -widths[0] - 0.05),
        new THREE.Vector3(wx, wy, widths[0] + 0.05),
      ]);
    }

    return result;
  }, [profile]);

  return (
    <group ref={groupRef}>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="hsl(145, 100%, 50%)"
          lineWidth={1.2}
          transparent
          opacity={i < 2 ? 0.9 : 0.5}
        />
      ))}
      {/* Center reference point */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="hsl(145, 100%, 50%)" />
      </mesh>
    </group>
  );
}

function SceneContent({ profile }: { profile: CarProfile }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 2.5, 4]} fov={35} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={4}
        maxDistance={10}
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
  "Porsche 911 GT3 RS": "sports",
  "BMW M3 E30 Restomod": "sedan",
  "Nissan GT-R R35 Track": "sports",
};

export default function CarWireframe3D({ profile = "sports", label }: CarWireframe3DProps) {
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
