import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  deleteDoc,
  doc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { Subject } from "@/types";

export const useSubjects = () => {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Real-time listener: Updates instantly when data changes
    const q = query(
      collection(db, "subjects"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      
      setSubjects(subjectList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSubject = async (name: string, color: string) => {
    if (!user) return;
    await addDoc(collection(db, "subjects"), {
      name,
      color,
      userId: user.uid,
      createdAt: Date.now(),
    });
  };

  const deleteSubject = async (id: string) => {
    await deleteDoc(doc(db, "subjects", id));
  };

  return { subjects, loading, addSubject, deleteSubject };
};