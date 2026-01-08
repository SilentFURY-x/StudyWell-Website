import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { StudySession } from "@/types";
import { startOfDay, endOfDay } from "date-fns";

export const useTimeline = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Get start and end of TODAY
    const todayStart = startOfDay(new Date()).getTime();
    const todayEnd = endOfDay(new Date()).getTime();

    // FIX 1: Point to the USER'S sub-collection
    const sessionsRef = collection(db, "users", user.uid, "sessions");

    // FIX 2: We don't need 'where("userId"...) because the path is already specific.
    // This makes the query simpler and avoids "Index Missing" errors.
    const q = query(
      sessionsRef,
      where("startTime", ">=", todayStart),
      where("startTime", "<=", todayEnd)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudySession[];
      setSessions(sessionList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching timeline:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSession = async (subjectId: string, hour: number) => {
    if (!user) return;
    
    // Create a timestamp for Today at [hour]:00
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    const startTime = date.getTime();
    
    // Default duration: 1 hour
    const endTime = startTime + (60 * 60 * 1000);

    try {
        // FIX 3: Add to the USER'S sub-collection
        const sessionsRef = collection(db, "users", user.uid, "sessions");

        await addDoc(sessionsRef, {
            userId: user.uid,
            subjectId,
            startTime,
            endTime,
            durationMinutes: 60,
            createdAt: Date.now()
        });
    } catch (error) {
        console.error("Error adding session:", error);
    }
  };

  const removeSession = async (sessionId: string) => {
    if (!user) return;
    try {
        // FIX 4: Delete from the USER'S sub-collection
        const sessionRef = doc(db, "users", user.uid, "sessions", sessionId);
        await deleteDoc(sessionRef);
    } catch (error) {
        console.error("Error removing session:", error);
    }
  };

  return { sessions, loading, addSession, removeSession };
};