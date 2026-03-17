import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSystem } from '../context/SystemContext';
import * as THREE from 'three';

export default function EnvironmentEffects() {
  const { state } = useSystem();
  const rainRef = useRef();

  // Generate rain particles
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20; // x
      p[i * 3 + 1] = Math.random() * 20; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return p;
  }, [count]);

  useFrame(() => {
    if (state.isRaining && rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        let y = positions[i * 3 + 1];
        y -= 0.3; // rain speed
        if (y < -5) y = 15;
        positions[i * 3 + 1] = y;
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const isHot = state.temperature > 28;

  return (
    <>
      {/* Sun / Heat Glow */}
      <spotLight 
        position={[10, 10, 5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={isHot ? 6 : 1} 
        color={isHot ? '#ff8800' : '#ffffff'}
        castShadow
      />
      
      {/* Ambient shift based on rain vs sun */}
      <ambientLight intensity={state.isRaining ? 0.2 : 0.6} color={state.isRaining ? '#aaddff' : '#ffffff'} />
      
      {/* Rain Particles */}
      <points ref={rainRef} visible={state.isRaining}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.6} />
      </points>

      {/* Background color transition */}
      <color attach="background" args={[state.isRaining ? '#0a101d' : (isHot ? '#1f100a' : '#111827')]} />
    </>
  );
}
