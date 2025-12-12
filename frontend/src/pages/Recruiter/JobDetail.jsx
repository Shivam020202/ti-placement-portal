import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import {
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiUserLine,
  RiArrowLeftLine,
  RiDownloadLine,
  RiTimeLine,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";

const JobDetail = () => {
  const { id } = useParams();
  const auth = useRecoilValue(authState);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job-detail", id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/recruiters/${id}`
      );
      return response.data.data || response.data;
    },
  });

  // Fetch applications for this job
  const { data: applications } = useQuery({
    queryKey: ["job-applications", id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/recruiters/applied-stds/${id}`
      );
      return response.data.job?.Students || [];
    },
  });

  if (isLoading) {
    return (
      <Dashboard role="recruiter">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Dashboard>
    );
  }

  if (!job) {
    return (
      <Dashboard role="recruiter">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Job not found</h2>
          <Link to="/recruiter/jobs" className="text-blue-600 hover:underline">
            Back to Job Listings
          </Link>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <RiArrowLeftLine className="w-5 h-5" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-dark mb-2">
                {job.jobTitle}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.isActive ? "Active" : "Closed"}
                </span>
                <span className="text-muted">
                  {applications?.length || 0} Applications
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <RiBriefcaseLine className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted">Job Type</p>
                <p className="font-medium">{job.jobType || "Full-time"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <RiMapPinLine className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="font-medium">{job.location || "Remote"}</p>
              </div>
            </div>
            {job.salary && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <RiMoneyDollarCircleLine className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted">Salary</p>
                  <p className="font-medium">₹{job.salary}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <RiCalendarLine className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted">Posted On</p>
                <p className="font-medium">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="prose max-w-none text-gray-700">
            {job.jobDescription || "No description provided"}
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <div className="prose max-w-none text-gray-700">
              {job.requirements}
            </div>
          </div>
        )}

        {/* Hiring Process */}
        {job.HiringProcesses && job.HiringProcesses.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hiring Process</h2>
            <div className="space-y-3">
              {job.HiringProcesses.map((process, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {process.roundType || process.type}
                    </p>
                    {process.date && (
                      <p className="text-sm text-muted flex items-center gap-1">
                        <RiTimeLine className="w-4 h-4" />
                        {new Date(process.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Applications ({applications?.length || 0})
            </h2>
            {applications && applications.length > 0 && (
              <a
                href={`${
                  import.meta.env.VITE_URI
                }/job-listings/recruiters/export-applied-std/${id}?columns=firstName,lastName,email,cgpa`}
                className="btn btn-outline flex items-center gap-2"
              >
                <RiDownloadLine className="w-4 h-4" />
                Export to Excel
              </a>
            )}
          </div>

          {applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((student) => (
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
                            <div className="text-sm text-muted">
                              {student.User?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {student.Branch?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.cgpa || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {student.AppliedToJob?.createdAt
                            ? new Date(
                                student.AppliedToJob.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.User?.Resumes?.[0] && (
                          <a
                            href={student.User.Resumes[0].resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <RiDownloadLine className="w-4 h-4" />
                            View
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              No applications yet
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default JobDetail;
