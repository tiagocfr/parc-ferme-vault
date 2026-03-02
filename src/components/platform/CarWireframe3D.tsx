import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { chartReveal } from "@/lib/animations";

type CarProfile = "911" | "e30" | "gtr";

interface CarWireframe3DProps {
  profile?: CarProfile;
  label?: string;
}

/**
 * Map each car profile to its .glb file path in /public/models/
 * To add a new car, drop the .glb file in public/models/ and add the mapping here.
 */
const modelPaths: Record<CarProfile, string> = {
  e30: "/models/bmw-e30.glb",
  "911": "/models/porsche-911.glb",
  gtr: "/models/nissan-gtr.glb",
};

function CarModel({ profile }: { profile: CarProfile }) {
  const groupRef = useRef<THREE.Group>(null);
  const modelPath = modelPaths[profile];

  let scene: THREE.Group | null = null;
  let loadError = false;

  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch {
    loadError = true;
  }

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  if (loadError || !scene) {
    return (
      <group ref={groupRef}>
        {/* Placeholder box when model not found */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 0.8, 1.4]} />
          <meshBasicMaterial color="hsl(145, 100%, 50%)" wireframe />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3.05, 0.85, 1.45]} />
          <meshBasicMaterial color="hsl(145, 100%, 50%)" wireframe opacity={0.15} transparent />
        </mesh>
      </group>
    );
  }

  // Apply wireframe material to all meshes
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("hsl(145, 100%, 50%)"),
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
    }
  });

  // Auto-center and scale
  const box = new THREE.Box3().setFromObject(cloned);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 3.5 / maxDim;
  const center = box.getCenter(new THREE.Vector3());

  return (
    <group ref={groupRef}>
      <primitive
        object={cloned}
        scale={[scale, scale, scale]}
        position={[-center.x * scale, -center.y * scale + 0.01, -center.z * scale]}
      />
    </group>
  );
}

function LoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <boxGeometry args={[2, 0.6, 1]} />
      <meshBasicMaterial color="hsl(145, 100%, 50%)" wireframe opacity={0.3} transparent />
    </mesh>
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
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.1}
      />
      <ambientLight intensity={0.5} />
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
      <Suspense fallback={<LoadingFallback />}>
        <CarModel profile={profile} />
      </Suspense>
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
          3D Model View
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
