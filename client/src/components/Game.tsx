import { useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { GameScene } from "./GameScene";
import { GameUI } from "./GameUI";
import { MenuScreen } from "./MenuScreen";
import { GameOverScreen } from "./GameOverScreen";
import { SoundManager } from "./SoundManager";
import { TouchControls } from "./TouchControls";

enum Controls {
  left = "left",
  right = "right",
  jump = "jump",
  slide = "slide"
}

export function Game() {
  const phase = useStepChallenge((state) => state.phase);
  const switchLane = useStepChallenge((state) => state.switchLane);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const jump = useStepChallenge((state) => state.jump);
  const slide = useStepChallenge((state) => state.slide);
  
  const keyMap = [
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["ArrowUp", "KeyW", "Space"] },
    { name: Controls.slide, keys: ["ArrowDown", "KeyS"] }
  ];
  
  
  return (
    <KeyboardControls map={keyMap}>
      <SoundManager />
      <TouchControls />
      
      {phase === "menu" && <MenuScreen />}
      {phase === "gameover" && <GameOverScreen />}
      
      {phase === "playing" && (
        <>
          <GameScene />
          <GameUI />
        </>
      )}
    </KeyboardControls>
  );
}
