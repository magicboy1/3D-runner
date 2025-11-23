import { useState, useEffect } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.log('Fullscreen error:', err);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/game-preview.png)'
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-20 bg-white/90 hover:bg-white"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <Button 
        onClick={toggleFullscreen}
        variant="secondary"
        size="icon"
        className="absolute bottom-4 left-4 rounded-full shadow-lg z-20 bg-white/90 hover:bg-white"
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </Button>
      
      <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl lg:text-7xl font-black text-white drop-shadow-2xl mb-4" dir="rtl"
              style={{
                textShadow: '0 8px 0 rgba(0, 0, 0, 0.3), 0 12px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)',
                transform: 'perspective(500px) rotateX(10deg)',
                transformStyle: 'preserve-3d'
              }}>
            عداء الأمان الرقمي
          </h1>
          <h2 className="text-2xl lg:text-4xl font-bold text-white/90 drop-shadow-lg" dir="rtl"
              style={{
                textShadow: '0 4px 0 rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.4)',
                transform: 'perspective(500px) rotateX(8deg)'
              }}>
            Digital Safety Runner
          </h2>
        </div>
        
        <div className="relative mb-12 -ml-2.5">
          <img 
            src="/images/hero-character.png" 
            alt="Hero Character" 
            className="w-72 h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>
        
        <Button 
          onClick={start}
          size="lg"
          className="text-3xl px-16 py-10 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300"
          style={{
            boxShadow: '0 20px 60px rgba(74, 222, 128, 0.5), 0 0 80px rgba(16, 185, 129, 0.3), inset 0 -4px 20px rgba(0, 0, 0, 0.3)',
            transform: 'perspective(1000px) rotateX(5deg)',
            border: '4px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <span dir="rtl" className="flex items-center gap-4">
            <span>🚀</span>
            <span>ابدأ اللعب</span>
            <span>🎯</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
