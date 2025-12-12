import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Link } from "react-router-dom";
import {
  RiUserLine,
  RiFileTextLine,
  RiMailLine,
  RiEyeLine,
  RiDownloadLine,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";

const Applications = () => {
  const auth = useRecoilValue(authState);
  const [selectedJob, setSelectedJob] = useState("all");

  // Fetch all jobs with their applications
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["recruiter-jobs-with-applications"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/recruiters`
      );
      return response.data || [];
    },
  });

  // Flatten all applications from all jobs
  const allApplications =
    jobs?.flatMap((job) =>
      (job.Students || []).map((student) => ({
        ...student,
        jobId: job.id,
        jobTitle: job.jobTitle,
        appliedAt: student.AppliedToJob?.createdAt,
      }))
    ) || [];

  const filteredApplications = allApplications?.filter((app) => {
    const matchesJob =
      selectedJob === "all" || app.jobId === parseInt(selectedJob);
    return matchesJob;
  });

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark">Applications</h1>
          <p className="text-muted mt-1">
            Review and manage candidate applications
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            {/* Job Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="select bg-background w-full"
              >
                <option value="all">All Jobs</option>
                {jobs?.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobTitle} ({job.Students?.length || 0} applications)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredApplications && filteredApplications.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <RiUserLine className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark">
                            {student.User?.firstName} {student.User?.lastName}
                          </div>
                          <div className="text-sm text-muted flex items-center gap-1">
                            <RiMailLine className="w-3 h-3" />
                            {student.User?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-dark font-medium">
                        {student.jobTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted">
                        {student.Branch?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-dark">
                        {student.cgpa || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {student.User?.Resumes?.[0] && (
                          <a
                            href={student.User.Resumes[0].resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <RiDownloadLine className="w-4 h-4" />
                            Resume
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RiFileTextLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">
              No applications found
            </h3>
            <p className="text-muted">
              {selectedJob !== "all"
                ? "Try adjusting your filters"
                : "Applications will appear here once candidates start applying"}
            </p>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Applications;
