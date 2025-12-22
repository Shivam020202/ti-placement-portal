import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authState } from '@/store/atoms/authAtom';
import axios from '@/utils/axiosConfig';
import { Toast } from '@/components/ui/toast';
import { resolveAvatar, resolveAvatarSync } from '@/utils/avatarHelper';

const AuthPersist = ({ children }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  // Token refresh mechanism
  const refreshToken = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) return false;

      const response = await axios.post('/login', {}, {
        headers: { Authorization: storedToken }
      });

      const { user, student, admin, recruiter } = response.data;
      const storedUser = JSON.parse(localStorage.getItem('userData') || "null");
      const photoUrl = storedUser?.photoURL;
      const resolvedPhoto = await resolveAvatar(
        user.email,
        photoUrl,
        user.fullName
      );
      const userWithPhoto = { ...user, photoURL: resolvedPhoto };
      const isAdminRole = user.role === "admin" || user.role === "super-admin";
      const role = user.role === "student" ? student : isAdminRole ? admin : recruiter;

      setAuth({
        user: userWithPhoto,
        role,
        token: storedToken,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      localStorage.setItem('userData', JSON.stringify(userWithPhoto));

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      setAuth(prev => ({ ...prev, loading: true }));
      
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = JSON.parse(localStorage.getItem('userData'));

        if (!storedToken || !storedUser) {
          setAuth({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });
          return;
        }

        const isValid = await refreshToken();
        if (!isValid) {
          throw new Error('Invalid session');
        }

      } catch (error) {
        console.error('Auth restoration failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        setAuth({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          loading: false,
          error: 'Session expired. Please login again.'
        });
        
        Toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    };

    initAuth();
  }, []);

  // Periodic token refresh
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      const isValid = await refreshToken();
      if (!isValid) {
        clearInterval(refreshInterval);
        Toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    }, 12 * 60 * 60 * 1000); // 12 hours to match backend JWT expiration

    return () => clearInterval(refreshInterval);
  }, [auth.isAuthenticated]);

  // Loading state
  if (auth.loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-red"></div>
          <p className="text-base-content/60">Restoring your session...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthPersist;
