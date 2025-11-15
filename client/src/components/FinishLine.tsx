import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import * as THREE from "three";

export function FinishLine() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const distance = useStepChallenge((state) => state.distance);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  
  const checkeredPattern = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    const squareSize = 16;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#000000' : '#FFFFFF';
        ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current) {
      const distanceToFinish = 1000 - distance;
      const baseZ = -distanceToFinish;
      
      groupRef.current.position.z = baseZ + (gameSpeed * delta);
      
      const targetY = Math.sin(Date.now() * 0.003) * 0.2;
      meshRef.current.position.y = 2 + targetY;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef} position={[0, 2, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial 
          map={checkeredPattern}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <mesh position={[-3.5, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      <mesh position={[3.5, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      
      <mesh position={[-3.5, 4.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[3.5, 4.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
