import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSystem } from '../context/SystemContext';
import * as THREE from 'three';

const rainParticleCount = 1000;
const initialRainPositions = new Float32Array(rainParticleCount * 3);
for (let i = 0; i < rainParticleCount; i++) {
  initialRainPositions[i * 3] = (Math.random() - 0.5) * 20; // x
  initialRainPositions[i * 3 + 1] = Math.random() * 20; // y
  initialRainPositions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
}

export default function EnvironmentEffects() {
  const { state } = useSystem();
  const rainRef = useRef();

  const count = rainParticleCount;
  // Generate rain particles (impure random logic moved out of component render)
  const positions = useMemo(() => {
    return new Float32Array(initialRainPositions);
  }, []);

  useFrame(() => {
    if (state.isRaining && rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        let x = positions[i * 3];
        let y = positions[i * 3 + 1];
        
        y -= 0.35; // rain vertical speed
        x += 0.08; // wind horizontal speed
        
        if (y < -5) {
          y = 15;
          x = (Math.random() - 0.5) * 20; // reset x randomly when resetting y
        }
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const isHot = state.temperature > (state.autoOpenTemp || 28);

  return (
    <>
      {/* Sun / Heat Glow */}
      {/* Sun / Heat Glow */}
      <spotLight 
        position={[10, 10, 5]} 
        angle={0.6} 
        penumbra={1} 
        intensity={isHot ? 8 : 1.5} 
        color={isHot ? '#ff7700' : '#ffffff'}
        castShadow
      />
      
      {/* Ambient shift based on rain vs sun */}
      <ambientLight intensity={state.isRaining ? 0.3 : 0.8} color={state.isRaining ? '#55aaff' : '#ffffff'} />
      
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
