import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';
import { RiMailLine } from 'react-icons/ri';
import CompanySelector from '@/components/ui/CompanySelector';

const InviteHrModal = ({ company = null, onClose }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyId: company?.id || ''
  });

  const showCompanySelect = !company;

  const inviteHrMutation = useMutation({
    mutationFn: async (data) => {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Please enter a valid email address');
        }

        // Validate required fields
        if (!data.email || !data.firstName || !data.lastName || !data.companyId) {
          throw new Error('Please fill all required fields');
        }

        const response = await axios.post(
          `${import.meta.env.VITE_URI}/super-admin/invite/recruiter`,
          {
            companyId: parseInt(data.companyId), // Ensure companyId is a number
            email: data.email.trim(),
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim()
          },
          {
            headers: {
              Authorization: auth.token,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data) {
          throw new Error('No response from server');
        }

        return response.data;
      } catch (error) {
        if (error.response?.status === 400) {
          if (error.response.data?.reason?.includes('already exists')) {
            throw new Error('An HR with this email already exists');
          }
        }
        throw new Error(error.response?.data?.reason || error.message || 'Failed to send invitation');
      }
    },
    onSuccess: () => {
      // Invalidate both queries to refetch fresh data
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['hr-representatives']);
      Toast.success('HR invitation sent successfully');
      onClose();
    },
    onError: (error) => {
      Toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trim whitespace from inputs before submission
    const trimmedData = {
      ...formData,
      email: formData.email.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim()
    };

    // Basic validation
    if (!trimmedData.email || !trimmedData.firstName || !trimmedData.lastName || !trimmedData.companyId) {
      Toast.error('Please fill all required fields');
      return;
    }

    inviteHrMutation.mutate(trimmedData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Invite HR</h2>
            <p className="text-sm text-gray-500">
              for {company?.name || 'Select a company'}
            </p>
          </div>
          <button onClick={onClose} className="text-red bg-dark rounded-full p-1 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showCompanySelect && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Company</label>
              <CompanySelector
                value={formData.companyId}
                onChange={(selectedCompany) => {
                  setFormData(prev => ({
                    ...prev,
                    companyId: selectedCompany.id
                  }));
                }}
                error={!formData.companyId}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
              disabled={inviteHrMutation.isLoading}
              className="px-4 py-2 bg-red opacity-90 text-white rounded-lg hover:opacity-100 disabled:opacity-50 flex items-center gap-2"
            >
              {inviteHrMutation.isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RiMailLine />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteHrModal;