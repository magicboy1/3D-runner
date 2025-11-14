import { useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

function PlayerModel() {
  const runPhase = useRef(0);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    runPhase.current += delta * 10;
    
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(runPhase.current) * 0.6;
      rightLegRef.current.rotation.x = Math.sin(runPhase.current + Math.PI) * 0.6;
    }
    
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(runPhase.current + Math.PI) * 0.5;
      rightArmRef.current.rotation.x = Math.sin(runPhase.current) * 0.5;
    }
    
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.6 + Math.abs(Math.sin(runPhase.current * 2)) * 0.05;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={bodyRef} position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFD4A3" />
      </mesh>
      
      <group position={[-0.15, 0.25, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#2E5C8A" />
        </mesh>
      </group>
      
      <group position={[0.15, 0.25, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#2E5C8A" />
        </mesh>
      </group>
      
      <group position={[-0.35, 0.85, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
      </group>
      
      <group position={[0.35, 0.85, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
      </group>
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
