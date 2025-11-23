import { useEffect } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./ui/button";
import { Home, Volume2, VolumeX } from "lucide-react";

export function GameUI() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const message = useStepChallenge((state) => state.message);
  const restart = useStepChallenge((state) => state.restart);
  const clearMessage = useStepChallenge((state) => state.clearMessage);
  const isMuted = useAudio((state) => state.isMuted);
  const toggleMute = useAudio((state) => state.toggleMute);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-start justify-between p-6 pointer-events-auto">
          <div className="flex flex-col gap-3">
            <div 
              className="bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur px-6 py-3 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.3)'
              }}
              dir="rtl"
            >
              <p className="text-sm text-yellow-100 mb-1">النقاط</p>
              <p className="text-3xl font-black text-white drop-shadow-lg">{score}</p>
            </div>
            <div 
              className="bg-gradient-to-br from-blue-500 to-cyan-600 backdrop-blur px-6 py-3 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.3)'
              }}
              dir="rtl"
            >
              <p className="text-sm text-blue-100 mb-1">المسافة</p>
              <p className="text-2xl font-black text-white drop-shadow-lg">{distance}م</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={toggleMute}
              variant="secondary"
              size="icon"
              className="rounded-full shadow-2xl transform hover:scale-110 transition-all bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0"
              style={{
                boxShadow: '0 8px 30px rgba(168, 85, 247, 0.4)'
              }}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
            </Button>
            
            <Button 
              onClick={restart}
              variant="destructive"
              size="icon"
              className="rounded-full shadow-2xl transform hover:scale-110 transition-all bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-0"
              style={{
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)'
              }}
            >
              <Home className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        
        {message && (
          <div className="absolute top-32 left-0 right-0 flex justify-center pointer-events-none">
            <div 
              className={`px-8 py-4 rounded-2xl shadow-2xl transform animate-bounce ${
                message.type === "warning" 
                  ? "bg-gradient-to-br from-red-500 to-pink-600" 
                  : "bg-gradient-to-br from-green-500 to-emerald-600"
              }`}
              style={{
                boxShadow: message.type === "warning"
                  ? '0 15px 50px rgba(239, 68, 68, 0.5)'
                  : '0 15px 50px rgba(34, 197, 94, 0.5)'
              }}
              dir="rtl"
            >
              <p className="text-xl font-black text-white drop-shadow-lg">{message.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
