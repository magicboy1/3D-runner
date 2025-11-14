import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";

export function VictoryScreen() {
  const score = useStepChallenge((state) => state.score);
  const start = useStepChallenge((state) => state.start);
  const restart = useStepChallenge((state) => state.restart);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-400 to-green-400 z-50">
      <div className="bg-white/95 backdrop-blur rounded-3xl p-12 max-w-lg mx-4 shadow-2xl text-center">
        <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4" dir="rtl">
          أحسنت! حميت نفسك من الفيروس 🎉
        </h1>
        
        <div className="bg-green-100 rounded-lg p-6 mb-8">
          <p className="text-2xl text-gray-700 mb-2" dir="rtl">
            النقاط النهائية
          </p>
          <p className="text-6xl font-bold text-green-600">{score}</p>
        </div>
        
        <p className="text-lg text-gray-700 mb-8" dir="rtl">
          ممتاز! لقد تعلمت كيف تحمي نفسك على الإنترنت
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={start}
            size="lg"
            className="text-xl px-8 py-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
          >
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
