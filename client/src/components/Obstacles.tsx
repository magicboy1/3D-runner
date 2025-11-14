import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";

interface Obstacle {
  id: number;
  lane: "left" | "right";
  z: number;
  hit: boolean;
}

export function Obstacles() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const addScore = useStepChallenge((state) => state.addScore);
  const showMessage = useStepChallenge((state) => state.showMessage);
  const playHit = useAudio((state) => state.playHit);
  const speed = 5;
  
  const warningMessages = useMemo(() => [
    "حاول تتفادى الخطر في المرة الجاية!",
    "انتبه! تجنب الفيروسات!",
    "كن حذراً من الأخطار!",
  ], []);
  
  const obstacles = useMemo(() => {
    const obstacleList: Obstacle[] = [];
    const lanes: ("left" | "right")[] = ["left", "right"];
    
    for (let i = 0; i < 15; i++) {
      obstacleList.push({
        id: i,
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -30 - (i * 15),
        hit: false
      });
    }
    
    return obstacleList;
  }, []);
  
  const lanePositions = {
    left: -2,
    right: 2
  };
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const obstacle = obstacles[index];
        if (!obstacle) return;
        
        child.position.z += speed * 0.016;
        
        if (child.position.z > 10) {
          child.position.z = -250;
          obstacle.hit = false;
        }
        
        const distanceToPlayer = Math.abs(child.position.z);
        if (distanceToPlayer < 1 && !obstacle.hit) {
          if (obstacle.lane === currentLane) {
            obstacle.hit = true;
            addScore(-1);
            playHit();
            showMessage(
              warningMessages[Math.floor(Math.random() * warningMessages.length)],
              "warning"
            );
          }
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {obstacles.map((obstacle) => (
        <mesh
          key={obstacle.id}
          position={[lanePositions[obstacle.lane], 0.5, obstacle.z]}
          castShadow
        >
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color="#F44336" />
        </mesh>
      ))}
    </group>
  );
}
