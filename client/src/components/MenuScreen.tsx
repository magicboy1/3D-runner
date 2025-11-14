import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-10"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 px-4 max-w-6xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <img 
            src="/images/hero-character.png" 
            alt="Hero Character" 
            className="relative w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl animate-bounce"
            style={{ animationDuration: '3s' }}
          />
        </div>
        
        <div className="text-center lg:text-right">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg" dir="rtl">
            عداء الأمان الرقمي
          </h1>
          <h2 className="text-2xl lg:text-4xl text-white/90 mb-8 drop-shadow-md" dir="rtl">
            Digital Safety Runner
          </h2>
          <p className="text-lg lg:text-xl text-white mb-8 max-w-md mx-auto lg:mx-0 drop-shadow-md" dir="rtl">
            اركض، اقفز، وانزلق! اجمع العملات وتجنب الفيروسات في لعبة سريعة ومثيرة!
          </p>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 max-w-md mx-auto lg:mx-0 shadow-xl border border-white/30">
            <p className="text-white font-bold mb-3 text-lg" dir="rtl">👆 التحكم:</p>
            <p className="text-white" dir="rtl">اسحب يمين/يسار للتحرك بين المسارات</p>
            <p className="text-white" dir="rtl">اسحب لأعلى للقفز | اسحب لأسفل للانزلاق</p>
          </div>
          <Button 
            onClick={start}
            size="lg"
            className="text-2xl px-12 py-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <span dir="rtl">ابدأ اللعب 🚀</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
