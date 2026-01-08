import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // New imports
import { db } from '@/lib/firebase'; // Import your DB

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  syncUser: (user: User) => Promise<void>; // New function
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // This function ensures the user exists in our database for the Leaderboard
  syncUser: async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time login: Create profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        points: 0,         // For Leaderboard
        streak: 1,         // For Streak System
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else {
      // Returning user: We will handle streak logic here later
      // For now, just update the last login
      await setDoc(userRef, { 
        lastLogin: serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL
      }, { merge: true });
    }
  }
}));