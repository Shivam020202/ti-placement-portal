import React from 'react';
import DashboardLayout from '../../components/layouts/Dashboard';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atoms/authAtom';

const Profile = () => {
  const auth = useRecoilValue(authState);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Student Profile</h1>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={auth.user?.photoURL || 'https://ui-avatars.com/api/?name=' + auth.user?.fullName} alt="Profile" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{auth.user?.fullName}</h2>
                <p className="opacity-70">{auth.user?.email}</p>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-4">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm opacity-70">Roll Number</label>
                    <p>12345678</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Branch</label>
                    <p>Computer Science</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Batch</label>
                    <p>2020-2024</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Academic Details</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm opacity-70">CGPA</label>
                    <p>9.5</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-primary">React</div>
                      <div className="badge badge-primary">Node.js</div>
                      <div className="badge badge-primary">JavaScript</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;