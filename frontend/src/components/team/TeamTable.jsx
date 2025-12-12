import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import axios from 'axios';
import { Trash2, User } from 'react-feather'; // Added User icon
import { Toast } from '@/components/ui/Toast';

const TeamTable = ({ members, isLoading }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  const deleteAdminMutation = useMutation({
    mutationFn: async (email) => {
      await axios.delete(`${import.meta.env.VITE_URI}/super-admin/admin/${email}`, {
        headers: {
          Authorization: auth.token
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['team-members']);
      Toast.success('Admin removed successfully');
    },
    onError: (error) => {
      Toast.error(error.response?.data?.message || 'Failed to remove admin');
    }
  });

  if (isLoading) {
    return (
      <div className="bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="animate-pulse">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-4 border-b">
              <div className="h-12 w-12 bg-white rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white rounded w-1/4"></div>
                <div className="h-3 bg-white rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg">
      {/* Fixed Header */}
      <table className="w-full text-sm rounded-lg text-left">
        <thead className="text-xs uppercase bg-muted rounded-xl sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-semibold text-white">Name</th>
            <th className="px-6 py-4 font-semibold text-white">Email</th>
            <th className="px-6 py-4 font-semibold text-white">Joined Date</th>
            <th className="px-6 py-4 font-semibold text-white">Added By</th>
            <th className="px-6 py-4 font-semibold text-white">Remove</th>
          </tr>
        </thead>
      </table>

      {/* Scrollable Body */}
      <div className="overflow-y-auto scrollbar-hide h-[calc(65vh-120px)]">
        <table className="w-full text-sm text-left">
          <tbody>
            {members?.map((member) => (
              <tr key={member.User.email} className="border-b transition-colors hover:bg-white">
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-full">
                      <User size={20} className="text-dark" />
                    </div>
                    <span className="font-medium text-dark">
                      {`${member.User.firstName} ${member.User.lastName}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{member.User.email}</td>
                <td className="px-6 py-4 text-muted">
                  {new Date(member.User.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-muted">{member.User.addedBy}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove this admin?')) {
                        deleteAdminMutation.mutate(member.User.email);
                      }
                    }}
                    className="p-2 text-red hover:bg-red hover:text-white rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTable;