import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

// Pages & Components
import LoginPage from '@/features/auth/LoginPage';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/features/dashboard/Dashboard';

function App() {
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes (Wrapped in AppLayout) */}
        {user ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<div>Timeline Coming Soon</div>} />
            <Route path="/timer" element={<div>Timer Coming Soon</div>} />
            <Route path="/leaderboard" element={<div>Leaderboard Coming Soon</div>} />
          </Route>
        ) : (
          // Redirect unauthorized users to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;