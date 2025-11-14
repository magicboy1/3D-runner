import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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

function VirusModel({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF("/models/virus.glb");
  const clonedScene = scene.clone();
  
  return <primitive object={clonedScene} scale={scale} />;
}

export function Obstacles() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const playerY = useStepChallenge((state) => state.playerY);
  const playerHeight = useStepChallenge((state) => state.playerHeight);
  const gameOver = useStepChallenge((state) => state.gameOver);
  const gameSpeed = useStepChallenge((state) => state.gameSpeed);
  const playHit = useAudio((state) => state.playHit);
  
  const obstacles = useMemo(() => {
    const obstacleList: Obstacle[] = [];
    const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
    
    for (let i = 0; i < 25; i++) {
      obstacleList.push({
        id: i,
        type: "barrier",
        lane: lanes[Math.floor(Math.random() * lanes.length)],
        z: -40 - (i * 22),
        hit: false
      });
    }
    
    return obstacleList;
  }, []);
  
  const lanePositions = {
    left: -3,
    center: 0,
    right: 3
  };
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const obstacle = obstacles[index];
        if (!obstacle) return;
        
        child.position.z += gameSpeed * delta;
        child.rotation.y += delta * 2;
        
        if (child.position.z > 15) {
          child.position.z = -500;
          obstacle.hit = false;
          
          const lanes: ("left" | "center" | "right")[] = ["left", "center", "right"];
          
          const veryCloseObstacles = obstacles.filter((obs, idx) => {
            if (idx === index) return false;
            const otherChild = groupRef.current?.children[idx];
            if (!otherChild) return false;
            const zDiff = Math.abs(otherChild.position.z - (-500));
            return zDiff < 10;
          });
          
          const occupiedLanes = veryCloseObstacles.map(obs => obs.lane);
          
          let newLane: "left" | "center" | "right";
          if (occupiedLanes.length >= 2) {
            const freeLane = lanes.find(lane => !occupiedLanes.includes(lane));
            newLane = freeLane || lanes[Math.floor(Math.random() * lanes.length)];
          } else {
            const availableLanes = lanes.filter(lane => !occupiedLanes.includes(lane));
            newLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          }
          
          obstacle.lane = newLane;
          obstacle.type = "barrier";
          
          child.position.x = lanePositions[newLane];
          child.position.y = 1.2;
        }
        
        const distanceToPlayer = Math.abs(child.position.z);
        if (distanceToPlayer < 1.5 && !obstacle.hit) {
          if (obstacle.lane !== currentLane) return;
          
          const playerTop = playerY + playerHeight / 2;
          const playerBottom = playerY - playerHeight / 2;
          
          const obstacleY = child.position.y;
          const obstacleHeight = 1.0;
          const obstacleBottom = obstacleY - obstacleHeight / 2;
          const obstacleTop = obstacleY + obstacleHeight / 2;
          
          const verticalOverlap = !(playerTop < obstacleBottom || playerBottom > obstacleTop);
          
          if (verticalOverlap) {
            console.log("Collision detected!", {
              lane: obstacle.lane,
              currentLane,
              playerY,
              playerHeight,
              playerTop,
              playerBottom,
              obstacleY,
              obstacleHeight,
              obstacleBottom,
              obstacleTop,
              type: obstacle.type
            });
            obstacle.hit = true;
            playHit();
            gameOver();
          }
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {obstacles.map((obstacle) => {
        const yPos = 1.2;
        const scale = 1.0;
        
        return (
          <group
            key={obstacle.id}
            position={[lanePositions[obstacle.lane], yPos, obstacle.z]}
          >
            <Suspense fallback={
              <mesh castShadow>
                <boxGeometry args={[1, 1.2, 1]} />
                <meshStandardMaterial color="#F44336" />
              </mesh>
            }>
              <VirusModel scale={scale} />
            </Suspense>
          </group>
        );
      })}
    </group>
  );
}
