import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { Subject } from "@/types";

export const useSubjects = () => {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // FIX 1: Point to the USER'S sub-collection, not the root
    const subjectsRef = collection(db, "users", user.uid, "subjects");
    
    // FIX 2: No need for 'where' clause anymore (path already handles it)
    // This avoids the "Missing Index" error
    const q = query(subjectsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      
      setSubjects(subjectList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching subjects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSubject = async (name: string, color: string) => {
    if (!user) return;
    
    try {
        // FIX 3: Write to the same sub-collection path
        const subjectsRef = collection(db, "users", user.uid, "subjects");
        
        await addDoc(subjectsRef, {
            name,
            color,
            userId: user.uid,
            createdAt: serverTimestamp(), // Better than Date.now() for sync
        });
    } catch (error) {
        console.error("Error adding subject:", error);
    }
  };

  const deleteSubject = async (id: string) => {
    if (!user) return;
    try {
        // FIX 4: Delete from the correct sub-collection path
        await deleteDoc(doc(db, "users", user.uid, "subjects", id));
    } catch (error) {
        console.error("Error deleting subject:", error);
    }
  };

  return { subjects, loading, addSubject, deleteSubject };
};