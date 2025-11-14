import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-400 to-green-400 z-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg" dir="rtl">
          تحدي الخطوات
        </h1>
        <h2 className="text-3xl text-white mb-8 drop-shadow-md" dir="rtl">
          Step Challenge
        </h2>
        <p className="text-xl text-white mb-12 max-w-md mx-auto drop-shadow-md" dir="rtl">
          تعلم الأمان الرقمي بطريقة ممتعة! اجمع الأيقونات الآمنة وتجنب الفيروسات
        </p>
        <Button 
          onClick={start}
          size="lg"
          className="text-2xl px-12 py-8 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg"
        >
          <span dir="rtl">ابدأ اللعب</span>
        </Button>
      </div>
    </div>
  );
}
