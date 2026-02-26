import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      console.log('🚫 Not authenticated, will redirect to login');
      setShouldRedirect(true);
    }
  }, [isLoading, currentUser]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return null;
  }

  console.log('✅ Authenticated, rendering protected content');
  return children;
}