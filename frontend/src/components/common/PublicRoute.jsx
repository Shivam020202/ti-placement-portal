import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atoms/authAtom';

const PublicRoute = ({ children }) => {
    const auth = useRecoilValue(authState);

    if (auth.isAuthenticated) {
        const role = auth.user?.role;
        // Redirect admin to super-admin routes
        if (role === 'admin') {
            return <Navigate to="/super-admin/dashboard" replace />;
        }
        return <Navigate to={`/${role}`} replace />;
    }

    return children;
};

export default PublicRoute;