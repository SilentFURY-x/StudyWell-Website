import { useEffect } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export const SessionCompleteDialog = () => {
  const { isCompleted, initialTime, resetTimer } = useTimerStore();

  // 1. Calculate Rewards (Basic Logic)
  // 1 minute = 10 XP
  const minutesFocused = Math.floor(initialTime / 60);
  const xpEarned = minutesFocused * 10; 

  // 2. The Confetti Explosion Logic
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Cannon 1 (Left Side)
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Cannon 2 (Right Side)
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // 3. Trigger when dialog opens
  useEffect(() => {
    if (isCompleted) {
        triggerConfetti();
    }
  }, [isCompleted]);

  return (
    <Dialog open={isCompleted} onOpenChange={(open) => !open && resetTimer()}>
      <DialogContent className="sm:max-w-md text-center border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="flex flex-col items-center gap-4">
            
            {/* Animated Trophy Icon */}
            <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2"
            >
                <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400 fill-current" />
            </motion.div>

          <DialogTitle className="text-2xl font-bold text-center">
            Session Complete!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            You just focused for <span className="font-bold text-primary">{minutesFocused} minutes</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Reward Card */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }} // <--- FIXED: Moved delay inside transition
            className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 my-2"
        >
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Rewards Earned</span>
                <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500">
                    <Star className="w-8 h-8 fill-current" />
                    <span>+{xpEarned} XP</span>
                </div>
            </div>
        </motion.div>

        <DialogFooter className="sm:justify-center">
          <Button 
            size="lg" 
            className="w-full sm:w-auto font-bold text-md px-8 shadow-lg shadow-primary/20"
            onClick={resetTimer}
          >
            Claim Rewards
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 