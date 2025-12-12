import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import {
  RiUserLine,
  RiBriefcaseLine,
  RiFileListLine,
  RiCheckLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import Dashboard from "@/components/layouts/Dashboard";

const RecruiterDashboard = () => {
  const auth = useRecoilValue(authState);

  // Fetch all job listings
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/recruiters`
      );
      return response.data || [];
    },
  });

  // Calculate statistics from jobs data
  const stats = {
    totalJobs: jobs?.length || 0,
    activeJobs: jobs?.filter((job) => job.isActive)?.length || 0,
    totalApplications:
      jobs?.reduce((sum, job) => sum + (job.Students?.length || 0), 0) || 0,
    hiredCandidates: 0, // Can be calculated based on hiring process status
  };

  // Get recent jobs (last 5)
  const recentJobs = jobs?.slice(0, 5) || [];

  const statsCards = [
    {
      title: "Total Jobs Posted",
      value: stats.totalJobs,
      icon: RiBriefcaseLine,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: RiFileListLine,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: RiUserLine,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Hired Candidates",
      value: stats.hiredCandidates,
      icon: RiCheckLine,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
          <p className="text-muted mt-1">
            Welcome back, {auth.user?.firstName}! Here's your recruitment
            overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </>
          ) : (
            statsCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-dark">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Company Info */}
        {auth.role?.Company && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted">Company Name</p>
                <p className="font-medium">{auth.role.Company.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Website</p>
                <a
                  href={auth.role.Company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {auth.role.Company.website}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="font-medium">
                  {auth.role.Company.headOfficeEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Phone</p>
                <p className="font-medium">
                  {auth.role.Company.headOfficePhone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Job Listings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Job Listings</h2>
            <Link
              to="/recruiter/jobs"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          {recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">
                        {job.jobTitle}
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        {job.jobType} •{" "}
                        {job.salary ? `₹${job.salary}` : "Not specified"}
                      </p>
                    </div>
                    <Link
                      to={`/recruiter/jobs/${job.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RiBriefcaseLine className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-muted">No job listings yet</p>
              <Link
                to="/recruiter/jobs/create"
                className="btn btn-primary mt-4"
              >
                Post Your First Job
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/recruiter/jobs/create" className="btn btn-primary">
              Post New Job
            </Link>
            <Link to="/recruiter/jobs" className="btn btn-outline">
              View All Jobs
            </Link>
            <Link to="/recruiter/applications" className="btn btn-outline">
              View Applications
            </Link>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default RecruiterDashboard;
