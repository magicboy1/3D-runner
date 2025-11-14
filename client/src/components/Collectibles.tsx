import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";

type CollectibleType = "coin" | "lock" | "family" | "privacy" | "warning";

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
  family: "استأذن أهلك قبل التحميل 👨‍👩‍👧",
  privacy: "لا تشارك موقعك 👁️",
  warning: "احترس من الروابط الغريبة ⚠️"
};

const collectiblePoints: Record<CollectibleType, number> = {
  coin: 10,
  lock: 25,
  family: 25,
  privacy: 25,
  warning: 25
};

function CoinModel() {
  const { scene } = useGLTF("/models/coin.glb");
  const clonedScene = scene.clone();
  
  return <primitive object={clonedScene} scale={0.5} />;
}

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
    const types: CollectibleType[] = ["coin", "coin", "coin", "lock", "family", "privacy", "warning"];
    
    for (let i = 0; i < 30; i++) {
      collectibleList.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -50 - (i * 18),
        collected: false,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    return collectibleList;
  }, []);
  
  const lanePositions = {
    left: -3,
    center: 0,
    right: 3
  };
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
      const types: CollectibleType[] = ["coin", "coin", "coin", "lock", "family", "privacy", "warning"];
      
      groupRef.current.children.forEach((child, index) => {
        const collectible = collectibles[index];
        if (!collectible) return;
        
        child.position.z += gameSpeed * delta;
        child.rotation.y += delta * 4;
        
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
  
  const getCollectibleMesh = (type: CollectibleType) => {
    if (type === "coin") {
      return <CoinModel />;
    }
    
    const colors: Record<Exclude<CollectibleType, "coin">, string> = {
      lock: "#2196F3",
      family: "#4CAF50",
      privacy: "#9C27B0",
      warning: "#FF5722"
    };
    
    return (
      <mesh>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial 
          color={colors[type]}
          emissive={colors[type]}
          emissiveIntensity={0.5}
        />
      </mesh>
    );
  };
  
  return (
    <group ref={groupRef}>
      {collectibles.map((collectible) => (
        <group
          key={collectible.id}
          position={[lanePositions[collectible.lane], 1, collectible.z]}
          rotation={[0, collectible.rotation, 0]}
        >
          <Suspense fallback={
            <mesh>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
          }>
            {getCollectibleMesh(collectible.type)}
          </Suspense>
        </group>
      ))}
    </group>
  );
}
