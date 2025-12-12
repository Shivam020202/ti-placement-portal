import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';

const InviteAdminModal = ({ onClose, onSuccess }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  // Add error state
  const [error, setError] = useState('');

  const inviteAdminMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URI}/super-admin/invite`,
          {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'admin'
          },
          {
            headers: {
              Authorization: auth.token
            }
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.reason || 'Failed to send invitation');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-invites']);
      queryClient.invalidateQueries(['team-members']);
      Toast.success('Invitation sent successfully!');
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      setError(error.message);
      Toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    inviteAdminMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Invite Admin</h2>
          <button onClick={onClose} className="text-red bg-dark rounded-full p-1 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-dark text-red rounded-lg hover:bg-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red opacity-90 text-white rounded-lg hover:bg-red hover:opacity-100 disabled:opacity-50 flex items-center gap-2"
              disabled={inviteAdminMutation.isLoading}
            >
              {inviteAdminMutation.isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Invitation</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteAdminModal;