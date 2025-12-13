import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Link } from "react-router-dom";
import {
  RiAddLine,
  RiSearchLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";

const JobListings = () => {
  const auth = useRecoilValue(authState);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const normalizeJob = (job) => {
    const title = job.title || job.jobTitle || job.position || "Untitled role";
    const description =
      job.descriptionText || job.jobDescription || job.description || "";
    const jobType = job.role || job.jobType || "Not specified";
    const location = Array.isArray(job.locationOptions)
      ? job.locationOptions.join(", ")
      : job.locationOptions || job.location || "Remote";
    const salary = job.ctc ?? job.salary ?? job.compensation;
    const reviewStatus = job.Review?.status;
    const isActive =
      reviewStatus === "approved"
        ? true
        : reviewStatus === "rejected"
        ? false
        : typeof job.isActive === "boolean"
        ? job.isActive
        : job.applicationDeadline
        ? new Date(job.applicationDeadline) >= new Date()
        : false;

    return {
      ...job,
      id: job.id ?? job.jobId,
      title,
      description,
      jobType,
      location,
      salary,
      isActive,
      reviewStatus: reviewStatus || "under_review",
      applicationsCount: job.Students?.length ?? job.applicationsCount ?? 0,
    };
  };

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/recruiters`
      );
      const data = response.data;
      const parsed = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.data)
        ? data.data
        : [];

      return parsed.map(normalizeJob);
    },
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && job.isActive) ||
      (filterStatus === "closed" && !job.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Job Listings</h1>
            <p className="text-muted mt-1">Manage all your job postings</p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="btn btn-primary flex items-center gap-2"
          >
            <RiAddLine className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select bg-background"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs && filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-dark mb-2">
                      {job.title}
                    </h3>
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        job.reviewStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : job.reviewStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.reviewStatus === "approved"
                        ? "Approved"
                        : job.reviewStatus === "rejected"
                        ? "Rejected"
                        : "Under Review"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <RiBriefcaseLine className="w-4 h-4" />
                    <span>{job.jobType || "Full-time"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <RiMapPinLine className="w-4 h-4" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <RiMoneyDollarCircleLine className="w-4 h-4" />
                      <span>₹{job.salary}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted">
                    {job.applicationsCount} Applications
                  </span>
                  <Link
                    to={`/recruiter/jobs/${job.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RiBriefcaseLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">
              No jobs found
            </h3>
            <p className="text-muted mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Start by posting your first job listing"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link to="/recruiter/jobs/create" className="btn btn-primary">
                Post New Job
              </Link>
            )}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default JobListings;
