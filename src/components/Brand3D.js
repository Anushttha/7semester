"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Text3D, OrbitControls } from "@react-three/drei";

export default function Brand3D() {
  return (
    <div className="h-[300px] w-full">
      <Canvas>
        <ambientLight intensity={0.6} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Text3D font="/fonts/helvetiker_regular.typeface.json" size={1} height={0.2}>
            Aazmaao
            <meshStandardMaterial color="#00FFAA" metalness={0.7} roughness={0.2} />
          </Text3D>
        </Float>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
