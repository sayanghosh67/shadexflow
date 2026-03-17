import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Float } from '@react-three/drei';
import WindowModel from './WindowModel';
import EnvironmentEffects from './EnvironmentEffects';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 45 }}
      shadows
      className="w-full h-full"
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={1024} 
      />

      {/* Dynamic Environment Effects based on Context State */}
      <EnvironmentEffects />

      {/* 3D Window */}
      <group position={[0, -1, 0]}>
        <WindowModel />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </group>

      {/* 3D Floating Title */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, -2]}
          fontSize={0.8}
          color="#a3b8cc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          ShadeXFlow
        </Text>
      </Float>

      {/* Controls */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={4}
        maxDistance={12}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
