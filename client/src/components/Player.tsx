import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  
  const lanePositions = {
    left: -2,
    right: 2
  };
  
  useFrame(() => {
    if (meshRef.current) {
      const targetX = lanePositions[currentLane];
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.15
      );
    }
  });
  
  return (
    <mesh ref={meshRef} position={[-2, 0.5, 0]} castShadow>
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}
