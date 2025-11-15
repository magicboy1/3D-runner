import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Camera() {
  const { camera } = useThree();
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const phase = useStepChallenge((state) => state.phase);
  const distance = useStepChallenge((state) => state.distance);
  
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3(0, 0.9, -5));
  
  useFrame(() => {
    if (phase !== "playing") return;
    const speedFactor = gameSpeed / 12;
    targetPosition.current.set(0, 3.2 + speedFactor * 0.5, 6 + speedFactor * 0.5);
    
    camera.position.lerp(targetPosition.current, 0.03);
    camera.lookAt(targetLookAt.current);
  });
  
  return null;
}
