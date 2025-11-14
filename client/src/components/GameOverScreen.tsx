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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-red-400 to-orange-400 z-50">
      <Button 
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 rounded-full shadow-lg"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      <div className="bg-white/95 backdrop-blur rounded-3xl p-12 max-w-lg mx-4 shadow-2xl text-center">
        <Trophy className="h-24 w-24 text-orange-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4" dir="rtl">
          انتهت اللعبة! 
        </h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-100 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-2" dir="rtl">
              النقاط
            </p>
            <p className="text-5xl font-bold text-blue-600">{score}</p>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-2" dir="rtl">
              المسافة
            </p>
            <p className="text-5xl font-bold text-green-600">{distance}<span className="text-2xl">م</span></p>
          </div>
        </div>
        
        <p className="text-lg text-gray-700 mb-8" dir="rtl">
          حاول مرة أخرى لتحسين نتيجتك!
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={start}
            size="lg"
            className="text-xl px-8 py-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
          >
            <RotateCcw className="ml-2 h-6 w-6" />
            <span dir="rtl">إعادة اللعب</span>
          </Button>
          
          <Button 
            onClick={restart}
            size="lg"
            variant="outline"
            className="text-xl px-8 py-6 font-bold rounded-full"
          >
            <span dir="rtl">رجوع للقائمة</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
