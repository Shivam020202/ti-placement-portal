import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/store/atoms/authAtom';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';
import { RiUpload2Line } from 'react-icons/ri';

const EditCompanyModal = ({ company, onClose }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: company.name,
    website: company.website,
    headOfficeEmail: company.headOfficeEmail,
    headOfficePhone: company.headOfficePhone,
    headOfficeAddress: company.headOfficeAddress,
    description: company.description,
    logo: null,
  });

  const editCompanyMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const formDataToSend = new FormData();
        
        // Add all fields to formData
        formDataToSend.append('updatedData', JSON.stringify({
          name: data.name,
          website: data.website,
          description: data.description,
          headOfficeEmail: data.headOfficeEmail || '',
          headOfficePhone: data.headOfficePhone || '',
          headOfficeAddress: data.headOfficeAddress || '',
        }));
        
        // Add logo if changed
        if (data.logo) {
          formDataToSend.append('logo', data.logo);
        }

        const response = await axios({
          method: 'PATCH',
          url: `${import.meta.env.VITE_URI}/admin/company/${company.id}`,
          data: formDataToSend,
          headers: {
            'Authorization': auth.token,
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error) {
        console.error('Update Error:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to update company');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      Toast.success('Company updated successfully');
      onClose();
    },
    onError: (error) => {
      Toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editCompanyMutation.mutate(formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      Toast.error('Please select a valid image file (PNG, JPG, GIF)');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      Toast.error('Image size should be less than 2MB');
      return;
    }

    setFormData(prev => ({ ...prev, logo: file }));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Edit Company</h2>
            <p className="text-sm text-gray-500">{company.name}</p>
          </div>
          <button onClick={onClose} className="text-red bg-dark rounded-full p-1 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                required
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.headOfficeEmail}
                onChange={(e) => setFormData({ ...formData, headOfficeEmail: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                required
                value={formData.headOfficePhone}
                onChange={(e) => setFormData({ ...formData, headOfficePhone: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              required
              value={formData.headOfficeAddress}
              onChange={(e) => setFormData({ ...formData, headOfficeAddress: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Update Company Logo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {company.logo && (
                  <img
                    src={`${import.meta.env.VITE_URI}${company.logo}`}
                    alt="Current logo"
                    className="mx-auto h-16 w-16 object-contain mb-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <RiUpload2Line className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-red hover:text-red-500">
                    <span>Upload new logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
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
              disabled={editCompanyMutation.isLoading}
              className="px-4 py-2 bg-red opacity-90 text-white rounded-lg hover:opacity-100 disabled:opacity-50 flex items-center gap-2"
            >
              {editCompanyMutation.isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Update Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;