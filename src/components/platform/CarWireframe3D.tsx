import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Environment,
  ContactShadows,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
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

  const { cloned, scale, offset } = useMemo(() => {
    const scene = gltf.scene.clone(true);

    // Enhance materials for realism
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.5;
          child.material.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 5 / maxDim;
    const center = box.getCenter(new THREE.Vector3());

    return {
      cloned: scene,
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    };
  }, [gltf]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive
        object={cloned}
        scale={[scale, scale, scale]}
        position={[offset.x, offset.y, offset.z]}
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
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[2, 0.6, 1]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function StudioFloor() {
  return (
    <group position={[0, -1, 0]}>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.15}
          metalness={0.05}
        />
      </mesh>
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={20}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </group>
  );
}

function SceneContent({ path }: { path: string }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[7, 3, 7]} fov={30} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
      />

      {/* Studio lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Key light */}
      <directionalLight
        position={[8, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light */}
      <directionalLight position={[-6, 6, -4]} intensity={1} />
      
      {/* Rim light */}
      <directionalLight position={[0, 5, -8]} intensity={0.8} />
      
      {/* Soft hemisphere */}
      <hemisphereLight args={["#ffffff", "#d0d0d0", 0.6]} />

      {/* HDR environment for realistic reflections */}
      <Environment preset="warehouse" background />

      <StudioFloor />

      <Suspense fallback={<LoadingFallback />}>
        <CarModel path={path} />
      </Suspense>
    </>
  );
}

// Preload all models
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
      <div className="h-[400px] w-full">
        <Canvas
          shadows
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: "transparent" }}
        >
          <SceneContent path={modelPath} />
        </Canvas>
      </div>
    </motion.div>
  );
}
