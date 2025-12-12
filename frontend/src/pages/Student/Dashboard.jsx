import React from 'react';
import DashboardLayout from '../../components/layouts/Dashboard';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atoms/authAtom';
import { Navigate } from 'react-router-dom';

const StudentDashboard = () => {
  const auth = useRecoilValue(authState);

  console.log("student dashboard auth state:", auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  }

  if (!auth.user || !auth.user.fullName) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <p className="text-red-500">Error loading user data</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Applications</div>
              <div className="stat-value">5</div>
              <div className="stat-desc">Active applications</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Recent Applications</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Google</td>
                      <td>Software Engineer</td>
                      <td><div className="badge badge-primary">Applied</div></td>
                    </tr>
                    <tr>
                      <td>Microsoft</td>
                      <td>Frontend Developer</td>
                      <td><div className="badge badge-success">Accepted</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Upcoming Events</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Technical Interview</h3>
                    <p className="text-sm opacity-70">Google - SDE Role</p>
                  </div>
                  <div className="text-sm opacity-70">Tomorrow, 10:00 AM</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">HR Round</h3>
                    <p className="text-sm opacity-70">Microsoft - Frontend Role</p>
                  </div>
                  <div className="text-sm opacity-70">26 Feb, 2:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;