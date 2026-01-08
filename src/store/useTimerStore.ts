import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  // State
  timeLeft: number;      // Time remaining in seconds
  initialTime: number;   // Total time for the session (for progress bar calculation)
  isRunning: boolean;    // Is the timer ticking?
  activeSessionId: string | null; // Which timeline session is currently active?

  // Actions
  setTime: (seconds: number) => void;
  startTimer: (sessionId: string, duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void; // Call this every second
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeLeft: 0,
      initialTime: 0,
      isRunning: false,
      activeSessionId: null,

      setTime: (seconds) => set({ timeLeft: seconds, initialTime: seconds }),

      startTimer: (sessionId, duration) => {
        // Only start if not already running for this session
        if (get().activeSessionId === sessionId && get().isRunning) return;
        
        set({ 
          isRunning: true, 
          activeSessionId: sessionId, 
          timeLeft: duration,
          initialTime: duration 
        });
      },

      pauseTimer: () => set({ isRunning: false }),
      
      resumeTimer: () => set({ isRunning: true }),

      stopTimer: () => set({ 
        isRunning: false, 
        timeLeft: 0, 
        activeSessionId: null 
      }),

      tick: () => {
        const { timeLeft, isRunning } = get();
        if (isRunning && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (isRunning && timeLeft === 0) {
          // Timer finished!
          set({ isRunning: false, activeSessionId: null });
          // We will trigger "Session Completed" modal here later
        }
      },
    }),
    {
      name: 'study-timer-storage', // Keep timer alive even if they refresh the page
    }
  )
);