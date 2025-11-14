import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
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
      
      <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl lg:text-8xl font-black text-white drop-shadow-2xl mb-4" dir="rtl"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.3)'
              }}>
            عداء الأمان الرقمي
          </h1>
          <h2 className="text-3xl lg:text-5xl font-bold text-white/90 drop-shadow-lg" dir="rtl">
            Digital Safety Runner
          </h2>
        </div>
        
        <div className="relative mb-12 -ml-20 lg:-ml-32">
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
