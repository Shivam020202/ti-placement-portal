import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Link, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/Dashboard";
import { Toast } from "@/components/ui/toast";
import {
  RiSearchLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiCheckLine,
  RiTimeLine,
  RiBuilding2Line,
  RiCloseLine,
  RiFileTextLine,
  RiExternalLinkLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { getLogoUrl } from "@/utils/logoHelper";

const Applications = () => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch applied jobs
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-applied-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/applied/100`
      );
      return response.data || [];
    },
    enabled: !!auth.token,
  });

  // Withdraw application mutation
  const withdrawMutation = useMutation({
    mutationFn: async (jobId) => {
      return axios.delete(
        `${import.meta.env.VITE_URI}/job-listings/students/${jobId}`
      );
    },
    onSuccess: () => {
      Toast.success("Application withdrawn successfully");
      queryClient.invalidateQueries(["student-applied-jobs"]);
      queryClient.invalidateQueries(["student-jobs"]);
    },
    onError: (error) => {
      Toast.error(
        error.response?.data?.message || "Failed to withdraw application"
      );
    },
  });

  const normalizeApplication = (job) => {
    const companyName = job.Company?.name || "Unknown Company";
    const companyLogo = getLogoUrl(job.Company?.logo);
    const location = Array.isArray(job.locationOptions)
      ? job.locationOptions.join(", ")
      : job.locationOptions || "Remote";

    // Get application details from the through table
    const applicationData = job.Students?.[0]?.AppliedToJob || {};

    // Determine application status based on hiring process or default
    let status = "applied";
    const appliedAt = applicationData.createdAt || job.createdAt;

    return {
      id: job.id,
      title: job.title,
      company: companyName,
      logo: companyLogo,
      role: job.role || "FTE",
      location,
      ctc: job.ctc,
      deadline: job.applicationDeadline,
      createdAt: job.createdAt,
      appliedAt,
      status,
      hiringProcesses: job.HiringProcesses || [],
      applicationData,
    };
  };

  const normalizedApplications = applications?.map(normalizeApplication) || [];

  // Filter applications
  const filteredApplications = normalizedApplications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Applied",
        icon: RiCheckLine,
      },
      shortlisted: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Shortlisted",
        icon: RiCheckLine,
      },
      interviewing: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Interviewing",
        icon: RiTimeLine,
      },
      offered: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Offered",
        icon: RiCheckLine,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected",
        icon: RiCloseLine,
      },
    };

    const config = statusConfig[status] || statusConfig.applied;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full flex items-center gap-1`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full h-[85vh] overflow-hidden bg-white rounded-xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark">My Applications</h1>
            <p className="text-muted mt-1">
              Track your job applications and their status
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {filteredApplications.length} Applications
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-background rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select bg-white"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl p-6 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <RiBriefcaseLine className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                Error loading applications
              </h3>
              <p className="text-muted">
                {error.message || "Please try again later"}
              </p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-4 pb-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-background rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      {app.logo ? (
                        <img
                          src={app.logo}
                          alt={app.company}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <RiBuilding2Line className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg text-dark">
                            {app.title}
                          </h3>
                          <p className="text-muted">{app.company}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-muted">
                        <div className="flex items-center gap-1">
                          <RiBriefcaseLine className="w-4 h-4" />
                          <span>{app.role}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RiMapPinLine className="w-4 h-4" />
                          <span>{app.location}</span>
                        </div>
                        {app.ctc > 0 && (
                          <div className="flex items-center gap-1">
                            <RiMoneyDollarCircleLine className="w-4 h-4" />
                            <span>₹{app.ctc} LPA</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <RiCalendarLine className="w-4 h-4" />
                          <span>
                            Applied on{" "}
                            {new Date(app.appliedAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Hiring Progress */}
                      {app.hiringProcesses.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-dark mb-2">
                            Hiring Progress
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {app.hiringProcesses
                              .sort((a, b) => a.index - b.index)
                              .map((process, idx) => (
                                <div
                                  key={process.id}
                                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-sm"
                                >
                                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    {idx + 1}
                                  </span>
                                  <span className="text-muted">
                                    {process.title}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:items-end">
                      <Link
                        to={`/student/jobs/${app.id}`}
                        className="btn btn-sm btn-primary gap-1"
                      >
                        <RiExternalLinkLine className="w-4 h-4" />
                        View Details
                      </Link>
                      <button
                        onClick={() => withdrawMutation.mutate(app.id)}
                        disabled={withdrawMutation.isPending}
                        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 gap-1"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <RiFileTextLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                No applications yet
              </h3>
              <p className="text-muted mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Start applying to jobs to track your applications here"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link to="/student/jobs" className="btn btn-primary">
                  Browse Jobs
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Applications;
