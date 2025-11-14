import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Trophy, RotateCcw, Volume2, VolumeX, Star } from "lucide-react";

export function VictoryScreen() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const start = useStepChallenge((state) => state.start);
  const restart = useStepChallenge((state) => state.restart);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg z-10 bg-white/90 hover:bg-white"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-2xl mx-4 shadow-2xl text-center border-4 border-yellow-400">
        <div className="mb-6">
          <div className="relative inline-block">
            <Trophy className="h-32 w-32 text-yellow-500 mx-auto mb-4 drop-shadow-2xl animate-bounce" />
            <div className="absolute -top-4 -right-4">
              <Star className="h-12 w-12 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -top-4 -left-4">
              <Star className="h-12 w-12 text-yellow-400 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }} />
            </div>
          </div>
          
          <div className="flex justify-center gap-3 text-5xl mb-6">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 mb-4" dir="rtl">
          مبروك! أحسنت! 
        </h1>
        
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-300">
          <p className="text-3xl font-black text-green-800 mb-2" dir="rtl">
            🛡️ نجحت في حماية نفسك من الفيروس! 🛡️
          </p>
          <p className="text-xl font-bold text-green-700" dir="rtl">
            وصلت لخط النهاية بأمان! 🎉
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform border-4 border-yellow-300">
            <p className="text-xl text-yellow-100 mb-2 font-bold" dir="rtl">
              🏆 النقاط النهائية
            </p>
            <p className="text-6xl font-black text-white drop-shadow-lg">{score}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform border-4 border-blue-300">
            <p className="text-xl text-blue-100 mb-2 font-bold" dir="rtl">
              🏁 المسافة المقطوعة
            </p>
            <p className="text-6xl font-black text-white drop-shadow-lg">{distance}<span className="text-3xl">م</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border-2 border-purple-300">
          <p className="text-2xl font-bold text-purple-800 mb-2" dir="rtl">
            💡 تعلمت كيف تحمي نفسك على الإنترنت!
          </p>
          <div className="flex justify-center gap-4 text-3xl">
            <span>🔒</span>
            <span>👨‍👩‍👧</span>
            <span>👁️</span>
            <span>⚠️</span>
          </div>
        </div>
        
        <p className="text-2xl font-bold text-gray-700 mb-8" dir="rtl">
          هل تريد اللعب مرة أخرى؟ 🚀
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={start}
            size="lg"
            className="text-2xl px-10 py-8 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all border-4 border-white/50"
            style={{
              boxShadow: '0 0 40px rgba(74, 222, 128, 0.6)'
            }}
          >
            <RotateCcw className="ml-2 h-7 w-7" />
            <span dir="rtl">إعادة اللعب 🎮</span>
          </Button>
          
          <Button 
            onClick={restart}
            size="lg"
            className="text-xl px-8 py-6 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold rounded-full shadow-xl transform hover:scale-105 transition-all"
          >
            <span dir="rtl">رجوع للقائمة 🏠</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
