import { useEffect } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";

export function GameUI() {
  const score = useStepChallenge((state) => state.score);
  const progress = useStepChallenge((state) => state.progress);
  const message = useStepChallenge((state) => state.message);
  const switchLane = useStepChallenge((state) => state.switchLane);
  const restart = useStepChallenge((state) => state.restart);
  const clearMessage = useStepChallenge((state) => state.clearMessage);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-start justify-between p-4 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg" dir="rtl">
            <p className="text-xl font-bold text-gray-800">النقاط: {score}</p>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-700 mb-1 text-center" dir="rtl">التقدم</p>
              <Progress value={progress} className="h-3" />
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
        
        <div className="flex-1" />
        
        <div className="flex justify-center gap-8 p-8 pointer-events-auto">
          <Button
            onClick={() => switchLane("left")}
            size="lg"
            className="w-24 h-24 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl"
          >
            <ChevronRight className="h-12 w-12" />
          </Button>
          
          <Button
            onClick={() => switchLane("right")}
            size="lg"
            className="w-24 h-24 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl"
          >
            <ChevronLeft className="h-12 w-12" />
          </Button>
        </div>
      </div>
    </div>
  );
}
