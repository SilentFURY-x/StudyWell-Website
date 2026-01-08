import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  activeSessionId: string | null;
  isCompleted: boolean;

  setTime: (seconds: number) => void;
  startTimer: (sessionId: string, duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeLeft: 0,
      initialTime: 0,
      isRunning: false,
      activeSessionId: null,
      isCompleted: false,

      setTime: (seconds) => set({ timeLeft: seconds, initialTime: seconds }),

      startTimer: (sessionId, duration) => {
        if (get().activeSessionId === sessionId && get().isRunning) return;
        set({ 
          isRunning: true, 
          activeSessionId: sessionId, 
          timeLeft: duration,
          initialTime: duration,
          isCompleted: false 
        });
      },

      pauseTimer: () => set({ isRunning: false }),
      resumeTimer: () => set({ isRunning: true }),

      stopTimer: () => set({ 
        isRunning: false, 
        timeLeft: 0, 
        activeSessionId: null,
        isCompleted: false 
      }),

      resetTimer: () => set({
        timeLeft: 0,
        initialTime: 0,
        isRunning: false,
        activeSessionId: null,
        isCompleted: false
      }),

      // --- THE FIXED LOGIC ---
      tick: () => {
        const { timeLeft, isRunning } = get();
        
        if (!isRunning) return;

        if (timeLeft > 1) {
          // Normal tick
          set({ timeLeft: timeLeft - 1 });
        } else {
          // We are at 1 second. The next tick makes it 0.
          // FINISH IMMEDIATELY.
          set({ 
            timeLeft: 0, 
            isRunning: false, // Stop the clock
            isCompleted: true // Trigger the confetti!
          });
        }
      },
    }),
    {
      name: 'study-timer-storage',
    }
  )
);