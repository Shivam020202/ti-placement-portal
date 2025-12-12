import { useState } from 'react';
import { RiUpload2Line, RiCloseLine, RiFileTextLine } from 'react-icons/ri';
import { Toast } from '@/components/ui/toast';
import axios from '@/utils/axiosConfig';

const FileUploadSection = ({ formData, setFormData, errors }) => {
  const [uploading, setUploading] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE = 10000000; // 10MB in bytes
  const ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      Toast.error('Please upload PDF, DOC or DOCX files only');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      Toast.error('File size should be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${import.meta.env.VITE_URI}/upload-description`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        descriptionFile: response.data.url
      }));

      Toast.success('File uploaded successfully');
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Description File*</span>
        <span className="label-text-alt">PDF, DOC, DOCX (Max 10MB)</span>
      </label>

      {formData.descriptionFile ? (
        <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg border border-base-200">
          <RiFileTextLine className="text-2xl text-muted" />
          <div className="flex-1">
            <div className="font-medium">{formData.descriptionFile.split('/').pop()}</div>
            <a 
              href={formData.descriptionFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-red hover:underline"
            >
              View file
            </a>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, descriptionFile: null }))}
            className="btn btn-ghost btn-sm text-red"
          >
            <RiCloseLine />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-base-200 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="descriptionFile"
          />
          <label 
            htmlFor="descriptionFile"
            className="cursor-pointer space-y-2 block"
          >
            <RiUpload2Line className="mx-auto text-3xl text-muted" />
            <div className="font-medium">Click to upload file</div>
            <div className="text-sm text-muted">PDF, DOC or DOCX (Max 10MB)</div>
          </label>
        </div>
      )}

      {uploading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted">
          <div className="loading loading-spinner loading-sm"></div>
          Uploading...
        </div>
      )}

      {errors?.descriptionFile && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.descriptionFile}</span>
        </label>
      )}
    </div>
  );
};

export default FileUploadSection;