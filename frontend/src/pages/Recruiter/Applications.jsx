import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  RiCheckLine,
  RiCloseLine,
  RiBriefcase2Line,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";

const Applications = () => {
  const auth = useRecoilValue(authState);
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const parseResumeReference = (rawResume) => {
    if (!rawResume) return { type: "none" };
    if (rawResume.startsWith("http")) {
      return { type: "url", url: rawResume };
    }
    const match = rawResume.match(/ID:\s*(\d+)/i);
    if (match) {
      return { type: "id", id: match[1], label: rawResume };
    }
    return { type: "text", label: rawResume };
  };

  const handleResumeOpen = async (resumeMeta) => {
    if (!resumeMeta || resumeMeta.type === "none") return;
    if (resumeMeta.type === "url") {
      window.open(resumeMeta.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (resumeMeta.type !== "id") return;

    const newTab = window.open("", "_blank", "noopener,noreferrer");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/super-admin/resumes/download/${resumeMeta.id}`,
        { responseType: "blob" }
      );
      const blobUrl = window.URL.createObjectURL(response.data);
      if (newTab) {
        newTab.location.href = blobUrl;
      } else {
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      if (newTab) newTab.close();
    }
  };

  const normalizeJob = (job) => {
    const title = job.title || job.jobTitle || job.position || "Untitled role";
    const jobType = job.role || job.jobType || "Not specified";
    const location = Array.isArray(job.locationOptions)
      ? job.locationOptions.join(", ")
      : job.locationOptions || job.location || "Remote";
    const salary = job.ctc ?? job.salary ?? job.compensation;

    return {
      ...job,
      id: job.id ?? job.jobId,
      title,
      jobType,
      location,
      salary,
    };
  };

  // Fetch all jobs with their applications
  const { data: jobs, isLoading: jobsLoading } = useQuery({
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

  // Fetch applications (all or per job) from recruiter applied students endpoint
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["recruiter-applications", selectedJob, jobs?.length],
    enabled: Array.isArray(jobs) && jobs.length > 0,
    queryFn: async () => {
      // helper to fetch applicants for a job
      const fetchJobApps = async (jobId) => {
        const res = await axios.get(
          `${
            import.meta.env.VITE_URI
          }/job-listings/recruiters/applied-stds/${jobId}`
        );
        const students = res.data?.job?.Students || [];
        return students.map((student) => ({
          ...student,
          rollNumber: student.rollNumber,
          status:
            student.AppliedToJob?.status ||
            (student.AppliedToJob?.sentToRecruiter ? "approved" : "pending"),
          resumeMeta: parseResumeReference(
            student.AppliedToJob?.resume ||
              student.User?.Resumes?.[0]?.resumeLink ||
              ""
          ),
          jobId,
          jobTitle: res.data?.job?.title || res.data?.job?.jobTitle,
          appliedAt: student.AppliedToJob?.createdAt,
        }));
      };

      if (selectedJob === "all") {
        const results = await Promise.all(
          jobs.map((job) => fetchJobApps(job.id))
        );
        return results.flat();
      }

      return fetchJobApps(selectedJob);
    },
  });

  const filteredApplications = applications || [];
  const selectedSet = new Set(selectedIds);
  const allVisibleSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((item) => selectedSet.has(item.rollNumber));

  const toggleSelect = (roll) => {
    setSelectedIds((prev) =>
      prev.includes(roll) ? prev.filter((id) => id !== roll) : [...prev, roll]
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredApplications.some((item) => item.rollNumber === id)
        )
      );
      return;
    }
    const ids = filteredApplications
      .map((item) => item.rollNumber)
      .filter(Boolean);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const bulkUpdateStatus = async (nextStatus) => {
    if (!selectedIds.length) return;

    // ensure single job
    const selectedApps = filteredApplications.filter((app) =>
      selectedSet.has(app.rollNumber)
    );
    const jobId = selectedApps[0]?.jobId;
    if (!jobId) return;
    const mixedJob = selectedApps.some((app) => app.jobId !== jobId);
    if (mixedJob) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_URI}/job-listings/recruiters/applications/status`,
        {
          jobId,
          studentRollNumbers: selectedIds,
          status: nextStatus,
        }
      );
      setSelectedIds([]);
      queryClient.invalidateQueries({
        queryKey: ["recruiter-applications"],
      });
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
    } catch (error) {
      // swallow
    }
  };

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
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {jobsLoading || appsLoading ? (
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
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-error"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
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
                    Status
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
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-error"
                        checked={selectedSet.has(student.rollNumber)}
                        onChange={() => toggleSelect(student.rollNumber)}
                      />
                    </td>
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === "hired"
                            ? "bg-green-100 text-green-700"
                            : student.status === "approved"
                            ? "bg-blue-100 text-blue-700"
                            : student.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {student.resumeMeta?.type &&
                        student.resumeMeta.type !== "none" ? (
                          <button
                            type="button"
                            onClick={() => handleResumeOpen(student.resumeMeta)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <RiDownloadLine className="w-4 h-4" />
                            Resume
                          </button>
                        ) : (
                          <span className="text-muted text-xs">No resume</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-3 p-4 border-t bg-gray-50">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => bulkUpdateStatus("approved")}
                disabled={!selectedIds.length}
              >
                <RiCheckLine />
                Approve
              </button>
              <button
                className="btn btn-sm btn-outline border-red text-red hover:bg-red hover:text-white"
                onClick={() => bulkUpdateStatus("rejected")}
                disabled={!selectedIds.length}
              >
                <RiCloseLine />
                Reject
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => bulkUpdateStatus("hired")}
                disabled={!selectedIds.length}
              >
                <RiBriefcase2Line />
                Mark Hired
              </button>
            </div>
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
