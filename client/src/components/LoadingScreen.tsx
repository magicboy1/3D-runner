import { Loader2 } from "lucide-react";
import { Html, useProgress } from "@react-three/drei";
import { useEffect } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const { progress, active } = useProgress();
  
  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => {
        onLoadComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress, onLoadComplete]);
  
  return (
    <Html fullscreen>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 z-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-white animate-spin mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-2" dir="rtl">
            جاري تحميل اللعبة...
          </h2>
          <p className="text-white/80 text-lg mb-4" dir="rtl">
            انتظر قليلاً 🎮
          </p>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}
