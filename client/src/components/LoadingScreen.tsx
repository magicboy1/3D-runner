import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 z-50">
      <div className="text-center">
        <Loader2 className="h-16 w-16 text-white animate-spin mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-2" dir="rtl">
          جاري تحميل اللعبة...
        </h2>
        <p className="text-white/80 text-lg" dir="rtl">
          انتظر قليلاً 🎮
        </p>
      </div>
    </div>
  );
}
