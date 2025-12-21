import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/utils/axiosConfig";
import {
  RiFileTextLine,
  RiUploadLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiCloseLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
} from "react-icons/ri";
import { Toast } from "@/components/ui/toast";

const MAX_RESUMES = 3;

const ResumeManager = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeName, setResumeName] = useState("");

  // Fetch resumes
  const { data: resumes, isLoading } = useQuery({
    queryKey: ["student-resumes"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/student/resumes`
      );
      return response.data || [];
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_URI}/student/resumes/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["student-resumes"]);
      Toast.success("Resume uploaded successfully!");
      setSelectedFile(null);
      setResumeName("");
      setIsUploading(false);
    },
    onError: (error) => {
      Toast.error(error.response?.data?.message || "Failed to upload resume");
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (resumeId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_URI}/student/resumes/${resumeId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["student-resumes"]);
      Toast.success("Resume deleted successfully!");
    },
    onError: (error) => {
      Toast.error(error.response?.data?.message || "Failed to delete resume");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        Toast.error("Only PDF, DOC, and DOCX files are allowed");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      // Use filename without extension as default name
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setResumeName(nameWithoutExt);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      Toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("name", resumeName || selectedFile.name);
    uploadMutation.mutate(formData);
  };

  const handleDelete = (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      deleteMutation.mutate(resumeId);
    }
  };

  const handleDownload = async (resume) => {
    // For legacy resumes stored in Firebase, use the direct URL
    if (resume.isLegacy && resume.downloadUrl) {
      window.open(resume.downloadUrl, "_blank");
    } else {
      try {
        // For new resumes stored in database, use the download endpoint with auth
        const downloadUrl = `${
          import.meta.env.VITE_URI
        }/student/resumes/download/${resume.id}`;

        const response = await axios.get(downloadUrl, {
          responseType: "blob",
        });

        // Create a blob URL and trigger download
        const blob = new Blob([response.data], {
          type: resume.mimeType || "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = resume.originalName || resume.name || "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        Toast.error("Failed to download resume");
        console.error("Download error:", error);
      }
    }
  };

  const handleView = async (resume) => {
    // For legacy resumes stored in Firebase, use the direct URL
    if (resume.isLegacy && resume.downloadUrl) {
      window.open(resume.downloadUrl, "_blank");
    } else {
      try {
        // For new resumes stored in database, fetch with auth and open in new tab
        const downloadUrl = `${
          import.meta.env.VITE_URI
        }/student/resumes/download/${resume.id}`;

        const response = await axios.get(downloadUrl, {
          responseType: "blob",
        });

        // Create a blob URL and open in new tab
        const blob = new Blob([response.data], {
          type: resume.mimeType || "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        // Note: Don't revoke URL immediately as it needs to be accessible for the new tab
        setTimeout(() => window.URL.revokeObjectURL(url), 60000); // Revoke after 1 minute
      } catch (error) {
        Toast.error("Failed to view resume");
        console.error("View error:", error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (mimeType) => {
    return <RiFileTextLine className="w-6 h-6 text-red-500" />;
  };

  const canUpload = (resumes?.length || 0) < MAX_RESUMES;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark">My Resumes</h2>
            <p className="text-sm text-muted mt-1">
              Upload up to {MAX_RESUMES} resumes ({resumes?.length || 0}/
              {MAX_RESUMES} used)
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Upload Section */}
        {canUpload ? (
          <div className="mb-6">
            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <RiUploadLine className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <RiFileTextLine className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      placeholder="Resume name"
                      className="w-full text-sm font-medium text-dark border-b border-gray-200 pb-2 mb-2 focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-muted">
                      {selectedFile.name} • {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setResumeName("");
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <RiCloseLine className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 btn btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <RiCheckLine className="w-4 h-4" />
                        Upload Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <RiErrorWarningLine className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Resume limit reached
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Delete an existing resume to upload a new one.
              </p>
            </div>
          </div>
        )}

        {/* Resume List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-4 p-4 border rounded-xl"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : resumes && resumes.length > 0 ? (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="p-3 bg-red-50 rounded-lg">
                  {getFileIcon(resume.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-dark truncate">
                    {resume.name}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {formatFileSize(resume.fileSize)} • Uploaded{" "}
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleView(resume)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <RiEyeLine className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(resume)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <RiDownloadLine className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <RiDeleteBinLine className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <RiFileTextLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted text-sm">No resumes uploaded yet</p>
            <p className="text-xs text-muted mt-1">
              Upload your resume to apply for jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManager;
