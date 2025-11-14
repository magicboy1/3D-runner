import { useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

function PlayerModel({ isRunning, animationPhase }: { isRunning: boolean, animationPhase: number }) {
  const { scene } = useGLTF("/models/player.glb");
  const clonedScene = scene.clone();
  
  clonedScene.rotation.y = 0;
  
  if (isRunning) {
    clonedScene.rotation.x = Math.sin(animationPhase * 10) * 0.05;
    clonedScene.position.y = Math.abs(Math.sin(animationPhase * 10)) * 0.1;
  }
  
  return <primitive object={clonedScene} scale={1.5} position={[0, 0, 0]} />;
}

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const playerAction = useStepChallenge((state) => state.playerAction);
  const resetAction = useStepChallenge((state) => state.resetAction);
  const setPlayerPosition = useStepChallenge((state) => state.setPlayerPosition);
  
  const jumpVelocityRef = useRef(0);
  const isJumpingRef = useRef(false);
  const slideTimerRef = useRef(0);
  const animationPhaseRef = useRef(0);
  
  const lanePositions = {
    left: -4,
    center: 0,
    right: 4
  };
  
  useEffect(() => {
    if (playerAction === "jumping" && !isJumpingRef.current) {
      jumpVelocityRef.current = 0.45;
      isJumpingRef.current = true;
    } else if (playerAction === "sliding") {
      slideTimerRef.current = 0.5;
    }
  }, [playerAction]);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      animationPhaseRef.current += delta;
      
      const targetX = lanePositions[currentLane];
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.2
      );
      
      if (isJumpingRef.current) {
        groupRef.current.position.y += jumpVelocityRef.current;
        jumpVelocityRef.current -= 0.025;
        
        if (groupRef.current.position.y <= 0) {
          groupRef.current.position.y = 0;
          isJumpingRef.current = false;
          jumpVelocityRef.current = 0;
          resetAction();
        }
      } else if (slideTimerRef.current > 0) {
        slideTimerRef.current -= delta;
        groupRef.current.scale.y = 0.4;
        groupRef.current.position.y = 0.2;
        
        if (slideTimerRef.current <= 0) {
          groupRef.current.scale.y = 1;
          groupRef.current.position.y = 0;
          resetAction();
        }
      } else {
        groupRef.current.position.y = 0;
        groupRef.current.scale.y = 1;
      }
      
      const currentHeight = 1.2 * groupRef.current.scale.y;
      setPlayerPosition(groupRef.current.position.y, currentHeight);
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} castShadow>
      <Suspense fallback={
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
      }>
        <PlayerModel isRunning={true} animationPhase={animationPhaseRef.current} />
      </Suspense>
    </group>
  );
}
