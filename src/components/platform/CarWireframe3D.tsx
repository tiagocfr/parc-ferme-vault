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

  const gltf = useGLTF(path);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const cloned = gltf.scene.clone(true);

  // Auto-center and scale
  const box = new THREE.Box3().setFromObject(cloned);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 5 / maxDim;
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

function Helipad() {
  return (
    <group position={[0, -1, 0]}>
      {/* Main platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6, 6, 0.15, 64]} />
        <meshStandardMaterial color="#888888" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Inner circle marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[3.8, 4, 64]} />
        <meshStandardMaterial color="#cccc00" roughness={0.6} />
      </mesh>
      {/* H letter - left vertical */}
      <mesh position={[-0.6, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 2.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* H letter - right vertical */}
      <mesh position={[0.6, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 2.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* H letter - horizontal bar */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.55, 0.35]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Outer edge ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[5.7, 6, 64]} />
        <meshStandardMaterial color="#cc0000" roughness={0.6} />
      </mesh>
    </group>
  );
}

function SceneContent({ path }: { path: string }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 3.5, 6]} fov={32} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={3}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.1}
      />
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 10, 5]} intensity={2} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      <hemisphereLight args={["#87CEEB", "#444444", 0.8]} />
      <Environment preset="city" background />
      <Helipad />
      <Suspense fallback={<LoadingFallback />}>
        <CarModel path={path} />
      </Suspense>
    </>
  );
}

// Preload all models to avoid fallback box on initial render
availableModels.forEach((m) => useGLTF.preload(m.path));

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
