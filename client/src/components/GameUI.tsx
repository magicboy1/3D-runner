import { useEffect } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pause } from "lucide-react";

export function GameUI() {
  const score = useStepChallenge((state) => state.score);
  const distance = useStepChallenge((state) => state.distance);
  const message = useStepChallenge((state) => state.message);
  const switchLane = useStepChallenge((state) => state.switchLane);
  const currentLane = useStepChallenge((state) => state.currentLane);
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
  
  const moveLeft = () => {
    if (currentLane === "right") switchLane("center");
    else if (currentLane === "center") switchLane("left");
  };
  
  const moveRight = () => {
    if (currentLane === "left") switchLane("center");
    else if (currentLane === "center") switchLane("right");
  };
  
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
        
        <div className="flex-1" />
        
        <div className="flex justify-center items-end gap-4 p-8 pointer-events-auto">
          <Button
            onClick={moveLeft}
            size="lg"
            className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl"
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => useStepChallenge.getState().jump()}
              size="lg"
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl"
            >
              <ChevronUp className="h-10 w-10" />
            </Button>
            <Button
              onClick={() => useStepChallenge.getState().slide()}
              size="lg"
              className="w-20 h-20 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-xl"
            >
              <ChevronDown className="h-10 w-10" />
            </Button>
          </div>
          
          <Button
            onClick={moveRight}
            size="lg"
            className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl"
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </div>
  );
}
