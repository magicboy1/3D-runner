import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";

type ObstacleType = "barrier" | "low" | "high";

interface Obstacle {
  id: number;
  type: ObstacleType;
  lane: "left" | "center" | "right";
  z: number;
  hit: boolean;
}

export function Obstacles() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const playerAction = useStepChallenge((state) => state.playerAction);
  const gameOver = useStepChallenge((state) => state.gameOver);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const playHit = useAudio((state) => state.playHit);
  
  const warningMessages = useMemo(() => [
    "حاول تتفادى الخطر في المرة الجاية!",
    "انتبه! تجنب الفيروسات!",
    "كن حذراً من الأخطار!",
  ], []);
  
  const obstacles = useMemo(() => {
    const obstacleList: Obstacle[] = [];
    const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
    const types: ObstacleType[] = ["barrier", "low", "high"];
    
    for (let i = 0; i < 25; i++) {
      obstacleList.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -30 - (i * 20),
        hit: false
      });
    }
    
    return obstacleList;
  }, []);
  
  const lanePositions = {
    left: -4,
    center: 0,
    right: 4
  };
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const obstacle = obstacles[index];
        if (!obstacle) return;
        
        child.position.z += gameSpeed * delta;
        
        if (child.position.z > 15) {
          child.position.z = -500;
          obstacle.hit = false;
          
          const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
          const types: ObstacleType[] = ["barrier", "low", "high"];
          obstacle.lane = lanes[Math.floor(Math.random() * lanes.length)];
          obstacle.type = types[Math.floor(Math.random() * types.length)];
          child.position.x = lanePositions[obstacle.lane];
          
          const mesh = child as THREE.Mesh;
          if (obstacle.type === "low") {
            mesh.scale.set(1.5, 0.6, 1);
            mesh.position.y = 0.3;
          } else if (obstacle.type === "high") {
            mesh.scale.set(1, 1.5, 1);
            mesh.position.y = 1.2;
          } else {
            mesh.scale.set(1, 1.8, 1);
            mesh.position.y = 0.9;
          }
        }
        
        const distanceToPlayer = Math.abs(child.position.z);
        if (distanceToPlayer < 1.5 && !obstacle.hit) {
          if (obstacle.lane === currentLane) {
            let shouldHit = false;
            
            if (obstacle.type === "barrier") {
              shouldHit = true;
            } else if (obstacle.type === "low" && playerAction !== "sliding") {
              shouldHit = true;
            } else if (obstacle.type === "high" && playerAction !== "jumping") {
              shouldHit = true;
            }
            
            if (shouldHit) {
              obstacle.hit = true;
              playHit();
              gameOver();
            }
          }
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {obstacles.map((obstacle) => {
        const height = obstacle.type === "low" ? 0.6 : obstacle.type === "high" ? 1.5 : 1.8;
        const yPos = obstacle.type === "low" ? 0.3 : obstacle.type === "high" ? 1.2 : 0.9;
        const width = obstacle.type === "low" ? 1.5 : 1;
        
        return (
          <mesh
            key={obstacle.id}
            position={[lanePositions[obstacle.lane], yPos, obstacle.z]}
            castShadow
          >
            <boxGeometry args={[width, height, 1]} />
            <meshStandardMaterial color="#F44336" />
          </mesh>
        );
      })}
    </group>
  );
}
