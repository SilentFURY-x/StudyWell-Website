import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from '@/features/auth/LoginPage';

function App() {
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  // Listen for login state changes (The "Lock" logic)
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
        {/* If user is NOT logged in, show Login Page */}
        {/* If user IS logged in, we will eventually show Dashboard (placeholder for now) */}
        <Route 
          path="/" 
          element={!user ? <LoginPage /> : <div className="p-10 text-center text-2xl">Dashboard Coming Soon! (Logged in as {user.displayName})</div>} 
        />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;