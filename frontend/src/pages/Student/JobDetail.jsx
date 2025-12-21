import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import DashboardLayout from "../../components/layouts/Dashboard";
import { Toast } from "@/components/ui/toast";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiBuilding2Line,
  RiGraduationCapLine,
  RiFileTextLine,
  RiLink,
  RiMailLine,
  RiUploadCloudLine,
  RiAlertLine,
} from "react-icons/ri";
import { getLogoUrl } from "@/utils/logoHelper";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  // Fetch job details
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-job", jobId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/get-job/${jobId}`
      );
      return response.data?.data || response.data;
    },
    enabled: !!auth.token && !!jobId,
  });

  // Fetch student resumes
  const { data: resumes } = useQuery({
    queryKey: ["student-resumes"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/student/resumes`
      );
      return response.data?.resumes || response.data || [];
    },
    enabled: !!auth.token,
  });

  // Apply to job mutation
  const applyMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(
        `${import.meta.env.VITE_URI}/job-listings/students/apply-to`,
        data
      );
    },
    onSuccess: () => {
      Toast.success("Application submitted successfully!");
      queryClient.invalidateQueries(["student-job", jobId]);
      queryClient.invalidateQueries(["student-jobs"]);
      queryClient.invalidateQueries(["student-applied-jobs"]);
      setShowApplyModal(false);
    },
    onError: (error) => {
      Toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    },
  });

  // Withdraw application mutation
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return axios.delete(
        `${import.meta.env.VITE_URI}/job-listings/students/${jobId}`
      );
    },
    onSuccess: () => {
      Toast.success("Application withdrawn successfully");
      queryClient.invalidateQueries(["student-job", jobId]);
      queryClient.invalidateQueries(["student-jobs"]);
      queryClient.invalidateQueries(["student-applied-jobs"]);
    },
    onError: (error) => {
      Toast.error(
        error.response?.data?.message || "Failed to withdraw application"
      );
    },
  });

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      Toast.error("Please select a resume");
      return;
    }
    if (!personalEmail) {
      Toast.error("Please enter your personal email");
      return;
    }

    applyMutation.mutate({
      jobId: parseInt(jobId),
      resumeId: parseInt(selectedResumeId),
      coverLetter,
      personalEmail,
    });
  };

  const isDeadlinePassed = job?.applicationDeadline
    ? new Date(job.applicationDeadline) < new Date()
    : false;

  const isApplied = !!job?.appliedToJob;
  const isEligible = job?.eligibility?.eligible ?? true;

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="w-full h-[85vh] bg-white rounded-xl p-6 flex items-center justify-center">
          <div className="loading loading-spinner text-primary loading-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="w-full h-[85vh] bg-white rounded-xl p-6 flex flex-col items-center justify-center">
          <RiAlertLine className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-dark mb-2">
            Job Not Found
          </h2>
          <p className="text-muted mb-4">
            This job may have been removed or is no longer available.
          </p>
          <Link
            to="/student/jobs"
            className="btn btn-primary flex items-center gap-2"
          >
            <RiArrowLeftLine />
            Back to Jobs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const companyName = job.Company?.name || "Unknown Company";
  const companyLogo = getLogoUrl(job.Company?.logo);
  const location = Array.isArray(job.locationOptions)
    ? job.locationOptions.join(", ")
    : job.locationOptions || "Remote";

  return (
    <DashboardLayout>
      <div className="w-full h-[85vh] overflow-hidden bg-white rounded-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <Link
            to="/student/jobs"
            className="flex items-center gap-2 text-muted hover:text-primary mb-4 text-sm"
          >
            <RiArrowLeftLine />
            Back to Job Listings
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            <div className="w-20 h-20 bg-background rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <RiBuilding2Line className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Job Title & Company */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-2xl font-bold text-dark">{job.title}</h1>

                {isApplied && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                    <RiCheckLine className="w-4 h-4" />
                    Applied
                  </span>
                )}

                {!isEligible && !isApplied && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full flex items-center gap-1">
                    <RiCloseLine className="w-4 h-4" />
                    Not Eligible
                  </span>
                )}

                {isDeadlinePassed && !isApplied && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Deadline Passed
                  </span>
                )}
              </div>

              <p className="text-lg text-muted mt-1">{companyName}</p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <RiBriefcaseLine className="w-4 h-4 text-primary" />
                  <span>{job.role || "Full Time"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <RiMapPinLine className="w-4 h-4 text-primary" />
                  <span>{location}</span>
                </div>
                {job.ctc > 0 && (
                  <div className="flex items-center gap-2 text-muted">
                    <RiMoneyDollarCircleLine className="w-4 h-4 text-primary" />
                    <span>₹{job.ctc} LPA</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted">
                  <RiGraduationCapLine className="w-4 h-4 text-primary" />
                  <span>Batch: {job.gradYear?.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <RiCalendarLine className="w-4 h-4 text-primary" />
                  <span>
                    Deadline:{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col gap-2">
              {isApplied ? (
                <button
                  onClick={() => withdrawMutation.mutate()}
                  disabled={withdrawMutation.isPending}
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                >
                  {withdrawMutation.isPending
                    ? "Withdrawing..."
                    : "Withdraw Application"}
                </button>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  disabled={isDeadlinePassed || !isEligible}
                  className={`btn ${
                    isDeadlinePassed || !isEligible
                      ? "btn-disabled bg-gray-300"
                      : "btn-primary"
                  }`}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-background rounded-xl p-5">
                <h2 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                  <RiFileTextLine className="text-primary" />
                  Job Description
                </h2>
                <p className="text-muted whitespace-pre-line leading-relaxed">
                  {job.descriptionText || "No description provided."}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-background rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-dark mb-3">
                    Requirements
                  </h2>
                  <p className="text-muted whitespace-pre-line leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="bg-background rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-dark mb-3">
                    Responsibilities
                  </h2>
                  <p className="text-muted whitespace-pre-line leading-relaxed">
                    {job.responsibilities}
                  </p>
                </div>
              )}

              {/* Hiring Process */}
              {job.HiringProcesses?.length > 0 && (
                <div className="bg-background rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-dark mb-4">
                    Hiring Process
                  </h2>
                  <div className="space-y-4">
                    {job.HiringProcesses.sort((a, b) => a.index - b.index).map(
                      (process, idx) => (
                        <div
                          key={process.id}
                          className="flex items-start gap-4 bg-white p-4 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-dark">
                              {process.title}
                            </h3>
                            <p className="text-sm text-muted mt-1 capitalize">
                              {process.type?.replace("-", " ")}
                            </p>
                            {process.startDateTime && (
                              <p className="text-sm text-muted mt-1">
                                <RiCalendarLine className="inline w-4 h-4 mr-1" />
                                {new Date(
                                  process.startDateTime
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Eligibility */}
              {!isEligible && job.eligibility?.reasons && (
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <RiAlertLine />
                    Eligibility Issues
                  </h2>
                  <ul className="space-y-2">
                    {job.eligibility.reasons.map((reason, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-600 flex items-start gap-2"
                      >
                        <RiCloseLine className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Job Details */}
              <div className="bg-background rounded-xl p-5">
                <h2 className="text-lg font-semibold text-dark mb-4">
                  Job Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Role Type</span>
                    <span className="font-medium text-dark">{job.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">CTC</span>
                    <span className="font-medium text-dark">
                      ₹{job.ctc || 0} LPA
                    </span>
                  </div>
                  {job.bondInYrs > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">Bond</span>
                      <span className="font-medium text-dark">
                        {job.bondInYrs} Years
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted">Backlogs Allowed</span>
                    <span className="font-medium text-dark">
                      {job.activeBacklogsAcceptable ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Max Failed Subjects</span>
                    <span className="font-medium text-dark">
                      {job.failedSubjects || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eligible Branches */}
              {job.Branches?.length > 0 && (
                <div className="bg-background rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-dark mb-4">
                    Eligible Branches
                  </h2>
                  <div className="space-y-2">
                    {job.Branches.map((branch) => (
                      <div
                        key={branch.code}
                        className="flex justify-between text-sm bg-white p-2 rounded"
                      >
                        <span className="text-muted">{branch.name}</span>
                        <span className="font-medium text-dark">
                          Min CGPA: {branch.JobBranch?.minCgpa || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {job.webLinks?.length > 0 && (
                <div className="bg-background rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
                    <RiLink className="text-primary" />
                    Related Links
                  </h2>
                  <div className="space-y-2">
                    {job.webLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block truncate"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark">
                Apply for {job.title}
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Resume Selection */}
              <div>
                <label className="label text-dark font-medium">
                  Select Resume *
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="select w-full bg-background"
                  required
                >
                  <option value="">Choose a resume</option>
                  {resumes?.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.name}
                    </option>
                  ))}
                </select>
                {resumes?.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    No resumes found.{" "}
                    <Link
                      to="/student/profile"
                      className="text-primary underline"
                    >
                      Upload a resume
                    </Link>
                  </p>
                )}
              </div>

              {/* Personal Email */}
              <div>
                <label className="label text-dark font-medium">
                  Personal Email *
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="input w-full pl-10 bg-background"
                    placeholder="your.email@gmail.com"
                    required
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="label text-dark font-medium">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="textarea w-full bg-background min-h-[120px]"
                  placeholder="Write a brief cover letter explaining why you're a great fit for this role..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    applyMutation.isPending ||
                    !selectedResumeId ||
                    !personalEmail
                  }
                  className="btn btn-primary flex-1"
                >
                  {applyMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <RiUploadCloudLine className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobDetail;
