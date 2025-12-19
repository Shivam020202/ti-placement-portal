import React, { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Toast } from "@/components/ui/toast";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { assets } from "../../assets/assets";
import { Link, Navigate } from "react-router-dom";
import {
  RiFilter3Line,
  RiMoreLine,
  RiUserLine,
  RiCheckLine,
  RiCloseLine,
  RiUserAddLine,
  RiMessage2Line,
} from "react-icons/ri";
import AssignAdminModal from "@/components/job/AssignAdminModal";

const mockJobs = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer",
    logo: assets.googleLogo,
    createdAt: new Date().toISOString(),
    hr: "john.doe@google.com",
    location: "Bangalore",
    salary: "15-20 LPA",
    status: "pending",
    assignedAdmin: null,
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Frontend Developer",
    logo: assets.microsoftLogo,
    createdAt: new Date().toISOString(),
    hr: "jane.smith@microsoft.com",
    location: "Hyderabad",
    salary: "20-25 LPA",
    status: "approved",
    assignedAdmin: "Admin User",
  },
  {
    id: 3,
    company: "Amazon",
    position: "Backend Developer",
    logo: assets.amazonLogo,
    createdAt: new Date().toISOString(),
    hr: "mike.jones@amazon.com",
    location: "Mumbai",
    salary: "18-22 LPA",
    status: "changes_requested",
    assignedAdmin: "Super Admin",
  },
];

const JobListings = () => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = useState("newest");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [activeTab, setActiveTab] = useState("recruiter_listings");

  // Fetch job listings
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["job-listings"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/job/job-page`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        const normalizeJob = (job) => {
          // Handle case where User might be missing or different field name
          const hrEmail = job.User?.email || job.user?.email || "Unknown";
          const companyName =
            job.Company?.name || job.company?.name || "Unknown Company";
          const companyLogo = job.Company?.logo || assets.googleLogo;

          // Map Review status
          const status = job.Review?.status || "pending";

          // Determine assigned admin name
          const assignedAdmin =
            job.Review?.InternallyAssignedTo?.[0]?.fullName || null;

          return {
            id: job.id,
            company: companyName,
            position: job.title,
            logo: companyLogo,
            createdAt: job.createdAt,
            hr: hrEmail,
            location: Array.isArray(job.locationOptions)
              ? job.locationOptions.join(", ")
              : job.locationOptions,
            salary: job.ctc ? `${job.ctc} LPA` : "Not disclosed",
            status: status,
            assignedAdmin: assignedAdmin,
            // Keep original object for reference if needed
            original: job,
          };
        };

        return {
          activeJobs: (response.data.activeJobs || []).map(normalizeJob),
          inactiveJobs: (response.data.inactiveJobs || []).map(normalizeJob),
          metrics: response.data.metrices,
        };
      } catch (error) {
        console.error("API Error:", error);
        return {
          activeJobs: mockJobs.filter((job) => job.status === "approved"),
          inactiveJobs: mockJobs.filter((job) => job.status !== "approved"),
          metrics: {
            totalListings: mockJobs.length,
            liveListings: mockJobs.filter((job) => job.status === "approved")
              .length,
            Companies: 3,
          },
        };
      }
    },
    enabled: !!auth.token,
  });

  const currentList = React.useMemo(() => {
    if (!jobsData) return [];
    if (activeTab === "recruiter_listings") return jobsData.inactiveJobs || [];
    return jobsData.activeJobs || [];
  }, [jobsData, activeTab]);

  const sortedJobs = React.useMemo(() => {
    const sorted = [...currentList].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return sorted;
  }, [currentList, sortOrder]);

  // Handle admin assignment
  const handleAssignAdmin = async (admin) => {
    try {
      console.log("Assigning admin:", {
        adminData: admin,
        jobId: selectedJob?.id,
      });

      await axios.post(
        `${import.meta.env.VITE_URI}/super-admin/job/${selectedJob.id}/perm`,
        {
          admins: [
            {
              email: admin.email,
              id: admin.id,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      queryClient.invalidateQueries(["job-listings"]);
      Toast.success("Admin assigned successfully");
      setShowAssignModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Admin assignment error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        adminData: admin,
        jobId: selectedJob?.id,
      });
      Toast.error(error.response?.data?.message || "Failed to assign admin");
    }
  };

  // Handle status changes
  const handleStatusChange = async (jobId, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_URI}/super-admin/job/${jobId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Toast.success(`Job listing ${status.replace("_", " ")} successfully`);
      queryClient.invalidateQueries(["job-listings"]);
    } catch (error) {
      console.error("Status change error:", error);
      Toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Delete job listing
  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URI}/super-admin/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      Toast.success("Job listing deleted successfully");
      queryClient.invalidateQueries(["job-listings"]);
    } catch (error) {
      Toast.error("Failed to delete job listing");
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading || isLoading) {
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
      <div className="w-full h-[80vh] overflow-hidden bg-white rounded-xl p-7 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <button
              className={`pb-2 px-1 text-lg font-semibold transition-colors relative ${
                activeTab === "recruiter_listings"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted hover:text-dark"
              }`}
              onClick={() => setActiveTab("recruiter_listings")}
            >
              Recruiter Listings
            </button>
            <button
              className={`pb-2 px-1 text-lg font-semibold transition-colors relative ${
                activeTab === "active_jobs"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted hover:text-dark"
              }`}
              onClick={() => setActiveTab("active_jobs")}
            >
              Active Jobs
            </button>
          </div>
          <div className="flex items-center px-2 rounded-lg bg-dark text-white">
            <RiFilter3Line size={20} />
            <select
              className="select bg-dark focus:outline-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
          <div className="grid grid-cols-1 gap-4 pb-4">
            {sortedJobs.map((job) => (
              <div key={job.id} className="card bg-background">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16">
                          <img src={job.logo} alt="" className="rounded-lg" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{job.company}</h2>
                          <div className="text-lg text-muted font-semibold">
                            {job.position}
                          </div>
                          <div className="flex items-center text-sm text-red opacity-70">
                            Posted:{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg w-fit">
                        <RiUserLine className="text-primary" />
                        <div>
                          <div className="text-sm opacity-70">
                            Company Representative
                          </div>
                          <Link
                            to={`/super-admin/chat/${job.hr}`}
                            className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {job.hr}
                            <RiMessage2Line className="text-primary" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 text-muted text-sm">
                      <div>2026 Batch</div>
                      <div>|</div>
                      <div>{job.location}</div>
                      <div>|</div>
                      <div>{job.salary}</div>
                    </div>

                    <div className="h-full flex flex-col gap-3">
                      {/* Assign Admin Section */}
                      <div className="flex items-center gap-3">
                        {job.assignedAdmin ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <RiUserLine size={20} className="text-gray-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted">
                                Assigned to
                              </span>
                              <span className="font-semibold text-dark text-sm">
                                {job.assignedAdmin}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm rounded-full border-2 border-red text-red gap-2 hover:bg-red hover:text-white"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowAssignModal(true);
                            }}
                          >
                            <RiUserAddLine />
                            Assign Admin
                          </button>
                        )}
                      </div>

                      {/* Status Dropdown - Always Visible */}
                      <div className="dropdown dropdown-hover dropdown-left dropdown-start">
                        <label
                          tabIndex={0}
                          className={`px-6 py-2 text-white rounded-lg w-full flex items-center justify-center gap-2 cursor-pointer ${
                            job.status === "approved"
                              ? "bg-green-500"
                              : job.status === "changes_requested"
                              ? "bg-yellow-500"
                              : job.status === "rejected"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {(job.status === "under_review" ||
                            job.status === "pending") && (
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          )}
                          {job.status === "under_review" ||
                          job.status === "pending"
                            ? "Under Review"
                            : job.status === "approved"
                            ? "Approved"
                            : job.status === "changes_requested"
                            ? "Changes Requested"
                            : job.status === "rejected"
                            ? "Rejected"
                            : "Select Status"}
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 bg-white gap-2 rounded-box w-52 shadow-lg"
                        >
                          <li>
                            <button
                              className="bg-success flex items-center gap-2"
                              disabled={job.status === "approved"}
                              onClick={() =>
                                handleStatusChange(job.id, "approved")
                              }
                            >
                              <RiCheckLine />
                              Approve Listing
                            </button>
                          </li>
                          <li>
                            <button
                              className="bg-warning flex items-center gap-2"
                              disabled={job.status === "changes_requested"}
                              onClick={() =>
                                handleStatusChange(job.id, "changes_requested")
                              }
                            >
                              <RiMoreLine />
                              Request Changes
                            </button>
                          </li>
                          <li>
                            <button
                              className="bg-error flex items-center gap-2"
                              disabled={job.status === "rejected"}
                              onClick={() =>
                                handleStatusChange(job.id, "rejected")
                              }
                            >
                              <RiCloseLine />
                              Reject Listing
                            </button>
                          </li>
                          <li>
                            <button
                              className="bg-error flex items-center gap-2"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <RiCloseLine />
                              Delete Listing
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAssignModal && (
        <AssignAdminModal
          jobId={selectedJob?.id}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedJob(null);
          }}
          onAssign={handleAssignAdmin}
        />
      )}
    </DashboardLayout>
  );
};

export default JobListings;
