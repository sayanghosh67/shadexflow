import React, { useRef } from 'react';
import { useSpring, a } from '@react-spring/three';
import { useSystem } from '../context/SystemContext';
import * as THREE from 'three';

export default function WindowModel() {
  const { state } = useSystem();
  const isOpen = state.windowState === 'open';

  // Animate the rotation of the window hinges based on isOpen state
  const { hingeRotation } = useSpring({
    hingeRotation: isOpen ? -Math.PI / 2.5 : 0,
    config: { mass: 2, tension: 170, friction: 50 }
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.9,
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 0.1,
    attenuationColor: 0xffffff,
    attenuationDistance: 1,
  });

  return (
    <group>
      {/* Wall/Frame Cutout */}
      <mesh position={[0, 1.5, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 3.2, 0.2]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      
      {/* Inner Frame */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Window Sill */}
      <mesh position={[0, 0, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      {/* Left Pane (Swings open outward) */}
      <a.group position={[-2, 1.5, 0]} rotation-y={hingeRotation.to(r => -r)}>
        <mesh position={[1, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 2.9, 0.05]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
        {/* Glass */}
        <mesh position={[1, 0, 0]} geometry={new THREE.BoxGeometry(1.8, 2.8, 0.06)} material={glassMaterial} />
      </a.group>

      {/* Right Pane (Swings open outward) */}
      <a.group position={[2, 1.5, 0]} rotation-y={hingeRotation}>
        <mesh position={[-1, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 2.9, 0.05]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
        {/* Glass */}
        <mesh position={[-1, 0, 0]} geometry={new THREE.BoxGeometry(1.8, 2.8, 0.06)} material={glassMaterial} />
      </a.group>
    </group>
  );
}
