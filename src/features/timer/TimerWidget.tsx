import { useEffect } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useSmartTimer } from "@/hooks/useSmartTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Timer as TimerIcon } from "lucide-react";
import { motion } from "framer-motion";

export const TimerWidget = () => {
  // 1. Connect to our "Brain" (Store & Hooks)
  const { 
    timeLeft, 
    initialTime, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    tick 
  } = useTimerStore();

  const { currentSlot } = useSmartTimer();

  // 2. The Ticking Mechanism (The Heartbeat)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick(); // Subtract 1 second
      }, 1000);
    } 
    // FIX: Removed the 'else if (timeLeft === 0) stopTimer()' block.
    // We let the Store's tick() function handle the finish line automatically.
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, tick]);

  // 3. Helper: Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 4. Calculate Progress Circle (0 to 1)
  const progress = initialTime > 0 ? timeLeft / initialTime : 1;
  const circleCircumference = 2 * Math.PI * 120; // Radius = 120

  // 5. Handle Start Logic
  const handleStart = () => {
    // If a subject is scheduled right now, use it!
    if (currentSlot) {
        // Default to 60 minutes (3600s) or calculate real remaining time
        startTimer(currentSlot.sessionId, 60 * 60); 
    } else {
        // Free Study Mode (Default 25 min)
        startTimer("free-study", 5);
    }
  };

  return (
    <Card className="w-full border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-primary" />
            <span>Focus Timer</span>
          </div>
          {/* Status Badge */}
          <div className={`text-xs px-2 py-1 rounded-full border ${
            isRunning 
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
                : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
          }`}>
            {isRunning ? "Focusing" : "Idle"}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-6">
        
        {/* THE CLOCK VISUAL */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          {/* SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background Track */}
            <circle cx="50%" cy="50%" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
            {/* Progress Fill (Animated) */}
            <motion.circle 
              cx="50%" cy="50%" r="120" 
              stroke="currentColor" strokeWidth="8" fill="transparent" 
              className="text-primary"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: circleCircumference * (1 - progress) }}
              style={{ strokeDasharray: circleCircumference }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>

          {/* Time & Subject Info (Centered) */}
          <div className="flex flex-col items-center z-10">
            <span className="text-5xl font-bold font-mono tracking-tighter text-zinc-900 dark:text-zinc-50">
              {formatTime(timeLeft)}
            </span>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {currentSlot ? `Subject: ${currentSlot.subjectName}` : "Free Study Session"}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          {!isRunning && timeLeft === 0 ? (
            <Button size="lg" className="w-32 gap-2 text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={handleStart}>
              <Play className="w-5 h-5 fill-current" /> Start
            </Button>
          ) : (
            <>
              {isRunning ? (
                <Button size="icon" variant="outline" className="h-12 w-12 rounded-full border-2" onClick={pauseTimer}>
                  <Pause className="w-6 h-6" />
                </Button>
              ) : (
                <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={resumeTimer}>
                  <Play className="w-6 h-6 fill-current" />
                </Button>
              )}
              
              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={stopTimer}>
                <Square className="w-5 h-5 fill-current" />
              </Button>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );
};