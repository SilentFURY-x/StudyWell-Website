import { create } from 'zustand';
import { User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore'; 
import { db } from '@/lib/firebase';
import { differenceInCalendarDays } from 'date-fns'; // Make sure to install date-fns if missing

interface UserData {
  xp: number;
  points: number;
  level: number;
  streak: number;
  lastLogin: any;
}

interface AuthState {
  user: User | null;
  userData: UserData | null; // ✅ New: Holds the DB data (XP, Streak)
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  syncUser: (user: User) => Promise<void>;
  updateUserStats: (seconds: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  syncUser: async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New User
      const newData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        points: 0,        
        xp: 0,           
        level: 1,        
        streak: 1,        
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newData);
      set({ userData: newData as any }); // Save to store
    } else {
      // Returning User: Calculate Streak
      const data = userSnap.data();
      const lastLoginDate = data.lastLogin?.toDate();
      const today = new Date();
      
      let newStreak = data.streak || 1;

      if (lastLoginDate) {
        const daysDiff = differenceInCalendarDays(today, lastLoginDate);
        
        if (daysDiff === 1) {
            // Logged in yesterday? Increment!
            newStreak += 1;
        } else if (daysDiff > 1) {
            // Missed a day? Reset.
            newStreak = 1;
        }
        // If daysDiff === 0 (same day), do nothing.
      }

      await updateDoc(userRef, { 
        lastLogin: serverTimestamp(),
        streak: newStreak,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      // Update local state so UI shows it immediately
      set({ userData: { ...data, streak: newStreak } as any });
    }
  },

  updateUserStats: async (seconds: number) => {
    const { user, userData } = get();
    if (!user) return;

    const minutes = Math.floor(seconds / 60);
    const xpEarned = minutes * 10; 

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        xp: increment(xpEarned),
        points: increment(xpEarned),
        totalMinutes: increment(minutes),
        lastActive: serverTimestamp()
      });

      // Update local state instantly
      if (userData) {
        set({
            userData: {
                ...userData,
                xp: (userData.xp || 0) + xpEarned,
                points: (userData.points || 0) + xpEarned
            }
        });
      }
    } catch (err) {
      console.error("Failed to save stats:", err);
    }
  }
}));