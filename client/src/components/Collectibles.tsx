import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";

type CollectibleType = "coin" | "lock" | "shield" | "magnet";

interface Collectible {
  id: number;
  type: CollectibleType;
  lane: "left" | "center" | "right";
  z: number;
  collected: boolean;
  rotation: number;
}

const collectibleMessages: Record<CollectibleType, string> = {
  coin: "عملة! 🪙",
  lock: "استخدم كلمة مرور قوية 🔒",
  shield: "احرص على حماية معلوماتك 🛡️",
  magnet: "مغناطيس العملات! 🧲"
};

const collectibleColors: Record<CollectibleType, string> = {
  coin: "#FFD700",
  lock: "#2196F3",
  shield: "#9C27B0",
  magnet: "#FF9800"
};

const collectiblePoints: Record<CollectibleType, number> = {
  coin: 10,
  lock: 25,
  shield: 25,
  magnet: 50
};

export function Collectibles() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const addScore = useStepChallenge((state) => state.addScore);
  const showMessage = useStepChallenge((state) => state.showMessage);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const playSuccess = useAudio((state) => state.playSuccess);
  
  const collectibles = useMemo(() => {
    const collectibleList: Collectible[] = [];
    const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
    const types: CollectibleType[] = ["coin", "coin", "coin", "lock", "shield", "magnet"];
    
    for (let i = 0; i < 30; i++) {
      collectibleList.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -40 - (i * 15),
        collected: false,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    return collectibleList;
  }, []);
  
  const lanePositions = {
    left: -4,
    center: 0,
    right: 4
  };
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
      const types: CollectibleType[] = ["coin", "coin", "coin", "lock", "shield", "magnet"];
      
      groupRef.current.children.forEach((child, index) => {
        const collectible = collectibles[index];
        if (!collectible) return;
        
        child.position.z += gameSpeed * delta;
        child.rotation.y += delta * 3;
        
        if (!collectible.collected) {
          child.position.y = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3;
          child.visible = true;
        }
        
        if (child.position.z > 15) {
          child.position.z = -500;
          collectible.collected = false;
          collectible.lane = lanes[Math.floor(Math.random() * lanes.length)];
          collectible.type = types[Math.floor(Math.random() * types.length)];
          child.visible = true;
          child.position.x = lanePositions[collectible.lane];
          
          const mesh = child as THREE.Mesh;
          if (mesh.material && 'color' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(collectibleColors[collectible.type]);
            (mesh.material as THREE.MeshStandardMaterial).emissive.set(collectibleColors[collectible.type]);
          }
        }
        
        const distanceToPlayer = Math.abs(child.position.z);
        if (!collectible.collected && distanceToPlayer < 1.2) {
          if (collectible.lane === currentLane) {
            collectible.collected = true;
            child.visible = false;
            addScore(collectiblePoints[collectible.type]);
            playSuccess();
            showMessage(collectibleMessages[collectible.type], "success");
          }
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {collectibles.map((collectible) => (
        <mesh
          key={collectible.id}
          position={[lanePositions[collectible.lane], 1, collectible.z]}
          rotation={[0, collectible.rotation, 0]}
        >
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial 
            color={collectibleColors[collectible.type]}
            emissive={collectibleColors[collectible.type]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
