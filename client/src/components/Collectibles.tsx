import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";

type CollectibleType = "lock" | "shield" | "family" | "privacy";

interface Collectible {
  id: number;
  type: CollectibleType;
  lane: "left" | "right";
  z: number;
  collected: boolean;
  rotation: number;
}

const collectibleMessages: Record<CollectibleType, string> = {
  lock: "استخدم كلمة مرور قوية 🔒",
  shield: "احرص على حماية معلوماتك 🛡️",
  family: "استأذن أهلك قبل التحميل 👨‍👩‍👧‍👦",
  privacy: "لا تشارك معلوماتك الخاصة 🔐"
};

const collectibleColors: Record<CollectibleType, string> = {
  lock: "#2196F3",
  shield: "#9C27B0",
  family: "#FF9800",
  privacy: "#00BCD4"
};

export function Collectibles() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const addScore = useStepChallenge((state) => state.addScore);
  const showMessage = useStepChallenge((state) => state.showMessage);
  const playSuccess = useAudio((state) => state.playSuccess);
  const speed = 5;
  
  const collectibles = useMemo(() => {
    const collectibleList: Collectible[] = [];
    const lanes: ("left" | "right")[] = ["left", "right"];
    const types: CollectibleType[] = ["lock", "shield", "family", "privacy"];
    
    for (let i = 0; i < 20; i++) {
      collectibleList.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -40 - (i * 12),
        collected: false,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    return collectibleList;
  }, []);
  
  const lanePositions = {
    left: -2,
    right: 2
  };
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const lanes: ("left" | "right")[] = ["left", "right"];
      const types: CollectibleType[] = ["lock", "shield", "family", "privacy"];
      
      groupRef.current.children.forEach((child, index) => {
        const collectible = collectibles[index];
        if (!collectible) return;
        
        child.position.z += speed * delta;
        child.rotation.y += delta * 2;
        
        if (!collectible.collected) {
          child.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
          child.visible = true;
        }
        
        if (child.position.z > 10) {
          child.position.z = -250;
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
        if (!collectible.collected && distanceToPlayer < 1) {
          if (collectible.lane === currentLane) {
            collectible.collected = true;
            child.visible = false;
            addScore(1);
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
          position={[lanePositions[collectible.lane], 0.5, collectible.z]}
          rotation={[0, collectible.rotation, 0]}
        >
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial 
            color={collectibleColors[collectible.type]}
            emissive={collectibleColors[collectible.type]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
