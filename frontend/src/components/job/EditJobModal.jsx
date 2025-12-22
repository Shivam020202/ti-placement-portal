import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Toast } from "@/components/ui/toast";
import { RiCloseLine, RiSave2Line, RiEditLine } from "react-icons/ri";

const EditJobModal = ({ job, onClose }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: job.title || job.jobTitle || "",
    descriptionText: job.descriptionText || job.jobDescription || "",
    requirements: job.requirements || "",
    responsibilities: job.responsibilities || "",
    role: job.role || "FTE",
    gradYear: Array.isArray(job.gradYear)
      ? job.gradYear.join(",")
      : job.gradYear || "",
    failedSubjects: job.failedSubjects || 0,
    activeBacklogsAcceptable: job.activeBacklogsAcceptable || false,
    applicationDeadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toISOString().split("T")[0]
      : "",
    bondInYrs: job.bondInYrs || 0,
    locationOptions: Array.isArray(job.locationOptions)
      ? job.locationOptions.join(",")
      : job.locationOptions || "",
    ctc: job.ctc || 0,
    ctcBreakup: Array.isArray(job.ctcBreakup)
      ? job.ctcBreakup.join(",")
      : job.ctcBreakup || "",
  });

  // Determine endpoint based on user role
  // Check both auth.role and auth.user.role for compatibility
  const userRole = auth?.role || auth?.user?.role;
  const isAdminOrSuperAdmin =
    userRole === "super-admin" || userRole === "admin";
  const endpointPath = isAdminOrSuperAdmin ? "admins" : "recruiters";

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      console.log(
        "Updating job with role:",
        userRole,
        "endpoint:",
        endpointPath
      );
      const response = await axios.put(
        `${import.meta.env.VITE_URI}/job-listings/${endpointPath}/${job.id}`,
        { updatedData: data }
      );
      return response.data;
    },
    onSuccess: () => {
      Toast.success("Job updated successfully!");
      queryClient.invalidateQueries(["job-detail", job.id]);
      queryClient.invalidateQueries(["recruiter-jobs"]);
      queryClient.invalidateQueries(["admin-jobs"]);
      queryClient.invalidateQueries(["job-page-data"]);
      onClose();
    },
    onError: (error) => {
      console.error("Job update error:", error.response?.data);
      Toast.error(
        error.response?.data?.reason ||
          error.response?.data?.message ||
          "Failed to update job"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Helper function to safely convert a value to an array
    const toArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    // Prepare data for update
    // Convert comma-separated strings back to arrays for fields that expect arrays
    const updateData = {
      ...formData,
      applicationDeadline: formData.applicationDeadline
        ? new Date(formData.applicationDeadline).toISOString()
        : null,
      // Convert string fields to arrays (the model setters expect arrays)
      gradYear: toArray(formData.gradYear),
      locationOptions: toArray(formData.locationOptions),
      ctcBreakup: toArray(formData.ctcBreakup),
    };

    updateMutation.mutate(updateData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center gap-3 text-white">
            <RiEditLine className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Edit Job Listing</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dark border-b pb-2">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Role Type
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="FTE">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Internship + FTE">Internship + FTE</option>
                  <option value="Internship + PPO">Internship + PPO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  CTC (in LPA)
                </label>
                <input
                  type="number"
                  value={formData.ctc}
                  onChange={(e) =>
                    handleChange("ctc", parseFloat(e.target.value) || 0)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location Options
              </label>
              <input
                type="text"
                value={formData.locationOptions}
                onChange={(e) =>
                  handleChange("locationOptions", e.target.value)
                }
                placeholder="e.g., Remote, Bangalore, Mumbai"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted mt-1">
                Separate multiple locations with commas
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dark border-b pb-2">
              Job Details
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                value={formData.descriptionText}
                onChange={(e) =>
                  handleChange("descriptionText", e.target.value)
                }
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                placeholder="One requirement per line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Responsibilities
              </label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) =>
                  handleChange("responsibilities", e.target.value)
                }
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                placeholder="One responsibility per line"
              />
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dark border-b pb-2">
              Eligibility Criteria
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Graduation Year(s)
                </label>
                <input
                  type="text"
                  value={formData.gradYear}
                  onChange={(e) => handleChange("gradYear", e.target.value)}
                  placeholder="e.g., 2025,2026"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Failed Subjects
                </label>
                <input
                  type="number"
                  value={formData.failedSubjects}
                  onChange={(e) =>
                    handleChange(
                      "failedSubjects",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min={0}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    handleChange("applicationDeadline", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bond (years)
                </label>
                <input
                  type="number"
                  value={formData.bondInYrs}
                  onChange={(e) =>
                    handleChange("bondInYrs", parseInt(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activeBacklogs"
                checked={formData.activeBacklogsAcceptable}
                onChange={(e) =>
                  handleChange("activeBacklogsAcceptable", e.target.checked)
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="activeBacklogs" className="text-sm">
                Active backlogs acceptable
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isLoading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {updateMutation.isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <RiSave2Line className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
