import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from '@react-spring/three';
import { useSystem } from '../context/SystemContext';
import * as THREE from 'three';

export default function WindowModel() {
  const { state } = useSystem();
  const isOpen = state.windowState === 'open';
  const [hovered, setHovered] = useState(false);

  // Upgraded: bouncy hinge rotation, subtle scale on hover, and color change
  const { hingeRotation, windowScale, frameColor } = useSpring({
    hingeRotation: isOpen ? Math.PI / 2.2 : 0,
    windowScale: hovered ? 1.05 : 1.0,
    frameColor: hovered ? "#2c5282" : "#1a202c",
    config: { mass: 1.5, tension: 220, friction: 12 }
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 1,
    metalness: 0.1,
    roughness: 0.05,
    ior: 1.5,
    thickness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    attenuationColor: 0xffffff,
    attenuationDistance: 2,
  });

  return (
    <animated.group 
      scale={windowScale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Wall/Frame Cutout */}
      <animated.mesh position={[0, 1.5, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 3.2, 0.2]} />
        <animated.meshStandardMaterial color={frameColor} />
      </animated.mesh>
      
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
      <animated.group position={[-2, 1.5, 0]} rotation-y={hingeRotation.to(r => -r)}>
        <mesh position={[1, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 2.9, 0.05]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
        {/* Glass */}
        <mesh position={[1, 0, 0]} geometry={new THREE.BoxGeometry(1.8, 2.8, 0.06)} material={glassMaterial} />
      </animated.group>

      {/* Right Pane (Swings open outward) */}
      <animated.group position={[2, 1.5, 0]} rotation-y={hingeRotation}>
        <mesh position={[-1, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 2.9, 0.05]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
        {/* Glass */}
        <mesh position={[-1, 0, 0]} geometry={new THREE.BoxGeometry(1.8, 2.8, 0.06)} material={glassMaterial} />
      </animated.group>
    </animated.group>
  );
}
