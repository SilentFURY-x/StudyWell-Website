import { useEffect, useState } from "react";
import { TimerWidget } from "../timer/TimerWidget";
import { useAuthStore } from "@/store/useAuthStore";
import AddSubjectDialog from "./AddSubjectDialog";
import SubjectCard from "./SubjectCard";
import { useSubjects } from "@/hooks/useSubjects";
import { motion, AnimatePresence } from "framer-motion";
import { BookDashed, Flame } from "lucide-react"; 
import { SessionCompleteDialog } from "../timer/SessionCompleteDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user, userData } = useAuthStore();
  const { subjects, loading, deleteSubject } = useSubjects();
  
  const [showStreakModal, setShowStreakModal] = useState(false);

  // --- STREAK CELEBRATION LOGIC ---
  useEffect(() => {
    if (userData?.streak) {
      const currentStreak = userData.streak;
      const storedStreak = localStorage.getItem("lastKnownStreak");

      if (storedStreak && currentStreak > parseInt(storedStreak)) {
        setShowStreakModal(true);
        triggerStreakConfetti();
      } else if (!storedStreak && currentStreak > 1) {
         setShowStreakModal(true);
         triggerStreakConfetti();
      }
      localStorage.setItem("lastKnownStreak", currentStreak.toString());
    }
  }, [userData?.streak]);

  const triggerStreakConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- HEADER SECTION (Cleaned) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName?.split(" ")[0]}. Ready to focus?
          </p>
        </div>

        {/* Only the Add Button remains here now */}
        <div className="flex items-center gap-3">
            <AddSubjectDialog />
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <TimerWidget />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold tracking-tight">Your Subjects</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="min-h-[400px]">
              {subjects.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50"
                >
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                    <BookDashed className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No subjects yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
                    Add your first subject to start tracking your progress.
                  </p>
                  <AddSubjectDialog />
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <AnimatePresence>
                    {subjects.map((subject) => (
                      <SubjectCard 
                        key={subject.id} 
                        subject={subject} 
                        onDelete={deleteSubject} 
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <SessionCompleteDialog />

      {/* Streak Celebration Dialog */}
      <Dialog open={showStreakModal} onOpenChange={setShowStreakModal}>
        <DialogContent className="sm:max-w-md text-center border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center gap-4 py-6">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center"
                >
                    <Flame className="w-12 h-12 text-orange-500 fill-current" />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {userData?.streak} Day Streak!
                    </h2>
                    <p className="text-muted-foreground">
                        You're on fire! Keep showing up every day to build your habit.
                    </p>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}