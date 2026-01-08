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
    if (!user) return;

    // Get start and end of TODAY (so we only show today's schedule)
    const todayStart = startOfDay(new Date()).getTime();
    const todayEnd = endOfDay(new Date()).getTime();

    const q = query(
      collection(db, "sessions"),
      where("userId", "==", user.uid),
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
    });

    return () => unsubscribe();
  }, [user]);

  const addSession = async (subjectId: string, hour: number) => {
    if (!user) return;
    
    // Create a timestamp for Today at [hour]:00
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    const startTime = date.getTime();
    
    // Default duration: 1 hour (60 mins * 60 secs * 1000 ms)
    const endTime = startTime + (60 * 60 * 1000);

    await addDoc(collection(db, "sessions"), {
      userId: user.uid,
      subjectId,
      startTime,
      endTime,
      durationMinutes: 60,
      createdAt: Date.now()
    });
  };

  const removeSession = async (sessionId: string) => {
    await deleteDoc(doc(db, "sessions", sessionId));
  };

  return { sessions, loading, addSession, removeSession };
};