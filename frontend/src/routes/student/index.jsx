import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../../pages/Student/Dashboard';
import Profile from '../../pages/Student/Profile';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default StudentRoutes;