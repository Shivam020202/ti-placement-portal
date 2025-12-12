import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged
} from 'firebase/auth';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Token refresh handling
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('authToken', token);

          const response = await fetch(`${import.meta.env.VITE_API_URL}/test`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("data:", data);
            // Convert super-admin role to admin
            const role = data.role === 'super-admin' ? 'admin' : data.role;
            setUserRole(role);
          }
          
          setCurrentUser(user);
        } catch (error) {
          console.error('Token refresh error:', error);
          setError('Authentication refresh failed');
        }
      } else {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto refresh token every 50 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await user.getIdToken(true);
        } catch (error) {
          console.error('Token refresh error:', error);
          setError('Token refresh failed');
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signInWithEmailPassword = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const logOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      localStorage.removeItem('authToken');
      setUserRole(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    userRole,
    signInWithGoogle,
    signInWithEmailPassword,
    logOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export { AuthContext };