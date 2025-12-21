import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../pages/Student/Dashboard";
import Profile from "../../pages/Student/Profile";
import JobListings from "../../pages/Student/JobListings";
import JobDetail from "../../pages/Student/JobDetail";
import Applications from "../../pages/Student/Applications";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="jobs" element={<JobListings />} />
      <Route path="jobs/:jobId" element={<JobDetail />} />
      <Route path="applications" element={<Applications />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default StudentRoutes;
