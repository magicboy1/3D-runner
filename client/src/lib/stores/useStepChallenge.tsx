import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type GamePhase = "menu" | "playing" | "gameover" | "victory";
export type Lane = "left" | "center" | "right";
export type PlayerAction = "running" | "jumping" | "sliding";

interface Message {
  text: string;
  type: "warning" | "success";
  timestamp: number;
}

interface GameState {
  phase: GamePhase;
  score: number;
  distance: number;
  currentLane: Lane;
  playerAction: PlayerAction;
  playerY: number;
  playerHeight: number;
  playerRef: THREE.Group | null;
  message: Message | null;
  gameSpeed: number;
  multiplier: number;
  
  start: () => void;
  restart: () => void;
  switchLane: (lane: Lane) => void;
  jump: () => void;
  slide: () => void;
  resetAction: () => void;
  setPlayerPosition: (y: number, height: number) => void;
  setPlayerRef: (ref: THREE.Group | null) => void;
  addScore: (points: number) => void;
  addDistance: (dist: number) => void;
  increaseSpeed: () => void;
  showMessage: (text: string, type: "warning" | "success") => void;
  clearMessage: () => void;
  gameOver: () => void;
  victory: () => void;
}

export const useStepChallenge = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "menu",
    score: 0,
    distance: 0,
    currentLane: "center",
    playerAction: "running",
    playerY: 0,
    playerHeight: 1.2,
    playerRef: null,
    message: null,
    gameSpeed: 15,
    multiplier: 1,
    
    start: () => {
      set({ 
        phase: "playing", 
        score: 0,
        distance: 0,
        currentLane: "center",
        playerAction: "running",
        playerY: 1.2,
        playerHeight: 1.2,
        message: null,
        gameSpeed: 15,
        multiplier: 1
      });
    },
    
    restart: () => {
      set({ 
        phase: "menu",
        score: 0,
        distance: 0,
        currentLane: "center",
        playerAction: "running",
        playerY: 1.2,
        playerHeight: 1.2,
        message: null,
        gameSpeed: 15,
        multiplier: 1
      });
    },
    
    switchLane: (lane: Lane) => {
      set({ currentLane: lane });
    },
    
    jump: () => {
      set((state) => {
        if (state.playerAction === "running") {
          return { playerAction: "jumping" };
        }
        return {};
      });
    },
    
    slide: () => {
      set((state) => {
        if (state.playerAction === "running") {
          return { playerAction: "sliding" };
        }
        return {};
      });
    },
    
    resetAction: () => {
      set({ playerAction: "running" });
    },
    
    setPlayerPosition: (y: number, height: number) => {
      set({ playerY: y, playerHeight: height });
    },
    
    setPlayerRef: (ref: THREE.Group | null) => {
      set({ playerRef: ref });
    },
    
    addScore: (points: number) => {
      set((state) => ({ 
        score: state.score + (points * state.multiplier)
      }));
    },
    
    addDistance: (dist: number) => {
      set((state) => {
        const newDistance = state.distance + dist;
        if (newDistance >= 1000 && state.phase === "playing") {
          return { distance: newDistance, phase: "victory" };
        }
        return { distance: newDistance };
      });
    },
    
    increaseSpeed: () => {
      set((state) => ({ 
        gameSpeed: Math.min(state.gameSpeed + 0.5, 25)
      }));
    },
    
    showMessage: (text: string, type: "warning" | "success") => {
      set({ message: { text, type, timestamp: Date.now() } });
    },
    
    clearMessage: () => {
      set({ message: null });
    },
    
    gameOver: () => {
      set({ phase: "gameover" });
    },
    
    victory: () => {
      set({ phase: "victory" });
    }
  }))
);
