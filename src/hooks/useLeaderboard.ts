import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL: string;
  xp: number;
  level: number; // In case you want to show level too
}

export const useLeaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        // Get top 50 users sorted by XP
        const q = query(usersRef, orderBy("xp", "desc"), limit(50));
        
        const snapshot = await getDocs(q);
        
        const leaderboardData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LeaderboardUser[];

        setUsers(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { users, loading };
};