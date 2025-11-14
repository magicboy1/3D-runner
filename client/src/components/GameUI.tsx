import { useEffect } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";
import { Pause } from "lucide-react";

export function GameUI() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const message = useStepChallenge((state) => state.message);
  const restart = useStepChallenge((state) => state.restart);
  const clearMessage = useStepChallenge((state) => state.clearMessage);
  
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
        <div className="flex items-start justify-between p-4 pointer-events-auto">
          <div className="flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg" dir="rtl">
              <p className="text-xl font-bold text-gray-800">النقاط: {score}</p>
            </div>
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg" dir="rtl">
              <p className="text-lg font-bold text-blue-600">{distance}م</p>
            </div>
          </div>
          
          <Button 
            onClick={restart}
            variant="destructive"
            size="icon"
            className="rounded-full shadow-lg"
          >
            <Pause className="h-5 w-5" />
          </Button>
        </div>
        
        {message && (
          <div className="flex justify-center mt-4 pointer-events-none">
            <div 
              className={`px-6 py-3 rounded-lg shadow-lg ${
                message.type === "warning" 
                  ? "bg-red-500 text-white" 
                  : "bg-green-500 text-white"
              }`}
              dir="rtl"
            >
              <p className="text-lg font-bold">{message.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
