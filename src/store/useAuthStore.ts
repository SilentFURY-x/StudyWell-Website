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

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  syncUser: (user: User) => Promise<void>;
  // ✅ NEW: The function to save XP
  updateUserStats: (seconds: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // Existing Sync Logic (We kept this exactly the same)
  syncUser: async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        points: 0,        
        xp: 0,           // Added XP field
        level: 1,        // Added Level field
        streak: 1,        
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, { 
        lastLogin: serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL
      }, { merge: true });
    }
  },

  // ✅ NEW: Gamification Logic (Safe Addition)
  updateUserStats: async (seconds: number) => {
    const { user } = get();
    if (!user) return;

    const minutes = Math.floor(seconds / 60);
    const xpEarned = minutes * 10; // 10 XP per minute

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        xp: increment(xpEarned),
        points: increment(xpEarned), // Keep points synced with XP
        totalMinutes: increment(minutes),
        lastActive: serverTimestamp()
      });
      console.log(`Saved: +${xpEarned} XP`);
    } catch (err) {
      console.error("Failed to save stats:", err);
    }
  }
}));