import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Recruiter/Dashboard";
import JobListings from "@/pages/Recruiter/JobListings";
import JobCreate from "@/pages/Recruiter/JobCreate";
import JobDetail from "@/pages/Recruiter/JobDetail";
import Applications from "@/pages/Recruiter/Applications";
import Profile from "@/pages/Recruiter/Profile";

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="jobs/create" element={<JobCreate />} />
      <Route path="jobs" element={<JobListings />} />
      <Route path="jobs/:id" element={<JobDetail />} />
      <Route path="applications" element={<Applications />} />
      <Route path="profile" element={<Profile />} />
      <Route
        path="*"
        element={<Navigate to="/recruiter/dashboard" replace />}
      />
    </Routes>
  );
};

export default RecruiterRoutes;
