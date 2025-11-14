import { useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

function PlayerModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/player.glb");
  const clonedScene = scene.clone();
  const runPhase = useRef(0);
  
  useFrame((state, delta) => {
    runPhase.current += delta * 8;
    
    if (group.current) {
      const bounce = Math.abs(Math.sin(runPhase.current)) * 0.03;
      group.current.position.y = 1.2 + bounce;
      
      const tilt = Math.sin(runPhase.current) * 0.02;
      group.current.rotation.x = tilt;
    }
  });
  
  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={clonedScene} scale={1.5} />
    </group>
  );
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
  
  const lanePositions = {
    left: -3,
    center: 0,
    right: 3
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
        <PlayerModel />
      </Suspense>
    </group>
  );
}
