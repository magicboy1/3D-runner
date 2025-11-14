import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "victory";
export type Lane = "left" | "right";

interface Message {
  text: string;
  type: "warning" | "success";
  timestamp: number;
}

interface GameState {
  phase: GamePhase;
  score: number;
  progress: number;
  currentLane: Lane;
  message: Message | null;
  
  start: () => void;
  restart: () => void;
  switchLane: (lane: Lane) => void;
  addScore: (points: number) => void;
  updateProgress: (progress: number) => void;
  showMessage: (text: string, type: "warning" | "success") => void;
  clearMessage: () => void;
  victory: () => void;
}

export const useStepChallenge = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "menu",
    score: 0,
    progress: 0,
    currentLane: "left",
    message: null,
    
    start: () => {
      set({ 
        phase: "playing", 
        score: 0, 
        progress: 0,
        currentLane: "left",
        message: null
      });
    },
    
    restart: () => {
      set({ 
        phase: "menu",
        score: 0,
        progress: 0,
        currentLane: "left",
        message: null
      });
    },
    
    switchLane: (lane: Lane) => {
      set({ currentLane: lane });
    },
    
    addScore: (points: number) => {
      set((state) => ({ score: state.score + points }));
    },
    
    updateProgress: (progress: number) => {
      set({ progress });
    },
    
    showMessage: (text: string, type: "warning" | "success") => {
      set({ message: { text, type, timestamp: Date.now() } });
    },
    
    clearMessage: () => {
      set({ message: null });
    },
    
    victory: () => {
      set({ phase: "victory" });
    }
  }))
);
