import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Ground() {
  const groupRef = useRef<THREE.Group>(null);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const distance = useStepChallenge((state) => state.distance);
  const phase = useStepChallenge((state) => state.phase);
  const addDistance = useStepChallenge((state) => state.addDistance);
  const increaseSpeed = useStepChallenge((state) => state.increaseSpeed);
  
  const distanceCounterRef = useRef(0);
  const lastPhaseRef = useRef(phase);
  
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
    if (lastPhaseRef.current !== phase && phase === "playing") {
      distanceCounterRef.current = 0;
      if (groupRef.current) {
        groupRef.current.children.forEach((tile, index) => {
          tile.position.z = -tiles[index].z;
        });
      }
    }
    lastPhaseRef.current = phase;
    
    if (phase !== "playing") return;
    
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
          <mesh receiveShadow position={[0, -0.1, 0]}>
            <boxGeometry args={[10, 0.2, 15]} />
            <meshStandardMaterial 
              color="#D97C47"
              roughness={0.9}
            />
          </mesh>
          
          <mesh position={[-1.5, 0.01, 0]}>
            <boxGeometry args={[0.15, 0.02, 15]} />
            <meshStandardMaterial 
              color="#A0522D"
            />
          </mesh>
          <mesh position={[1.5, 0.01, 0]}>
            <boxGeometry args={[0.15, 0.02, 15]} />
            <meshStandardMaterial 
              color="#A0522D"
            />
          </mesh>
          
          <mesh position={[-5.5, -0.05, 0]}>
            <boxGeometry args={[1, 0.3, 15]} />
            <meshStandardMaterial color="#7CB342" />
          </mesh>
          <mesh position={[5.5, -0.05, 0]}>
            <boxGeometry args={[1, 0.3, 15]} />
            <meshStandardMaterial color="#7CB342" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
