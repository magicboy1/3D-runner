import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Ground() {
  const groupRef = useRef<THREE.Group>(null);
  const speed = 5;
  
  const tiles = useMemo(() => {
    const tileList = [];
    for (let i = 0; i < 20; i++) {
      tileList.push({
        id: i,
        z: i * 10
      });
    }
    return tileList;
  }, []);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((tile) => {
        tile.position.z += speed * delta;
        
        if (tile.position.z > 10) {
          tile.position.z -= 200;
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {tiles.map((tile, index) => (
        <mesh key={tile.id} position={[0, 0, -tile.z]} receiveShadow>
          <boxGeometry args={[10, 0.2, 10]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#8BC34A" : "#9CCC65"} 
          />
        </mesh>
      ))}
    </group>
  );
}
