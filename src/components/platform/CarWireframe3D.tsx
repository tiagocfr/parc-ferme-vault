import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { chartReveal } from "@/lib/animations";

export interface CarModelEntry {
  id: string;
  label: string;
  path: string;
}

export const availableModels: CarModelEntry[] = [
  { id: "911-turbo", label: "Porsche 911 Turbo S", path: "/models/porsche-911-turbo-s.glb" },
  { id: "911-gt3", label: "Porsche 911 GT3", path: "/models/porsche-911-gt3.glb" },
];

interface CarWireframe3DProps {
  modelPath: string;
  label?: string;
}

function CarModel({ path }: { path: string }) {
  const groupRef = useRef<THREE.Group>(null);

  let scene: THREE.Group | null = null;
  let loadError = false;

  try {
    const gltf = useGLTF(path);
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
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 0.8, 1.4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    );
  }

  const cloned = scene.clone(true);

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
      <meshStandardMaterial color="#444" wireframe />
    </mesh>
  );
}

function SceneContent({ path }: { path: string }) {
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
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <Environment preset="city" />
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="hsl(220, 15%, 15%)"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="hsl(220, 15%, 20%)"
        fadeDistance={15}
        position={[0, -0.01, 0]}
      />
      <Suspense fallback={<LoadingFallback />}>
        <CarModel path={path} />
      </Suspense>
    </>
  );
}

export default function CarWireframe3D({ modelPath, label }: CarWireframe3DProps) {
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
          <SceneContent path={modelPath} />
        </Canvas>
      </div>
    </motion.div>
  );
}
