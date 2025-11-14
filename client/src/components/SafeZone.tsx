import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function SafeZone() {
  const meshRef = useRef<THREE.Mesh>(null);
  const victory = useStepChallenge((state) => state.victory);
  const updateProgress = useStepChallenge((state) => state.updateProgress);
  const speed = 5;
  const finishLine = -200;
  const startLine = 0;
  const totalDistance = Math.abs(finishLine - startLine);
  
  const positionRef = useRef(finishLine);
  const checkedVictory = useRef(false);
  
  useEffect(() => {
    positionRef.current = finishLine;
    checkedVictory.current = false;
  }, []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      positionRef.current += speed * delta;
      meshRef.current.position.z = positionRef.current;
      
      meshRef.current.rotation.y += delta * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
      
      const traveled = Math.abs(positionRef.current - finishLine);
      const progress = Math.min((traveled / totalDistance) * 100, 100);
      updateProgress(progress);
      
      if (positionRef.current > 5 && !checkedVictory.current) {
        checkedVictory.current = true;
        victory();
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 2, finishLine]}>
      <torusGeometry args={[3, 0.3, 16, 32]} />
      <meshStandardMaterial 
        color="#00E676"
        emissive="#00E676"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
