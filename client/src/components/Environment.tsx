import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Environment() {
  const groupRef = useRef<THREE.Group>(null);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  
  const buildings = useMemo(() => {
    const buildingList = [];
    for (let i = 0; i < 40; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      buildingList.push({
        id: i,
        x: side * (12 + Math.random() * 5),
        z: -i * 25,
        height: 5 + Math.random() * 15,
        width: 4 + Math.random() * 3,
        depth: 4 + Math.random() * 3,
        color: `hsl(${200 + Math.random() * 60}, 50%, ${40 + Math.random() * 20}%)`
      });
    }
    return buildingList;
  }, []);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        child.position.z += gameSpeed * delta;
        
        if (child.position.z > 20) {
          child.position.z -= 1000;
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {buildings.map((building) => (
        <mesh
          key={building.id}
          position={[building.x, building.height / 2, building.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
    </group>
  );
}
