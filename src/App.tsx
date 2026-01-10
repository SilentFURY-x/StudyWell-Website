import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import LeaderboardPage from '@/features/leaderboard/LeaderboardPage';
import AnalyticsPage from '@/features/analytics/AnalyticsPage';

// Pages & Components
import LoginPage from '@/features/auth/LoginPage';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/features/dashboard/Dashboard';
import TimelinePage from '@/features/timeline/TimelinePage';

// --- CHANGE 1: Import the Cursor here ---
import CustomCursor from '@/components/ui/CustomCursor';

function App() {
  const { user, setUser, isLoading, setLoading, syncUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await syncUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading, syncUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* --- CHANGE 2: Mount the cursor here. 
          It is now a sibling to Routes, so it floats above EVERYTHING (Login & Dashboard). 
      --- */}
      <CustomCursor />

      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
        />

        {user ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/timer" element={<div>Timer Coming Soon</div>} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;