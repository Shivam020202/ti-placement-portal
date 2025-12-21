import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Link, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/Dashboard";
import {
  RiSearchLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiBuilding2Line,
  RiGraduationCapLine,
  RiFilter3Line,
} from "react-icons/ri";
import { getLogoUrl } from "@/utils/logoHelper";

const JobListings = () => {
  const auth = useRecoilValue(authState);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch jobs for students
  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/100`
      );
      return response.data?.jobListings || [];
    },
    enabled: !!auth.token,
  });

  // Fetch applied jobs to know which jobs are already applied
  const { data: appliedJobs } = useQuery({
    queryKey: ["student-applied-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/applied/100`
      );
      return response.data || [];
    },
    enabled: !!auth.token,
  });

  const appliedJobIds = new Set(appliedJobs?.map((job) => job.id) || []);

  const normalizeJob = (job) => {
    const companyName = job.Company?.name || "Unknown Company";
    const companyLogo = getLogoUrl(job.Company?.logo);
    const location = Array.isArray(job.locationOptions)
      ? job.locationOptions.join(", ")
      : job.locationOptions || "Remote";
    const eligibility = job.eligibility || { eligible: true };

    return {
      id: job.id,
      title: job.title,
      company: companyName,
      logo: companyLogo,
      description: job.descriptionText || "",
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
      role: job.role || "FTE",
      location,
      ctc: job.ctc,
      deadline: job.applicationDeadline,
      gradYear: job.gradYear || [],
      bondInYrs: job.bondInYrs || 0,
      createdAt: job.createdAt,
      branches: job.Branches || [],
      eligibility,
      isApplied: appliedJobIds.has(job.id),
    };
  };

  const jobs = jobsData?.map(normalizeJob) || [];

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        (filterType === "eligible" && job.eligibility?.eligible) ||
        (filterType === "applied" && job.isApplied) ||
        job.role.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "ctc-high") {
        return (b.ctc || 0) - (a.ctc || 0);
      } else if (sortBy === "ctc-low") {
        return (a.ctc || 0) - (b.ctc || 0);
      } else if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Deadline passed";
    if (days === 0) return "Last day to apply";
    if (days === 1) return "1 day left";
    if (days <= 7) return `${days} days left`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            <h1 className="text-2xl font-bold text-dark">Job Opportunities</h1>
            <p className="text-muted mt-1">
              Browse and apply to available positions
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {filteredJobs.length} Jobs Available
            </span>
            {appliedJobs?.length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {appliedJobs.length} Applied
              </span>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-background rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3">
                <RiFilter3Line className="text-muted" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select bg-transparent border-none focus:outline-none"
                >
                  <option value="all">All Jobs</option>
                  <option value="eligible">Eligible Only</option>
                  <option value="applied">Applied</option>
                  <option value="FTE">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Internship + FTE">Internship + FTE</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="ctc-high">Highest CTC</option>
                <option value="ctc-low">Lowest CTC</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
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
                Error loading jobs
              </h3>
              <p className="text-muted">
                {error.message || "Please try again later"}
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-background rounded-xl p-5 hover:shadow-lg transition-all duration-300 border-2 ${
                    job.isApplied
                      ? "border-green-200"
                      : job.eligibility?.eligible
                      ? "border-transparent hover:border-primary/30"
                      : "border-red-100"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <RiBuilding2Line className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg text-dark truncate">
                            {job.title}
                          </h3>
                          <p className="text-muted text-sm">{job.company}</p>
                        </div>

                        {/* Status Badge */}
                        {job.isApplied ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap">
                            <RiCheckLine className="w-3 h-3" />
                            Applied
                          </span>
                        ) : !job.eligibility?.eligible ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap">
                            <RiCloseLine className="w-3 h-3" />
                            Not Eligible
                          </span>
                        ) : null}
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted">
                        <div className="flex items-center gap-1">
                          <RiBriefcaseLine className="w-4 h-4" />
                          <span>{job.role}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RiMapPinLine className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">
                            {job.location}
                          </span>
                        </div>
                        {job.ctc > 0 && (
                          <div className="flex items-center gap-1">
                            <RiMoneyDollarCircleLine className="w-4 h-4" />
                            <span>₹{job.ctc} LPA</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <RiGraduationCapLine className="w-4 h-4" />
                          <span>{job.gradYear.join(", ")}</span>
                        </div>
                      </div>

                      {/* Deadline and Action */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            isDeadlinePassed(job.deadline)
                              ? "text-red-500"
                              : "text-muted"
                          }`}
                        >
                          <RiCalendarLine className="w-4 h-4" />
                          <span>{formatDeadline(job.deadline)}</span>
                        </div>

                        <Link
                          to={`/student/jobs/${job.id}`}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            job.isApplied
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : isDeadlinePassed(job.deadline)
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary/90"
                          }`}
                        >
                          {job.isApplied ? "View Application" : "View Details"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <RiBriefcaseLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                No jobs found
              </h3>
              <p className="text-muted">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "No job opportunities available at the moment. Check back later!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobListings;
