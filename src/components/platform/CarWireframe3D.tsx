import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Environment,
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

const DESIRED_SIZE = 5;
const FLOOR_Y = 0;

function CarModel({ path }: { path: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(path);

  const { cloned, scale, offsetX, offsetZ, baseY } = useMemo(() => {
    const scene = gltf.scene.clone(true);

    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.2;
          child.material.side = THREE.FrontSide;
          child.material.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = DESIRED_SIZE / maxDim;

    const center = box.getCenter(new THREE.Vector3());

    return {
      cloned: scene,
      scale: s,
      offsetX: -center.x * s,
      offsetZ: -center.z * s,
      baseY: -box.min.y * s,
    };
  }, [gltf]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, FLOOR_Y, 0]}>
      <primitive
        object={cloned}
        scale={[scale, scale, scale]}
        position={[offsetX, baseY, offsetZ]}
      />
    </group>
  );
}

function StudioFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y - 0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0} />
    </mesh>
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
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
      />

      <color attach="background" args={["#f5f5f5"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
      <directionalLight position={[-6, 6, -4]} intensity={0.8} />
      <directionalLight position={[0, 5, -8]} intensity={0.5} />
      <hemisphereLight args={["#ffffff", "#e0e0e0", 0.4]} />

      <Environment preset="warehouse" />

      <StudioFloor />

      <Suspense fallback={null}>
        <CarModel path={path} />
      </Suspense>
    </>
  );
}

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
            toneMappingExposure: 1.1,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <SceneContent path={modelPath} />
        </Canvas>
      </div>
    </motion.div>
  );
}
