import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Camera() {
  const { camera } = useThree();
  
  useFrame(() => {
    const targetPosition = new THREE.Vector3(0, 4, 8);
    const targetLookAt = new THREE.Vector3(0, 0, -5);
    
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(targetLookAt);
  });
  
  return null;
}
