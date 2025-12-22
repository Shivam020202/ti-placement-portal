import React, { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axiosConfig";
import DashboardLayout from "../../components/layouts/Dashboard";
import { authState } from "../../store/atoms/authAtom";
import { Toast } from "@/components/ui/toast";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiBuilding2Line,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiUserLine,
  RiDownloadLine,
} from "react-icons/ri";
import { getLogoUrl } from "@/utils/logoHelper";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-emerald-100 text-emerald-700",
};

const mockApplicants = [
  {
    id: "101234567",
    name: "Aarav Sharma",
    email: "aarav@thapar.edu",
    branch: "CSE",
    cgpa: "9.1",
    appliedAt: new Date().toISOString(),
    resumeLink: "#",
    status: "pending",
  },
  {
    id: "101234568",
    name: "Diya Kapoor",
    email: "diya@thapar.edu",
    branch: "ECE",
    cgpa: "8.7",
    appliedAt: new Date().toISOString(),
    resumeLink: "#",
    status: "approved",
  },
  {
    id: "101234569",
    name: "Rohan Singh",
    email: "rohan@thapar.edu",
    branch: "ME",
    cgpa: "8.2",
    appliedAt: new Date().toISOString(),
    resumeLink: "#",
    status: "rejected",
  },
];

const JobDetail = () => {
  const { id } = useParams();
  const auth = useRecoilValue(authState);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusOverrides, setStatusOverrides] = useState({});

  const {
    data: jobResponse,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["super-admin-job-detail", id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/job-listings/admins/applied-stds/${id}`
      );
      return response.data;
    },
    enabled: !!auth.token && !!id,
  });

  const jobData = jobResponse?.job || jobResponse?.data?.job || null;
  const applicationsData =
    jobData?.Students || (jobError ? mockApplicants : []);

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
    if (resumeMeta.type !== "id") {
      Toast.error("Resume link is unavailable.");
      return;
    }

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
      Toast.error(
        error.response?.data?.message || "Failed to open resume."
      );
    }
  };

  const applicants = useMemo(() => {
    if (!applicationsData) return [];

    return applicationsData.map((student) => {
      if (student.name) {
        const safeStatus =
          student.status === "approved" || student.status === "rejected"
            ? student.status
            : "pending";
        const resumeMeta = parseResumeReference(
          student.resumeLink || student.resume || ""
        );
        return {
          ...student,
          status: statusOverrides[student.id] || safeStatus,
          resumeMeta,
          rollNumber: student.rollNumber || student.id || null,
        };
      }

      const fallbackId =
        student.rollNumber ||
        student.id ||
        student.User?.email ||
        `${student.User?.firstName || "student"}-${student.User?.lastName || ""}`;

      const apiStatus =
        student.AppliedToJob?.status ||
        (student.AppliedToJob?.sentToRecruiter ? "approved" : "pending");
      const normalizedStatus =
        apiStatus === "approved" || apiStatus === "rejected"
          ? apiStatus
          : "pending";

      const rawResume =
        student.AppliedToJob?.resume ||
        student.User?.Resumes?.[0]?.resumeLink ||
        "";

      return {
        id: fallbackId,
        rollNumber: student.rollNumber || null,
        name: `${student.User?.firstName || ""} ${
          student.User?.lastName || ""
        }`.trim(),
        email: student.User?.email || "N/A",
        branch: student.Branch?.name || student.branchCode || "N/A",
        cgpa: student.cgpa || student.AppliedToJob?.stdCgpa || "N/A",
        appliedAt: student.AppliedToJob?.createdAt || student.createdAt,
        resumeMeta: parseResumeReference(rawResume),
        status: statusOverrides[fallbackId] || normalizedStatus,
      };
    });
  }, [applicationsData, statusOverrides]);

  const statusCounts = useMemo(() => {
    return applicants.reduce(
      (acc, applicant) => {
        const status = applicant.status || "pending";
        if (status === "approved") acc.approved += 1;
        else if (status === "rejected") acc.rejected += 1;
        else if (status === "hired") acc.hired += 1;
        else acc.pending += 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0, hired: 0 }
    );
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => applicant.status === activeStatus);
  }, [applicants, activeStatus]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected =
    filteredApplicants.length > 0 &&
    filteredApplicants.every((applicant) => selectedSet.has(applicant.id));
  const selectedApplicants = useMemo(
    () => applicants.filter((applicant) => selectedSet.has(applicant.id)),
    [applicants, selectedSet]
  );

  const hiringSteps = useMemo(() => {
    const steps = Array.isArray(jobData?.HiringProcesses)
      ? jobData.HiringProcesses
      : [];

    const labels = {
      "group-discussion": "Group Discussion",
      "coding-round": "Coding Round",
      interview: "Interview",
      ppt: "PPT",
    };

    return steps
      .map((step) => {
        let venue = "";
        let link = "";
        let detail = "";
        if (step.GroupDiscussion) {
          venue = step.GroupDiscussion.venue;
          link = step.GroupDiscussion.link;
          detail = step.GroupDiscussion.topic || "";
        } else if (step.CodingRound) {
          venue = step.CodingRound.venue;
          link = step.CodingRound.link;
        } else if (step.Interview) {
          venue = step.Interview.venue;
          link = step.Interview.link;
          detail = step.Interview.type || "";
        } else if (step.PPT) {
          venue = step.PPT.venue;
          link = step.PPT.link;
        }

        const start = step.startDateTime
          ? new Date(step.startDateTime).toLocaleString()
          : "";
        const end = step.endDateTime
          ? new Date(step.endDateTime).toLocaleString()
          : "";
        const dateLabel = start && end ? `${start} - ${end}` : start || end;

        return {
          id: step.id,
          index: step.index || 0,
          title: step.title || labels[step.type] || "Round",
          type: step.type,
          venue,
          link,
          detail,
          dateLabel,
        };
      })
      .sort((a, b) => a.index - b.index);
  }, [jobData?.HiringProcesses]);

  const branchCounts = useMemo(() => {
    const counts = applicants.reduce((acc, applicant) => {
      const branch = applicant.branch || "Unknown";
      acc[branch] = (acc[branch] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([branch, count]) => ({ branch, count }))
      .sort((a, b) => b.count - a.count);
  }, [applicants]);

  const cgpaBands = useMemo(() => {
    const bands = [
      { label: "0-6", min: 0, max: 6 },
      { label: "6-7", min: 6, max: 7 },
      { label: "7-8", min: 7, max: 8 },
      { label: "8-9", min: 8, max: 9 },
      { label: "9-10", min: 9, max: 10.01 },
    ];

    const values = applicants
      .map((applicant) => Number(applicant.cgpa))
      .filter((value) => Number.isFinite(value));

    const counts = bands.map((band) => ({
      ...band,
      count: values.filter(
        (cgpa) => cgpa >= band.min && cgpa < band.max
      ).length,
    }));

    return counts;
  }, [applicants]);

  const appliedPerDay = useMemo(() => {
    const windowSize = 10;
    const today = new Date();
    const dayMap = applicants.reduce((acc, applicant) => {
      if (!applicant.appliedAt) return acc;
      const key = new Date(applicant.appliedAt).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const series = Array.from({ length: windowSize }).map((_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (windowSize - 1 - idx));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        count: dayMap[key] || 0,
      };
    });

    const maxCount = Math.max(
      1,
      ...series.map((entry) => entry.count)
    );

    return { series, maxCount };
  }, [applicants]);

  const toggleSelect = (idToToggle) => {
    setSelectedIds((prev) =>
      prev.includes(idToToggle)
        ? prev.filter((id) => id !== idToToggle)
        : [...prev, idToToggle]
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredApplicants.some((applicant) => applicant.id === id)
        )
      );
      return;
    }

    const visibleIds = filteredApplicants.map((applicant) => applicant.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleBulkUpdate = async (nextStatus) => {
    if (!selectedIds.length) {
      Toast.error("Select at least one applicant to continue.");
      return;
    }

    const rollNumbers = selectedApplicants
      .map((applicant) => applicant.rollNumber)
      .filter(Boolean);

    if (!rollNumbers.length) {
      Toast.error("Selected applicants are missing roll numbers.");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_URI}/job-listings/admins/applications/status`,
        {
          jobId: Number(id),
          studentRollNumbers: rollNumbers,
          status: nextStatus,
        }
      );

      setStatusOverrides((prev) => {
        const next = { ...prev };
        selectedIds.forEach((applicantId) => {
          next[applicantId] = nextStatus;
        });
        return next;
      });

      Toast.success(
        `${selectedIds.length} application${
          selectedIds.length > 1 ? "s" : ""
        } marked as ${nextStatus}.`
      );
      setSelectedIds([]);
    } catch (error) {
      Toast.error(
        error.response?.data?.message || "Failed to update applications."
      );
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading || jobLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <DashboardLayout>
        <div className="w-full h-[85vh] bg-white rounded-xl p-6 flex flex-col items-center justify-center">
          <RiFileTextLine className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-dark mb-2">
            {jobError ? "Unable to load job details" : "Job not found"}
          </h2>
          {jobError && (
            <p className="text-muted mb-4 text-center max-w-lg">
              {jobError.response?.data?.reason ||
                "There was a problem loading this job. Please try again."}
            </p>
          )}
          <Link
            to="/super-admin/job-listings"
            className="btn btn-primary"
          >
            Back to Job Listings
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const companyName = jobData?.Company?.name || "Unknown Company";
  const companyLogo = getLogoUrl(jobData?.Company?.logo);
  const listingStatus = jobData?.Review?.status || "under_review";
  const descriptionFile = jobData?.descriptionFile;
  const descriptionLink =
    descriptionFile && descriptionFile.startsWith("http")
      ? descriptionFile
      : descriptionFile
      ? `${import.meta.env.VITE_URI}${descriptionFile}`
      : "";
  const locations = Array.isArray(jobData?.locationOptions)
    ? jobData.locationOptions.join(", ")
    : jobData?.locationOptions || "N/A";
  const gradYears = Array.isArray(jobData?.gradYear)
    ? jobData.gradYear.join(", ")
    : jobData?.gradYear || "N/A";
  const branchEligibility = Array.isArray(jobData?.Branches)
    ? jobData.Branches.map((branch) => ({
        id: branch.code || branch.id || branch.name,
        code: branch.code,
        name: branch.name || branch.code || "Branch",
        minCgpa: branch.JobBranch?.minCgpa,
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="w-full h-[85vh] overflow-hidden bg-white rounded-xl flex flex-col">
        <div className="p-6 border-b">
          <Link
            to="/super-admin/job-listings"
            className="flex items-center gap-2 text-muted hover:text-primary mb-4 text-sm"
          >
            <RiArrowLeftLine />
            Back to Job Listings
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center shadow-sm">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <RiBuilding2Line className="w-8 h-8 text-muted" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark">
                  {jobData?.title}
                </h1>
                <p className="text-muted font-medium">{companyName}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listingStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : listingStatus === "changes_requested"
                        ? "bg-yellow-100 text-yellow-700"
                        : listingStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {listingStatus.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {applicants.length} Applicants
                  </span>
                  {jobData?.createdAt && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-muted">
                      Posted {new Date(jobData.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <RiBriefcaseLine />
                  Role
                </div>
                <p className="font-semibold text-sm mt-1">
                  {jobData?.role || "N/A"}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <RiMapPinLine />
                  Locations
                </div>
                <p className="font-semibold text-sm mt-1">{locations}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <RiMoneyDollarCircleLine />
                  CTC
                </div>
                <p className="font-semibold text-sm mt-1">
                  {jobData?.ctc ? `${jobData.ctc} LPA` : "N/A"}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <RiCalendarLine />
                  Deadline
                </div>
                <p className="font-semibold text-sm mt-1">
                  {jobData?.applicationDeadline
                    ? new Date(
                        jobData.applicationDeadline
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <RiTimeLine />
                  Batch
                </div>
                <p className="font-semibold text-sm mt-1">{gradYears}</p>
              </div>
              {descriptionLink && (
                <a
                  href={descriptionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background rounded-lg p-3 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2 text-muted text-xs">
                    <RiFileTextLine />
                    JD File
                  </div>
                  <p className="font-semibold text-sm mt-1 text-primary">
                    View document
                  </p>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-background rounded-xl p-5">
              <h2 className="text-lg font-semibold text-dark mb-3">
                Job Description
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {jobData?.descriptionText || "No description provided."}
              </p>
            </div>
            <div className="bg-background rounded-xl p-5">
              <h2 className="text-lg font-semibold text-dark mb-3">
                Responsibilities
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {jobData?.responsibilities || "No responsibilities listed."}
              </p>
            </div>
            <div className="bg-background rounded-xl p-5 lg:col-span-2">
              <h2 className="text-lg font-semibold text-dark mb-3">
                Requirements
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {jobData?.requirements || "No requirements specified."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl p-5">
              <h2 className="text-lg font-semibold text-dark mb-4">
                Eligibility Snapshot
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Batch</span>
                  <span className="font-semibold text-dark">{gradYears}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Failed Subjects</span>
                  <span className="font-semibold text-dark">
                    {jobData?.failedSubjects ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Active Backlogs</span>
                  <span className="font-semibold text-dark">
                    {jobData?.activeBacklogsAcceptable === true
                      ? "Allowed"
                      : jobData?.activeBacklogsAcceptable === false
                      ? "Not allowed"
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Bond</span>
                  <span className="font-semibold text-dark">
                    {jobData?.bondInYrs ? `${jobData.bondInYrs} yrs` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark">
                  Branch Eligibility
                </h2>
                <span className="text-xs text-muted">
                  {branchEligibility.length
                    ? `${branchEligibility.length} branches`
                    : "No restrictions"}
                </span>
              </div>
              {branchEligibility.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {branchEligibility.map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-white rounded-lg p-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-dark">
                            {branch.name}
                          </p>
                          {branch.code && (
                            <p className="text-xs text-muted">{branch.code}</p>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          Min CGPA {branch.minCgpa ?? "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  All branches are eligible for this listing.
                </p>
              )}
            </div>
          </div>

          <div className="bg-background rounded-xl p-5">
            <h2 className="text-lg font-semibold text-dark mb-4">
              Hiring Process
            </h2>
            {hiringSteps.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hiringSteps.map((step, index) => (
                  <div
                    key={step.id || `${step.title}-${index}`}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                          {step.index || index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-dark">
                            {step.title}
                          </p>
                          <p className="text-xs text-muted">
                            {step.type?.replace("-", " ")}
                          </p>
                        </div>
                      </div>
                      {step.venue && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {step.venue}
                        </span>
                      )}
                    </div>
                    {step.dateLabel && (
                      <p className="text-xs text-muted mt-3">
                        {step.dateLabel}
                      </p>
                    )}
                    {step.detail && (
                      <p className="text-xs text-muted mt-1">{step.detail}</p>
                    )}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary mt-2"
                      >
                        Join link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No hiring steps added yet.</p>
            )}
          </div>

          <div className="bg-background rounded-xl p-5">
            <h2 className="text-lg font-semibold text-dark mb-4">
              Application Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  Applicants by Branch
                </h3>
                {branchCounts.length ? (
                  <div className="space-y-3">
                    {branchCounts.map((item) => (
                      <div key={item.branch}>
                        <div className="flex items-center justify-between text-xs text-muted mb-1">
                          <span>{item.branch}</span>
                          <span>{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{
                              width: `${
                                (item.count / Math.max(applicants.length, 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    No applicants yet.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  CGPA Distribution
                </h3>
                {cgpaBands.some((band) => band.count > 0) ? (
                  <div className="space-y-3">
                    {cgpaBands.map((band) => (
                      <div key={band.label}>
                        <div className="flex items-center justify-between text-xs text-muted mb-1">
                          <span>{band.label}</span>
                          <span>{band.count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-2 bg-dark rounded-full"
                            style={{
                              width: `${
                                (band.count /
                                  Math.max(applicants.length, 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    CGPA data unavailable.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  Applied per Day
                </h3>
                <div className="flex items-end gap-2 h-32">
                  {appliedPerDay.series.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full bg-red/5 rounded-full h-24 flex items-end">
                        <div
                          className="w-full bg-primary rounded-full"
                          style={{
                            height: `${
                              (entry.count / appliedPerDay.maxCount) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted">
                        {entry.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-dark">
                  Applications
                </h2>
                <p className="text-sm text-muted">
                  Review and bulk approve or reject applicants.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeStatus === "pending"
                      ? "bg-primary text-white"
                      : "bg-white text-muted hover:text-primary"
                  }`}
                  onClick={() => setActiveStatus("pending")}
                >
                  Pending ({statusCounts.pending})
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeStatus === "approved"
                      ? "bg-primary text-white"
                      : "bg-white text-muted hover:text-primary"
                  }`}
                  onClick={() => setActiveStatus("approved")}
                >
                  Approved ({statusCounts.approved})
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeStatus === "rejected"
                      ? "bg-primary text-white"
                      : "bg-white text-muted hover:text-primary"
                  }`}
                  onClick={() => setActiveStatus("rejected")}
                >
                  Rejected ({statusCounts.rejected})
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeStatus === "hired"
                      ? "bg-primary text-white"
                      : "bg-white text-muted hover:text-primary"
                  }`}
                  onClick={() => setActiveStatus("hired")}
                >
                  Hired ({statusCounts.hired})
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleBulkUpdate("approved")}
                  disabled={!selectedIds.length}
                >
                  <RiCheckLine />
                  Approve Selected
                </button>
                <button
                  className="btn btn-sm btn-outline border-red text-red hover:bg-red hover:text-white"
                  onClick={() => handleBulkUpdate("rejected")}
                  disabled={!selectedIds.length}
                >
                  <RiCloseLine />
                  Reject Selected
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleBulkUpdate("hired")}
                  disabled={!selectedIds.length}
                >
                  <RiCheckLine />
                  Mark Hired
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {jobLoading ? (
                <div className="p-6">
                  <div className="loading loading-spinner text-primary"></div>
                </div>
              ) : filteredApplicants.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error checkbox-sm"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          CGPA
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          Applied On
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          Resume
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApplicants.map((applicant) => (
                        <tr key={applicant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-error checkbox-sm"
                              checked={selectedSet.has(applicant.id)}
                              onChange={() => toggleSelect(applicant.id)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <RiUserLine className="text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-dark">
                                  {applicant.name || "Student"}
                                </p>
                                <p className="text-xs text-muted">
                                  {applicant.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-dark">
                            {applicant.branch}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-dark">
                            {applicant.cgpa}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted">
                            {applicant.appliedAt
                              ? new Date(
                                  applicant.appliedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {applicant.resumeMeta?.type &&
                            applicant.resumeMeta.type !== "none" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleResumeOpen(applicant.resumeMeta)
                                }
                                className="inline-flex items-center gap-1 text-primary hover:text-red"
                              >
                                <RiDownloadLine />
                                View
                              </button>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[applicant.status] ||
                                statusStyles.pending
                              }`}
                            >
                              {applicant.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center text-muted">
                  No {activeStatus} applications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
