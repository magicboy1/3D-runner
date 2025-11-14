import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Ground() {
  const groupRef = useRef<THREE.Group>(null);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const addDistance = useStepChallenge((state) => state.addDistance);
  const increaseSpeed = useStepChallenge((state) => state.increaseSpeed);
  
  const distanceCounterRef = useRef(0);
  
  const tiles = useMemo(() => {
    const tileList = [];
    for (let i = 0; i < 30; i++) {
      tileList.push({
        id: i,
        z: i * 15
      });
    }
    return tileList;
  }, []);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((tile) => {
        tile.position.z += gameSpeed * delta;
        
        if (tile.position.z > 20) {
          tile.position.z -= 450;
        }
      });
      
      distanceCounterRef.current += gameSpeed * delta;
      if (distanceCounterRef.current >= 1) {
        addDistance(Math.floor(distanceCounterRef.current));
        distanceCounterRef.current = distanceCounterRef.current % 1;
      }
      
      if (Math.floor(state.clock.elapsedTime) % 10 === 0 && Math.floor(state.clock.elapsedTime) > 0) {
        if (state.clock.elapsedTime % 10 < delta) {
          increaseSpeed();
        }
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      {tiles.map((tile, index) => (
        <group key={tile.id} position={[0, 0, -tile.z]}>
          <mesh receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[15, 0.2, 15]} />
            <meshStandardMaterial 
              color="#616161"
              roughness={0.8}
            />
          </mesh>
          
          <mesh position={[-4, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.3, 15]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[4, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.3, 15]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {index % 3 === 0 && (
            <>
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[12, 0.05, 0.5]} />
                <meshStandardMaterial color="#FFF" opacity={0.5} transparent />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
