import { motion, AnimatePresence } from "framer-motion";
import { Bell, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTimerStore } from "@/store/useTimerStore"; // Import Store

interface SmartNotificationProps {
  session: {
    id: string;
    subjectName: string;
    subjectColor: string;
  } | null;
  onClose: () => void;
}

export default function SmartNotification({ session, onClose }: SmartNotificationProps) {
  const navigate = useNavigate();
  const { startTimer } = useTimerStore(); // Get the start function

  const handleStart = () => {
    if (session) {
        // 1. Start the Global Timer (Default 60 mins)
        startTimer(session.id, 60 * 60); 
        
        // 2. Navigate to Dashboard (where the timer widget lives)
        navigate('/'); 
        
        // 3. Close popup
        onClose();
    }
  };

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          initial={{ y: -100, opacity: 0, x: "-50%" }}
          animate={{ y: 20, opacity: 1, x: "-50%" }}
          exit={{ y: -100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-1/2 z-[100] w-[90%] max-w-md"
        >
          <div 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-4 flex items-center gap-4"
            style={{ borderLeft: `4px solid ${session.subjectColor}` }}
          >
            <div 
                className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 animate-pulse"
                style={{ backgroundColor: `${session.subjectColor}20`, color: session.subjectColor }}
            >
              <Bell className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-sm">Time to Study!</h3>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold" style={{ color: session.subjectColor }}>{session.subjectName}</span> is scheduled now.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="h-8 text-xs gap-1 text-white shadow-md"
                style={{ backgroundColor: session.subjectColor }} // Button matches subject
                onClick={handleStart}
              >
                <Play className="w-3 h-3" />
                Start
              </Button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}