import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';
import { User } from 'react-feather';

const AssignAdminModal = ({ onClose, onAssign, jobId }) => {
  const auth = useRecoilValue(authState);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { data: teamData, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/admin/`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        const allMembers = [
          ...(response.data.admins || []),
          ...(response.data.superAdmins || []),
        ];
        return allMembers;
      } catch (error) {
        Toast.error(error.response?.data?.message || 'Failed to fetch team members');
        throw error;
      }
    },
  });

  const handleAssign = () => {
    if (!selectedAdmin) {
      Toast.error('Please select an admin');
      return;
    }

    // Only pass required fields
    const adminData = {
      email: selectedAdmin.email,
      firstName: selectedAdmin.firstName,
      lastName: selectedAdmin.lastName
    };

    onAssign(adminData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold">Assign Admin</h2>
          <button onClick={onClose} className="text-red bg-dark rounded-full p-1 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-red border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-2 scrollbar-hide">
            <div className="space-y-4">
              {teamData?.map((member) => (
                <div
                  key={member.User.email}
                  onClick={() => setSelectedAdmin(member.User)}
                  className={`p-4 rounded-lg cursor-pointer flex items-center gap-3 border-2 transition-colors
                    ${selectedAdmin?.email === member.User.email 
                      ? 'border-red bg-red/10' 
                      : 'border-transparent hover:bg-gray-50'
                    }`}
                >
                  <div className="bg-white p-2 rounded-full">
                    <User size={20} className="text-dark" />
                  </div>
                  <div>
                    <div className="font-medium">{`${member.User.firstName} ${member.User.lastName}`}</div>
                    <div className="text-sm text-gray-500">{member.User.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-dark text-red rounded-lg hover:bg-dark"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAdmin || isLoading}
            className="px-4 py-2 bg-red opacity-90 text-white rounded-lg hover:opacity-100 disabled:opacity-50 flex items-center gap-2"
          >
            Assign Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAdminModal;