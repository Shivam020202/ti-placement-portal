import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import { Toast } from '@/components/ui/toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useRecoilValue(authState);
  const location = useLocation();

  if (auth.loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-red"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    localStorage.setItem('returnUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Handle admin and super-admin roles
  if (auth.user?.role === 'admin') {
    // Redirect admin to super-admin routes
    const path = location.pathname.replace('/admin', '/super-admin');
    return <Navigate to={path} replace />;
  }

  // Check allowed roles
  if (allowedRoles) {
    const hasPermission = allowedRoles.some(role => {
      if (role === 'super-admin') {
        // Allow both admin and super-admin for super-admin routes
        return auth.user?.role === 'admin' || auth.user?.role === 'super-admin';
      }
      return auth.user?.role === role;
    });

    if (!hasPermission) {
      Toast.error('You do not have permission to access this page');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;