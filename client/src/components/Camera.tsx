import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Camera() {
  const { camera } = useThree();
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  
  useFrame(() => {
    const speedFactor = gameSpeed / 12;
    const targetPosition = new THREE.Vector3(0, 5 + speedFactor, 10 + speedFactor);
    const targetLookAt = new THREE.Vector3(0, 0, -8);
    
    camera.position.lerp(targetPosition, 0.03);
    camera.lookAt(targetLookAt);
  });
  
  return null;
}
