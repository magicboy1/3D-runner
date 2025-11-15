import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Player } from "./Player";
import { Ground } from "./Ground";
import { Lights } from "./Lights";
import { Obstacles } from "./Obstacles";
import { Collectibles } from "./Collectibles";
import { SafeZone } from "./SafeZone";
import { Camera } from "./Camera";
import { Environment } from "./Environment";
import { FinishLine } from "./FinishLine";
import { LoadingScreen } from "./LoadingScreen";

interface GameSceneProps {
  onLoadComplete?: () => void;
}

export function GameScene({ onLoadComplete }: GameSceneProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 4, 8],
        fov: 60,
        near: 0.1,
        far: 1000
      }}
    >
      <color attach="background" args={["#87CEEB"]} />
      <fog attach="fog" args={["#87CEEB", 10, 60]} />
      
      {onLoadComplete && <LoadingScreen onLoadComplete={onLoadComplete} />}
      
      <Suspense fallback={null}>
        <Lights />
        <Camera />
        <Player />
        <Ground />
        <Environment />
        <Obstacles />
        <Collectibles />
        <SafeZone />
        <FinishLine />
      </Suspense>
    </Canvas>
  );
}
