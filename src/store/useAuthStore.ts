import { create } from 'zustand';
import { User, updateProfile } from 'firebase/auth'; // Added updateProfile
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore'; 
import { db } from '@/lib/firebase';
import { differenceInCalendarDays } from 'date-fns'; 

interface UserData {
  xp: number;
  points: number;
  level: number;
  streak: number;
  lastLogin: any;
}

interface AuthState {
  user: User | null;
  userData: UserData | null; 
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  syncUser: (user: User) => Promise<void>;
  updateUserStats: (seconds: number) => Promise<void>;
  updateUserProfile: (name: string, photoURL: string) => Promise<void>; // ✅ NEW
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({ user: null, userData: null }),

  syncUser: async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
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
      set({ userData: newData as any }); 
    } else {
      const data = userSnap.data();
      const lastLoginDate = data.lastLogin?.toDate();
      const today = new Date();
      
      let newStreak = data.streak || 1;

      if (lastLoginDate) {
        const daysDiff = differenceInCalendarDays(today, lastLoginDate);
        if (daysDiff === 1) newStreak += 1;
        else if (daysDiff > 1) newStreak = 1;
      }

      await updateDoc(userRef, { 
        lastLogin: serverTimestamp(),
        streak: newStreak,
        // Sync auth profile changes to firestore
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      set({ userData: { ...data, streak: newStreak } as any });
    }
  },

  updateUserStats: async (seconds: number) => {
    const { user, userData } = get();
    if (!user) return;

    const minutes = Math.floor(seconds / 60);
    const xpEarned = minutes * 10; 
    const todayStr = new Date().toISOString().split('T')[0]; 

    const userRef = doc(db, "users", user.uid);
    const dailyStatRef = doc(db, "users", user.uid, "stats", todayStr);

    try {
      await updateDoc(userRef, {
        xp: increment(xpEarned),
        points: increment(xpEarned),
        totalMinutes: increment(minutes),
        lastActive: serverTimestamp()
      });

      await setDoc(dailyStatRef, {
        date: todayStr,
        minutes: increment(minutes),
        xp: increment(xpEarned)
      }, { merge: true });

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
  },

  // ✅ NEW: Handle Profile Updates
  updateUserProfile: async (name: string, photoURL: string) => {
    const { user } = get();
    if (!user) return;

    try {
        // 1. Update Firebase Auth (The Core User)
        await updateProfile(user, {
            displayName: name,
            photoURL: photoURL
        });

        // 2. Update Firestore (The Public Profile)
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            displayName: name,
            photoURL: photoURL
        });

        // 3. Force Local State Update
        set({ user: { ...user, displayName: name, photoURL: photoURL } });
        
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
    }
  }
}));