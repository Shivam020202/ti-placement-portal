import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/utils/axiosConfig";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Toast } from "@/components/ui/toast";
import {
  RiBriefcaseLine,
  RiUserLine,
  RiSearchLine,
  RiDownload2Line,
  RiSendPlaneLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiBuilding2Line,
  RiMailLine,
  RiGraduationCapLine,
} from "react-icons/ri";
import { getLogoUrl } from "@/utils/logoHelper";

const Applications = () => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([
    { label: "Roll Number", value: "rollNumber" },
    { label: "Name", value: "User.fullName" },
    { label: "Email", value: "User.email" },
    { label: "CGPA", value: "cgpa" },
    { label: "Branch", value: "branchCode" },
  ]);

  // Fetch all approved jobs with their applications
  const { data: jobsWithApplications, isLoading } = useQuery({
    queryKey: ["super-admin-applications"],
    queryFn: async () => {
      // First get all approved jobs
      const jobsResponse = await axios.get(
        `${import.meta.env.VITE_URI}/super-admin/job/job-page`
      );

      const allJobs = [
        ...(jobsResponse.data.activeJobs || []),
        ...(jobsResponse.data.inactiveJobs || []),
      ];

      // Fetch applications for each job
      const jobsWithApps = await Promise.all(
        allJobs.map(async (job) => {
          try {
            const appsResponse = await axios.get(
              `${import.meta.env.VITE_URI}/job-listings/admins/applied-stds/${
                job.id
              }`
            );
            return {
              ...job,
              students: appsResponse.data.job?.Students || [],
              applicationCount: appsResponse.data.job?.Students?.length || 0,
            };
          } catch (error) {
            return {
              ...job,
              students: [],
              applicationCount: 0,
            };
          }
        })
      );

      // Filter jobs that have applications
      return jobsWithApps.filter((job) => job.applicationCount > 0);
    },
    enabled: !!auth.token,
  });

  // Mutation to send applications to HR
  const sendToHRMutation = useMutation({
    mutationFn: async (jobId) => {
      const response = await axios.put(
        `${import.meta.env.VITE_URI}/job-listings/admins/send-to-recruiter`,
        { jobId }
      );
      return response.data;
    },
    onSuccess: () => {
      Toast.success("Applications sent to HR successfully!");
      queryClient.invalidateQueries(["super-admin-applications"]);
    },
    onError: (error) => {
      Toast.error(error.response?.data?.message || "Failed to send to HR");
    },
  });

  // Export applications to Excel
  const handleExportExcel = async (jobId, jobTitle) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URI
        }/job-listings/admins/export-applied-std/${jobId}`,
        {
          params: { columns: selectedColumns },
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${jobTitle.replace(/\s+/g, "_")}_applications.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Toast.success("Excel file downloaded successfully!");
    } catch (error) {
      Toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  const handleSendToHR = (jobId) => {
    if (
      window.confirm(
        "Are you sure you want to send all applications for this job to HR? This action cannot be undone."
      )
    ) {
      sendToHRMutation.mutate(jobId);
    }
  };

  const toggleJobExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  // Filter jobs by search term
  const filteredJobs =
    jobsWithApplications?.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.Company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Calculate totals
  const totalApplications =
    filteredJobs?.reduce((sum, job) => sum + job.applicationCount, 0) || 0;
  const jobsWithApps = filteredJobs?.length || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full h-[85vh] overflow-hidden bg-white rounded-xl p-6 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark">Job Applications</h1>
          <p className="text-muted mt-1">
            View and manage student applications grouped by job postings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Applications</p>
                <p className="text-3xl font-bold">{totalApplications}</p>
              </div>
              <RiUserLine className="w-10 h-10 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Jobs with Applications</p>
                <p className="text-3xl font-bold">{jobsWithApps}</p>
              </div>
              <RiBriefcaseLine className="w-10 h-10 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Avg. per Job</p>
                <p className="text-3xl font-bold">
                  {jobsWithApps > 0
                    ? Math.round(totalApplications / jobsWithApps)
                    : 0}
                </p>
              </div>
              <RiGraduationCapLine className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Jobs List with Applications */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <RiBriefcaseLine className="w-16 h-16 mx-auto text-muted mb-4" />
              <h3 className="text-lg font-medium text-dark">
                No Applications Yet
              </h3>
              <p className="text-muted">
                Applications will appear here when students apply to jobs
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-background rounded-xl border overflow-hidden"
              >
                {/* Job Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => toggleJobExpand(job.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        {job.Company?.logo ? (
                          <img
                            src={getLogoUrl(job.Company.logo)}
                            alt={job.Company.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <RiBuilding2Line
                          className={`text-2xl text-muted ${
                            job.Company?.logo ? "hidden" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark">{job.title}</h3>
                        <p className="text-sm text-muted">
                          {job.Company?.name || "Unknown Company"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {job.applicationCount} Applications
                      </span>

                      {/* Check if any applications are already sent to HR */}
                      {job.students?.some(
                        (s) => s.AppliedToJob?.sentToRecruiter
                      ) && (
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-1">
                          <RiCheckLine />
                          Sent to HR
                        </span>
                      )}

                      {expandedJob === job.id ? (
                        <RiArrowUpSLine className="text-2xl text-muted" />
                      ) : (
                        <RiArrowDownSLine className="text-2xl text-muted" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedJob === job.id && (
                  <div className="border-t">
                    {/* Action Buttons */}
                    <div className="p-4 bg-base-100 border-b flex items-center justify-between">
                      <p className="text-sm text-muted">
                        Showing {job.students?.length || 0} applicants
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleExportExcel(job.id, job.title)}
                          className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
                        >
                          <RiDownload2Line />
                          Export Excel
                        </button>
                        <button
                          onClick={() => handleSendToHR(job.id)}
                          disabled={
                            sendToHRMutation.isLoading ||
                            job.students?.every(
                              (s) => s.AppliedToJob?.sentToRecruiter
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RiSendPlaneLine />
                          {job.students?.every(
                            (s) => s.AppliedToJob?.sentToRecruiter
                          )
                            ? "Already Sent"
                            : "Send to HR/Recruiter"}
                        </button>
                      </div>
                    </div>

                    {/* Students Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-base-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              Student
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              Roll Number
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              Branch
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              CGPA
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              Applied On
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200">
                          {job.students?.map((student) => (
                            <tr
                              key={student.rollNumber}
                              className="hover:bg-base-100"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <RiUserLine className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-dark">
                                      {student.User?.fullName || "N/A"}
                                    </p>
                                    <p className="text-xs text-muted">
                                      {student.User?.email || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-dark">
                                {student.rollNumber}
                              </td>
                              <td className="px-4 py-3 text-sm text-dark">
                                {student.branchCode || "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded text-sm font-medium ${
                                    student.cgpa >= 8
                                      ? "bg-green-100 text-green-700"
                                      : student.cgpa >= 7
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {student.cgpa?.toFixed(2) || "N/A"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted">
                                {student.AppliedToJob?.createdAt
                                  ? new Date(
                                      student.AppliedToJob.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                {student.AppliedToJob?.sentToRecruiter ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm flex items-center gap-1 w-fit">
                                    <RiCheckLine />
                                    Sent
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Applications;
