import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Trophy, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export function VictoryScreen() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const start = useStepChallenge((state) => state.start);
  const restart = useStepChallenge((state) => state.restart);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.3}
      />
      
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-10 bg-white/90 hover:bg-white pointer-events-auto"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-4 lg:p-6 max-w-md mx-4 shadow-2xl text-center border-4 border-yellow-400 max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="mb-3">
          <div className="relative inline-block">
            <Trophy className="h-16 lg:h-20 w-16 lg:w-20 text-yellow-500 mx-auto mb-2 drop-shadow-2xl animate-bounce" />
          </div>
          
          <div className="flex justify-center gap-2 text-2xl lg:text-3xl mb-2">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          </div>
        </div>
        
        <h1 className="text-2xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 mb-3" dir="rtl">
          مبروك! أحسنت! 
        </h1>
        
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-3 mb-3 border-2 border-green-300">
          <p className="text-lg lg:text-xl font-black text-green-800 mb-1" dir="rtl">
            🛡️ وصلت لخط النهاية بأمان! 🎉
          </p>
          <p className="text-sm lg:text-base font-bold text-green-700" dir="rtl">
            نجحت في حماية نفسك من الفيروس!
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-3 lg:p-4 shadow-xl border-2 border-yellow-300">
            <p className="text-xs lg:text-sm text-yellow-100 mb-1 font-bold" dir="rtl">
              🏆 النقاط
            </p>
            <p className="text-2xl lg:text-4xl font-black text-white drop-shadow-lg">{score}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-3 lg:p-4 shadow-xl border-2 border-blue-300">
            <p className="text-xs lg:text-sm text-blue-100 mb-1 font-bold" dir="rtl">
              🏁 المسافة
            </p>
            <p className="text-2xl lg:text-4xl font-black text-white drop-shadow-lg">{distance}<span className="text-lg lg:text-xl">م</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3 mb-3 border-2 border-purple-300">
          <p className="text-sm lg:text-base font-bold text-purple-800 mb-1" dir="rtl">
            💡 تعلمت كيف تحمي نفسك على الإنترنت!
          </p>
          <div className="flex justify-center gap-2 lg:gap-3 text-xl lg:text-2xl">
            <span>🔒</span>
            <span>👨‍👩‍👧</span>
            <span>👁️</span>
            <span>⚠️</span>
          </div>
        </div>
        
        <p className="text-base lg:text-lg font-bold text-gray-700 mb-3" dir="rtl">
          هل تريد اللعب مرة أخرى؟ 🚀
        </p>
        
        <div className="flex flex-col gap-2 lg:gap-3">
          <Button 
            onClick={start}
            size="lg"
            className="text-lg lg:text-xl px-6 lg:px-8 py-4 lg:py-5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all border-4 border-white/50"
            style={{
              boxShadow: '0 0 40px rgba(74, 222, 128, 0.6)'
            }}
          >
            <RotateCcw className="ml-2 h-5 lg:h-6 w-5 lg:w-6" />
            <span dir="rtl">إعادة اللعب 🎮</span>
          </Button>
          
          <Button 
            onClick={restart}
            size="lg"
            className="text-base lg:text-lg px-5 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold rounded-full shadow-xl transform hover:scale-105 transition-all"
          >
            <span dir="rtl">رجوع للقائمة 🏠</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
