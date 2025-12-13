import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiDeleteBinLine,
  RiTimerLine,
  RiMapPinLine,
  RiBookOpenLine,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";
import axios from "@/utils/axiosConfig";
import { Toast } from "@/components/ui/toast";

const defaultWorkflow = {
  title: "Initial Interview",
  type: "interview",
  date: { from: "", to: "" },
  venue: "",
  interviewType: "hr",
  link: "",
};

const JobCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [job, setJob] = useState({
    title: "",
    requirements: "",
    responsibilities: "",
    descriptionText: "",
    descriptionFile: "",
    webLinks: "",
    role: "FTE",
    gradYear: "2025,2026",
    failedSubjects: 0,
    activeBacklogsAcceptable: false,
    applicationDeadline: "",
    bondInYrs: 0,
    locationOptions: "Remote",
    ctc: 0,
    ctcBreakup: "Base,Bonus",
  });

  const [branchesCgpa, setBranchesCgpa] = useState({});
  const [workflowData, setWorkflowData] = useState([defaultWorkflow]);

  const { data: branches } = useQuery({
    queryKey: ["recruiter-branches"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URI}/recruiter/branches`
      );
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data?.branches && Array.isArray(data.branches)) return data.branches;
      return [];
    },
  });

  useEffect(() => {
    if (
      Array.isArray(branches) &&
      branches.length &&
      Object.keys(branchesCgpa).length === 0
    ) {
      const initial = Object.fromEntries(branches.map((b) => [b.code, "8.0"]));
      setBranchesCgpa(initial);
    }
  }, [branches, branchesCgpa]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      return axios.post(
        `${import.meta.env.VITE_URI}/job-listings/recruiters`,
        payload
      );
    },
    onSuccess: () => {
      Toast.success("Job created successfully");
      queryClient.invalidateQueries(["recruiter-jobs"]);
      navigate("/recruiter/jobs");
    },
    onError: (err) => {
      Toast.error(err.response?.data?.message || "Failed to create job");
    },
  });

  const handleJobChange = (key, value) =>
    setJob((prev) => ({ ...prev, [key]: value }));

  const handleWorkflowChange = (index, key, value) => {
    setWorkflowData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addWorkflow = () =>
    setWorkflowData((prev) => [...prev, { ...defaultWorkflow }]);
  const removeWorkflow = (idx) =>
    setWorkflowData((prev) => prev.filter((_, i) => i !== idx));

  const payload = useMemo(() => {
    const toArray = (v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const normalizeVenue = (venue) => {
      const v = (venue || "").trim().toLowerCase();
      if (["online", "virtual", "remote", "zoom", "meet"].includes(v)) {
        return "online";
      }
      return "offline";
    };

    const workflowWithIndex = workflowData.map((step, idx) => {
      const venue = normalizeVenue(step.venue);
      const link = venue === "online" ? step.link : null;
      return {
        ...step,
        venue,
        link,
        index: step.index ?? idx,
      };
    });

    const cgpaParsed = Object.fromEntries(
      Object.entries(branchesCgpa).map(([code, value]) => [
        code,
        parseFloat(value) || 0,
      ])
    );

    return {
      jobListingData: {
        ...job,
        webLinks: toArray(job.webLinks),
        gradYear: toArray(job.gradYear),
        locationOptions: toArray(job.locationOptions),
        ctcBreakup: toArray(job.ctcBreakup),
        workflowData: workflowWithIndex,
      },
      branchWiseMinCgpa: cgpaParsed,
    };
  }, [job, workflowData, branchesCgpa]);

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(payload);
  };

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6 min-h-screen overflow-y-auto max-h-screen pb-28">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted flex items-center gap-2">
              <RiArrowLeftLine className="w-4 h-4" />
              <Link to="/recruiter/jobs" className="hover:underline">
                Back to job listings
              </Link>
            </p>
            <h1 className="text-3xl font-bold text-dark mt-2">Post a Job</h1>
            <p className="text-muted mt-1">
              Provide required details and publish to students.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <RiBriefcaseLine className="w-6 h-6" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title</label>
                <input
                  value={job.title}
                  onChange={(e) => handleJobChange("title", e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Role Type</label>
                <select
                  value={job.role}
                  onChange={(e) => handleJobChange("role", e.target.value)}
                  className="select w-full"
                >
                  <option value="FTE">FTE</option>
                  <option value="Internship">Internship</option>
                  <option value="Internship + FTE">Internship + FTE</option>
                  <option value="Internship + PPO">Internship + PPO</option>
                </select>
              </div>
              <div>
                <label className="label">Application Deadline</label>
                <input
                  type="datetime-local"
                  value={job.applicationDeadline}
                  onChange={(e) =>
                    handleJobChange("applicationDeadline", e.target.value)
                  }
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">CTC (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={job.ctc}
                  onChange={(e) => handleJobChange("ctc", e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Bond (years)</label>
                <input
                  type="number"
                  min={0}
                  value={job.bondInYrs}
                  onChange={(e) => handleJobChange("bondInYrs", e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Active backlogs acceptable?</label>
                <select
                  value={job.activeBacklogsAcceptable ? "yes" : "no"}
                  onChange={(e) =>
                    handleJobChange(
                      "activeBacklogsAcceptable",
                      e.target.value === "yes"
                    )
                  }
                  className="select w-full"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="label">Max failed subjects</label>
                <input
                  type="number"
                  min={0}
                  value={job.failedSubjects}
                  onChange={(e) =>
                    handleJobChange("failedSubjects", e.target.value)
                  }
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  Graduation years (comma separated)
                </label>
                <input
                  value={job.gradYear}
                  onChange={(e) => handleJobChange("gradYear", e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Responsibilities</label>
              <textarea
                value={job.responsibilities}
                onChange={(e) =>
                  handleJobChange("responsibilities", e.target.value)
                }
                className="textarea w-full"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="label">Requirements</label>
              <textarea
                value={job.requirements}
                onChange={(e) =>
                  handleJobChange("requirements", e.target.value)
                }
                className="textarea w-full"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={job.descriptionText}
                onChange={(e) =>
                  handleJobChange("descriptionText", e.target.value)
                }
                className="textarea w-full"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Description file URL</label>
                <input
                  value={job.descriptionFile}
                  onChange={(e) =>
                    handleJobChange("descriptionFile", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Link to JD PDF"
                  required
                />
              </div>
              <div>
                <label className="label">Web links (comma separated)</label>
                <input
                  value={job.webLinks}
                  onChange={(e) => handleJobChange("webLinks", e.target.value)}
                  className="input w-full"
                  placeholder="https://careers.company.com, https://...
                  "
                />
              </div>
              <div>
                <label className="label">Locations (comma separated)</label>
                <input
                  value={job.locationOptions}
                  onChange={(e) =>
                    handleJobChange("locationOptions", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Remote, Bangalore, Hyderabad"
                  required
                />
              </div>
              <div>
                <label className="label">CTC breakup (comma separated)</label>
                <input
                  value={job.ctcBreakup}
                  onChange={(e) =>
                    handleJobChange("ctcBreakup", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Base, Bonus, ESOP"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center gap-2">
              <RiMapPinLine className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Branch & CGPA</h2>
            </div>
            {Array.isArray(branches) && branches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {branches.map((branch) => (
                  <label
                    key={branch.code}
                    className="p-3 rounded border flex items-center justify-between"
                  >
                    <span className="font-medium">{branch.name}</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={branchesCgpa[branch.code] || ""}
                      onChange={(e) =>
                        setBranchesCgpa((prev) => ({
                          ...prev,
                          [branch.code]: e.target.value,
                        }))
                      }
                      className="input input-sm w-24"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-muted">No branches found.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiTimerLine className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Hiring Workflow</h2>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={addWorkflow}
              >
                <RiAddLine className="w-4 h-4" /> Add stage
              </button>
            </div>
            <div className="space-y-3">
              {workflowData.map((flow, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiBookOpenLine className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Stage {idx + 1}</span>
                    </div>
                    {workflowData.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeWorkflow(idx)}
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Title</label>
                      <input
                        className="input w-full"
                        value={flow.title}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "title", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Type</label>
                      <select
                        className="select w-full"
                        value={flow.type}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "type", e.target.value)
                        }
                      >
                        <option value="interview">Interview</option>
                        <option value="coding-round">Coding Round</option>
                        <option value="group-discussion">
                          Group Discussion
                        </option>
                        <option value="ppt">PPT/Presentation</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Start</label>
                      <input
                        type="datetime-local"
                        className="input w-full"
                        value={flow.date?.from || ""}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "date", {
                            ...flow.date,
                            from: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">End</label>
                      <input
                        type="datetime-local"
                        className="input w-full"
                        value={flow.date?.to || ""}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "date", {
                            ...flow.date,
                            to: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Venue</label>
                      <input
                        className="input w-full"
                        value={flow.venue || ""}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "venue", e.target.value)
                        }
                        placeholder="Online / Campus Hall"
                      />
                    </div>
                    <div>
                      <label className="label">Link (optional)</label>
                      <input
                        className="input w-full"
                        value={flow.link || ""}
                        onChange={(e) =>
                          handleWorkflowChange(idx, "link", e.target.value)
                        }
                        placeholder="Meeting link if online"
                      />
                    </div>
                    {flow.type === "interview" && (
                      <div>
                        <label className="label">Interview Type</label>
                        <select
                          className="select w-full"
                          value={flow.interviewType || "hr"}
                          onChange={(e) =>
                            handleWorkflowChange(
                              idx,
                              "interviewType",
                              e.target.value
                            )
                          }
                        >
                          <option value="technical">Technical</option>
                          <option value="hr">HR</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white/90 backdrop-blur p-4 rounded-lg shadow border">
            <Link to="/recruiter/jobs" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default JobCreate;
