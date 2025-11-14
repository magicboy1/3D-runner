import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";

export function MenuScreen() {
  const start = useStepChallenge((state) => state.start);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-400 to-green-400 z-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg" dir="rtl">
          عداء الأمان الرقمي
        </h1>
        <h2 className="text-3xl text-white mb-8 drop-shadow-md" dir="rtl">
          Digital Safety Runner
        </h2>
        <p className="text-xl text-white mb-12 max-w-md mx-auto drop-shadow-md" dir="rtl">
          اركض، اقفز، وانزلق! اجمع العملات وتجنب الفيروسات في لعبة سريعة ومثيرة!
        </p>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-8 max-w-md mx-auto">
          <p className="text-white font-bold mb-2" dir="rtl">⌨️ التحكم:</p>
          <p className="text-white text-sm" dir="rtl">⬅️ ➡️ للتحرك بين المسارات</p>
          <p className="text-white text-sm" dir="rtl">⬆️ للقفز | ⬇️ للانزلاق</p>
        </div>
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
