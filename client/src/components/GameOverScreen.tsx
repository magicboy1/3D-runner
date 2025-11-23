import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Trophy, RotateCcw, Volume2, VolumeX } from "lucide-react";

export function GameOverScreen() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const start = useStepChallenge((state) => state.start);
  const restart = useStepChallenge((state) => state.restart);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-10 bg-white/90 hover:bg-white"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 lg:p-12 max-w-md mx-4 shadow-2xl text-center border-4 border-white/30">
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-bounce">😵</div>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-3" dir="rtl">
          للأسف! 
        </h1>
        <p className="text-xl lg:text-2xl font-bold text-gray-700 mb-6" dir="rtl">
          اصطدمت بفيروس! 🦠
        </p>
        
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 lg:p-6 shadow-xl">
            <p className="text-sm lg:text-lg text-blue-100 mb-1 lg:mb-2 font-bold" dir="rtl">
              النقاط
            </p>
            <p className="text-3xl lg:text-5xl font-black text-white drop-shadow-lg">{score}</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 lg:p-6 shadow-xl">
            <p className="text-sm lg:text-lg text-green-100 mb-1 lg:mb-2 font-bold" dir="rtl">
              المسافة
            </p>
            <p className="text-3xl lg:text-5xl font-black text-white drop-shadow-lg">{distance}<span className="text-lg lg:text-2xl">م</span></p>
          </div>
        </div>
        
        <p className="text-lg lg:text-xl font-bold text-gray-700 mb-6 lg:mb-8" dir="rtl">
          حاول مرة أخرى! 🚀
        </p>
        
        <div className="flex flex-col gap-3 lg:gap-4">
          <Button 
            onClick={start}
            size="lg"
            className="text-xl lg:text-2xl px-8 lg:px-10 py-6 lg:py-8 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all border-4 border-white/30"
            style={{
              boxShadow: '0 0 40px rgba(74, 222, 128, 0.6)'
            }}
          >
            <RotateCcw className="ml-2 h-6 lg:h-7 w-6 lg:w-7" />
            <span dir="rtl">إعادة اللعب 🎮</span>
          </Button>
          
          <Button 
            onClick={restart}
            size="lg"
            className="text-lg lg:text-xl px-6 lg:px-8 py-5 lg:py-6 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold rounded-full shadow-xl transform hover:scale-105 transition-all"
          >
            <span dir="rtl">رجوع للقائمة 🏠</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
