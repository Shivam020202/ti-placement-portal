import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { Navigate, Link } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import {
  RiBriefcaseLine,
  RiFileTextLine,
  RiCheckLine,
  RiTimeLine,
  RiBuilding2Line,
  RiCalendarLine,
  RiArrowRightLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import ResumeManager from "@/components/student/ResumeManager";
import { getLogoUrl } from "@/utils/logoHelper";

const StudentDashboard = () => {
  const auth = useRecoilValue(authState);

  // Fetch available jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["student-jobs-dashboard"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/5`
      );
      return response.data?.jobListings || [];
    },
    enabled: !!auth.token,
  });

  // Fetch applied jobs
  const { data: appliedJobs, isLoading: appliedLoading } = useQuery({
    queryKey: ["student-applied-jobs"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/students/applied/100`
      );
      return response.data || [];
    },
    enabled: !!auth.token,
  });

  const isLoading = jobsLoading || appliedLoading;

  // Get stats
  const totalJobs = jobsData?.length || 0;
  const appliedCount = appliedJobs?.length || 0;

  // Recent applications (last 5)
  const recentApplications = appliedJobs?.slice(0, 5) || [];

  // Recent jobs (not applied)
  const appliedJobIds = new Set(appliedJobs?.map((job) => job.id) || []);
  const newJobs =
    jobsData?.filter((job) => !appliedJobIds.has(job.id)).slice(0, 3) || [];

  // Upcoming events from hiring processes of applied jobs
  const upcomingEvents = [];
  appliedJobs?.forEach((job) => {
    if (job.HiringProcesses) {
      job.HiringProcesses.forEach((process) => {
        if (process.startDateTime) {
          const startDate = new Date(process.startDateTime);
          if (startDate > new Date()) {
            upcomingEvents.push({
              id: process.id,
              title: process.title,
              type: process.type,
              date: startDate,
              jobTitle: job.title,
              companyName: job.Company?.name || "Unknown Company",
            });
          }
        }
      });
    }
  });

  // Sort and limit events
  upcomingEvents.sort((a, b) => a.date - b.date);
  const limitedEvents = upcomingEvents.slice(0, 3);

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

  if (!auth.user || !auth.user.fullName) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <p className="text-red-500">Error loading user data</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">
            Welcome back, {auth.user.fullName.split(" ")[0]}! 👋
          </h1>
          <p className="mt-2 opacity-90">
            Track your applications and discover new opportunities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Available Jobs</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    totalJobs
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <RiBriefcaseLine className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Link
              to="/student/jobs"
              className="text-primary text-sm font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Browse Jobs <RiArrowRightLine />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Applications</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    appliedCount
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <RiFileTextLine className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Link
              to="/student/applications"
              className="text-green-600 text-sm font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View Applications <RiArrowRightLine />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Upcoming Events</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    upcomingEvents.length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <RiCalendarLine className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <span className="text-muted text-sm mt-3 inline-block">
              Interviews & rounds
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark">
                Recent Applications
              </h2>
              <Link
                to="/student/applications"
                className="text-primary text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((job) => (
                    <Link
                      key={job.id}
                      to={`/student/jobs/${job.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors"
                    >
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                        {getLogoUrl(job.Company?.logo) ? (
                          <img
                            src={getLogoUrl(job.Company?.logo)}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <RiBuilding2Line className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted truncate">
                          {job.Company?.name || "Unknown Company"}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <RiCheckLine className="w-3 h-3" />
                        Applied
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <RiFileTextLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted text-sm">No applications yet</p>
                  <Link
                    to="/student/jobs"
                    className="text-primary text-sm font-medium mt-2 inline-block"
                  >
                    Start applying →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-dark">
                Upcoming Events
              </h2>
            </div>
            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : limitedEvents.length > 0 ? (
                <div className="space-y-4">
                  {limitedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <RiTimeLine className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark">{event.title}</h3>
                        <p className="text-sm text-muted">
                          {event.companyName} - {event.jobTitle}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          {event.date.toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <RiCalendarLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted text-sm">No upcoming events</p>
                  <p className="text-muted text-xs mt-1">
                    Events will appear once you apply to jobs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume Manager */}
        <ResumeManager />

        {/* New Job Opportunities */}
        {newJobs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark">
                New Opportunities
              </h2>
              <Link
                to="/student/jobs"
                className="text-primary text-sm font-medium"
              >
                View All Jobs
              </Link>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {newJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/student/jobs/${job.id}`}
                    className="bg-background rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        {getLogoUrl(job.Company?.logo) ? (
                          <img
                            src={getLogoUrl(job.Company?.logo)}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <RiBuilding2Line className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted truncate">
                          {job.Company?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <RiBriefcaseLine className="w-3 h-3" />
                        {job.role}
                      </span>
                      {job.ctc > 0 && (
                        <span className="flex items-center gap-1">
                          <RiMoneyDollarCircleLine className="w-3 h-3" />₹
                          {job.ctc} LPA
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
