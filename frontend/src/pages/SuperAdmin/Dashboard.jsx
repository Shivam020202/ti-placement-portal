import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axiosConfig";
import { Link } from "react-router-dom";
import {
  RiBuilding2Line,
  RiMapPinLine,
  RiTimeLine,
  RiUser3Line,
  RiBriefcaseLine,
  RiCheckLine,
  RiEditLine,
  RiFileListLine,
  RiAddLine,
} from "react-icons/ri";

const Dashboard = () => {
  const auth = useRecoilValue(authState);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [date, setDate] = useState(new Date());

  // Fetch job page data
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["super-admin-jobs-dashboard"],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URI
        }/super-admin/job/job-page?inactiveLimit=5&activeLimit=5`
      );
      return response.data;
    },
    enabled: !!auth.token,
  });

  const { data: branchStats } = useQuery({
    queryKey: ["branch-stats", selectedBranch],
    enabled: !!selectedBranch && !!auth.token,
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/super-admin/branch/${selectedBranch}/stats`
      );
      return response.data;
    },
  });

  // Normalize job data for display
  const normalizeJob = (job) => ({
    id: job.id,
    title: job.title || job.jobTitle,
    company: job.Company || { name: "Unknown", logo: null },
    locationOptions: job.locationOptions || [],
    createdAt: job.createdAt,
    type: job.role || "Full Time",
    mode: job.remoteWork ? "Remote" : "On-site",
    batch: job.gradYear?.[0] || "2024",
    status: job.Review?.status || "under_review",
  });

  const pendingJobs = (jobsData?.inactiveJobs || []).map(normalizeJob);
  const activeJobs = (jobsData?.activeJobs || []).map(normalizeJob);
  const metrics = jobsData?.metrices || {
    totalListings: 0,
    liveListings: 0,
    Companies: 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {jobsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    metrics.totalListings
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <RiFileListLine className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {jobsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    metrics.liveListings
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <RiCheckLine className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {jobsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    pendingJobs.length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <RiEditLine className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Companies</p>
                <p className="text-3xl font-bold text-dark mt-1">
                  {jobsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    metrics.Companies
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <RiBuilding2Line className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link to="/super-admin/create-job" className="btn btn-primary gap-2">
            <RiAddLine className="w-5 h-5" />
            Create New Job
          </Link>
          <Link
            to="/super-admin/job-listings"
            className="btn btn-outline gap-2"
          >
            <RiFileListLine className="w-5 h-5" />
            View All Jobs
          </Link>
        </div>

        <div className="flex h-[60vh] gap-6">
          <div className="flex flex-col h-full gap-6 w-[70%]">
            {/* Pending Requests Card */}
            <div className="bg-white rounded-xl p-6 h-[50%] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pending Reviews</h2>
                <Link
                  to="/super-admin/job-listings"
                  className="text-primary text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {jobsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex gap-4 p-4 bg-background rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingJobs.length > 0 ? (
                  <div className="space-y-3 pr-2">
                    {pendingJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <RiCheckLine className="w-12 h-12 text-green-400 mb-3" />
                    <p className="text-muted">No pending reviews</p>
                    <p className="text-xs text-muted mt-1">
                      All job listings have been reviewed
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Listings Card */}
            <div className="bg-white rounded-xl p-6 h-[50%] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Active Listings</h2>
                <Link
                  to="/super-admin/job-listings"
                  className="text-primary text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {jobsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex gap-4 p-4 bg-background rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeJobs.length > 0 ? (
                  <div className="space-y-3 pr-2">
                    {activeJobs.map((job) => (
                      <JobCard key={job.id} job={job} showStatus />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <RiBriefcaseLine className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-muted">No active listings</p>
                    <p className="text-xs text-muted mt-1">
                      Approve job listings to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full w-[30%] gap-6">
            {/* Calendar Card */}
            <div className="rounded-xl overflow-hidden h-[55%] bg-dark">
              <div className="calendar h-full flex flex-col">
                <div className="calendar-header bg-dark text-white py-2 text-center flex-shrink-0">
                  {date.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <CalendarGrid date={date} setDate={setDate} />
              </div>
            </div>

            {/* Branch Stats Card */}
            <div className="rounded-xl h-[45%]">
              <div className="flex pl-4 pr-1 py-1 rounded-xl justify-between bg-white w-[full] items-center mb-4">
                <h2 className="text-md">Branch Statistics</h2>
                <BranchSelector
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                />
              </div>
              <BranchStats stats={branchStats} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper Components
const JobCard = ({ job, showStatus = false }) => (
  <Link
    to={`/super-admin/job-listings`}
    className="bg-background p-4 rounded-lg mb-3 cursor-pointer hover:shadow-md transition-shadow block"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
        {job.company?.logo ? (
          <img
            src={job.company.logo}
            alt={job.company?.name}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <RiBuilding2Line className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <div className="text-sm text-muted flex items-center gap-4">
          <span className="flex items-center gap-1">
            <RiBuilding2Line /> {job.company?.name}
          </span>
          <span className="flex items-center gap-1">
            <RiMapPinLine /> {job.locationOptions?.join(", ") || "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine /> {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <span className="badge badge-ghost">{job.type}</span>
          <span className="badge badge-ghost">{job.mode}</span>
          <span className="badge badge-ghost">{job.batch}</span>
          {showStatus && (
            <span
              className={`badge ${
                job.status === "approved"
                  ? "badge-success"
                  : job.status === "changes_requested"
                  ? "badge-warning"
                  : job.status === "rejected"
                  ? "badge-error"
                  : "badge-info"
              }`}
            >
              {job.status === "approved"
                ? "Approved"
                : job.status === "changes_requested"
                ? "Changes Requested"
                : job.status === "rejected"
                ? "Rejected"
                : "Under Review"}
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const CalendarGrid = ({ date, setDate }) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  let days = [];
  let day = 1;

  for (let i = 0; i < 42; i++) {
    if (i < startingDay || day > daysInMonth) {
      days.push(null);
    } else {
      days.push(day);
      day++;
    }
  }

  return (
    <div className="bg-dark text-white rounded-b-xl h-[calc(100%-2.5rem)] p-2">
      <div className="grid grid-cols-7 gap-1 h-full">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-red text-center text-xs font-medium h-6 flex items-center justify-center"
          >
            {day.slice(0, 1)}
          </div>
        ))}

        {days.map((dayNum, i) => {
          if (!dayNum) {
            return (
              <div
                key={i}
                className="h-6 flex items-center justify-center text-xs"
              />
            );
          }

          const currentDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            dayNum
          );
          const isToday =
            currentDate.toDateString() === new Date().toDateString();
          const isSelected = currentDate.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              onClick={() => setDate(currentDate)}
              className={`
                h-6 w-6 mx-auto flex items-center justify-center rounded-full text-xs
                transition-colors duration-200
                ${
                  isToday
                    ? "bg-red text-white hover:bg-red/90"
                    : "hover:bg-muted"
                }
                ${isSelected && !isToday ? "border border-red" : ""}
              `}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BranchSelector = ({ selectedBranch, setSelectedBranch }) => (
  <select
    className="select select-bordered w-54"
    value={selectedBranch}
    onChange={(e) => setSelectedBranch(e.target.value)}
  >
    <option value="">Select Branch</option>
    <option value="CSE">Computer Science</option>
    <option value="IT">Information Technology</option>
  </select>
);

const BranchStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalPlaced || 0}</div>
      <div className="stat-title">Total Students</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalCompanies || 0}</div>
      <div className="stat-title">Placed Students</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.placementRate || 0}%</div>
      <div className="stat-title">Placement Rate</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalCompanies || 0}</div>
      <div className="stat-title">Companies</div>
    </div>
  </div>
);

export default Dashboard;
