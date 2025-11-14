import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const playerAction = useStepChallenge((state) => state.playerAction);
  const resetAction = useStepChallenge((state) => state.resetAction);
  
  const jumpVelocityRef = useRef(0);
  const isJumpingRef = useRef(false);
  const slideTimerRef = useRef(0);
  
  const lanePositions = {
    left: -4,
    center: 0,
    right: 4
  };
  
  useEffect(() => {
    if (playerAction === "jumping" && !isJumpingRef.current) {
      jumpVelocityRef.current = 0.35;
      isJumpingRef.current = true;
    } else if (playerAction === "sliding") {
      slideTimerRef.current = 0.5;
    }
  }, [playerAction]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetX = lanePositions[currentLane];
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.2
      );
      
      if (isJumpingRef.current) {
        meshRef.current.position.y += jumpVelocityRef.current;
        jumpVelocityRef.current -= 0.025;
        
        if (meshRef.current.position.y <= 0.6) {
          meshRef.current.position.y = 0.6;
          isJumpingRef.current = false;
          jumpVelocityRef.current = 0;
          resetAction();
        }
      } else if (slideTimerRef.current > 0) {
        slideTimerRef.current -= delta;
        meshRef.current.scale.y = 0.5;
        meshRef.current.position.y = 0.4;
        
        if (slideTimerRef.current <= 0) {
          meshRef.current.scale.y = 1;
          meshRef.current.position.y = 0.6;
          resetAction();
        }
      } else {
        meshRef.current.position.y = 0.6;
        meshRef.current.scale.y = 1;
      }
      
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 6) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[0.8, 1.2, 0.8]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}
