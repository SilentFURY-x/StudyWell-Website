import { useEffect } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useSmartTimer } from "@/hooks/useSmartTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Timer as TimerIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TimerWidget = () => {
  const { 
    timeLeft, initialTime, isRunning, 
    startTimer, pauseTimer, resumeTimer, stopTimer, tick 
  } = useTimerStore();

  const { currentSlot } = useSmartTimer();

  // Ticking Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(tick, 1000);
    } 
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, tick]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // UI Constants
  const progress = initialTime > 0 ? timeLeft / initialTime : 1;
  const circleCircumference = 2 * Math.PI * 120;
  
  // Dynamic Colors based on Subject
  const activeColor = currentSlot?.subjectColor || "#6366f1"; // Default Indigo
  const bgColor = `${activeColor}10`; // 10% opacity

  const handleStart = () => {
    if (currentSlot) {
        startTimer(currentSlot.sessionId, 60 * 60); 
    } else {
        startTimer("free-study", 25 * 60);
    }
  };

  return (
    <Card className="w-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden h-full min-h-[400px]">
       {/* Background Glow */}
       <div 
         className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2 opacity-50 transition-colors duration-500"
         style={{ backgroundColor: activeColor }}
       />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: bgColor }}>
                <TimerIcon className="w-5 h-5" style={{ color: activeColor }} />
            </div>
            <span>Focus Timer</span>
          </div>
          <div className={cn(
            "text-xs px-2 py-1 rounded-full border font-medium transition-colors",
            isRunning 
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
                : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
          )}>
            {isRunning ? "Focusing" : "Idle"}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-6 flex-1">
        
        {/* THE CLOCK VISUAL */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Track */}
            <circle cx="50%" cy="50%" r="120" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
            {/* Progress */}
            <motion.circle 
              cx="50%" cy="50%" r="120" 
              stroke={activeColor} 
              strokeWidth="6" fill="transparent" 
              strokeLinecap="round"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: circleCircumference * (1 - progress) }}
              style={{ strokeDasharray: circleCircumference }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>

          {/* Time & Info */}
          <div className="flex flex-col items-center z-10">
            <span className="text-6xl font-bold font-mono tracking-tighter text-zinc-900 dark:text-zinc-50 tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: bgColor }}>
                 {currentSlot ? <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }} /> : <Zap className="w-3 h-3 text-zinc-400" />}
                 <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: activeColor }}>
                    {currentSlot ? currentSlot.subjectName : "Free Study"}
                 </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-6">
          {!isRunning && timeLeft === 0 ? (
            <Button 
                size="lg" 
                className="w-40 h-12 gap-2 text-md shadow-lg transition-all hover:scale-105 text-white font-bold"
                style={{ backgroundColor: activeColor }}
                onClick={handleStart}
            >
              <Play className="w-5 h-5 fill-current" /> START SESSION
            </Button>
          ) : (
            <>
              {isRunning ? (
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={pauseTimer}>
                  <Pause className="w-6 h-6" />
                </Button>
              ) : (
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg text-white" style={{ backgroundColor: activeColor }} onClick={resumeTimer}>
                  <Play className="w-6 h-6 fill-current" />
                </Button>
              )}
              
              <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={stopTimer}>
                <Square className="w-5 h-5 fill-current" />
              </Button>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );
};