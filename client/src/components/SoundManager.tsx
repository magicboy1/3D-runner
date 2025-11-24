import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";

export function SoundManager() {
  const setHitSound = useAudio((state) => state.setHitSound);
  const setSuccessSound = useAudio((state) => state.setSuccessSound);
  const setBackgroundMusic = useAudio((state) => state.setBackgroundMusic);
  const isMuted = useAudio((state) => state.isMuted);
  
  useEffect(() => {
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    const bgMusic = new Audio("/sounds/background.mp3");
    
    hitAudio.preload = "auto";
    successAudio.preload = "auto";
    bgMusic.preload = "auto";
    
    hitAudio.volume = 0.3;
    successAudio.volume = 0.5;
    bgMusic.volume = 0.2;
    bgMusic.loop = true;
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
    setBackgroundMusic(bgMusic);
    
    if (!isMuted) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log("Background music autoplay prevented:", err));
      }
    }
    
    return () => {
      hitAudio.pause();
      successAudio.pause();
      bgMusic.pause();
    };
  }, [setHitSound, setSuccessSound, setBackgroundMusic, isMuted]);
  
  return null;
}
