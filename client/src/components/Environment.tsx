import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#7CB342" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>
    </group>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.8, 0.2, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.8, 0.2, 0]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

export function Environment() {
  const groupRef = useRef<THREE.Group>(null);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const distance = useStepChallenge((state) => state.distance);
  
  const buildings = useMemo(() => {
    const buildingList = [];
    const colors = ['#7CB342', '#42A5F5', '#FFB74D', '#AB47BC', '#EF5350'];
    for (let i = 0; i < 40; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      buildingList.push({
        id: i,
        x: side * (12 + Math.random() * 3),
        z: -i * 25,
        height: 5 + Math.random() * 10,
        width: 3 + Math.random() * 2,
        depth: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return buildingList;
  }, []);
  
  const trees = useMemo(() => {
    const treeList = [];
    for (let i = 0; i < 60; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      treeList.push({
        id: `tree-${i}`,
        position: [side * (7 + Math.random() * 2), 0, -i * 15] as [number, number, number]
      });
    }
    return treeList;
  }, []);
  
  const clouds = useMemo(() => {
    const cloudList = [];
    for (let i = 0; i < 15; i++) {
      cloudList.push({
        id: `cloud-${i}`,
        position: [(Math.random() - 0.5) * 30, 8 + Math.random() * 4, -i * 40 - 20] as [number, number, number]
      });
    }
    return cloudList;
  }, []);
  
  useFrame((state, delta) => {
    if (distance >= 1000) return;
    
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
      {trees.map((tree) => (
        <Tree key={tree.id} position={tree.position} />
      ))}
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} position={cloud.position} />
      ))}
    </group>
  );
}
