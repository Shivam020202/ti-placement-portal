import React from "react";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axiosConfig";
import {
  RiUserLine,
  RiMailLine,
  RiCalendarLine,
  RiGraduationCapLine,
  RiBuilding4Line,
  RiAwardLine,
  RiStarLine,
  RiCheckDoubleLine,
  RiCloseLine,
  RiBriefcaseLine,
  RiBookLine,
} from "react-icons/ri";
import ResumeManager from "@/components/student/ResumeManager";

const Profile = () => {
  const auth = useRecoilValue(authState);

  // Fetch student skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["student-skills"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/student/skill`
      );
      return response.data || [];
    },
    enabled: !!auth.token,
  });

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

  const user = auth.user;
  const student = auth.role; // Student data is stored in role for students

  // Format date of birth
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Available";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get program name
  const getProgramName = (program) => {
    const programs = {
      ug: "Undergraduate (UG)",
      pg: "Postgraduate (PG)",
    };
    return programs[program?.toLowerCase()] || program || "Not Available";
  };

  // Get course name
  const getCourseName = (course) => {
    const courses = {
      btech: "B.Tech",
      be: "B.E.",
      mtech: "M.Tech",
      phd: "Ph.D",
    };
    return courses[course?.toLowerCase()] || course || "Not Available";
  };

  // Format score
  const formatScore = (score, scoreType) => {
    if (!score) return "Not Available";
    if (scoreType === "cgpa") {
      return `${score} CGPA`;
    }
    return `${score}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-4 ring-white/30">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                  )}&size=96&background=random&color=fff`
                }
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="opacity-90 flex items-center gap-2 mt-1">
                <RiMailLine className="w-4 h-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-4 mt-3">
                {student?.isPlaced && (
                  <span className="px-3 py-1 bg-green-400/20 text-green-100 text-sm rounded-full flex items-center gap-1">
                    <RiCheckDoubleLine className="w-4 h-4" />
                    Placed
                  </span>
                )}
                {student?.isSpr && (
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-100 text-sm rounded-full">
                    SPR
                  </span>
                )}
                {student?.isSic && (
                  <span className="px-3 py-1 bg-blue-400/20 text-blue-100 text-sm rounded-full">
                    SIC
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal & Academic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <RiUserLine className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm text-muted">Roll Number</label>
                    <p className="font-medium text-dark">
                      {student?.rollNumber || "Not Available"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted">Date of Birth</label>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <RiCalendarLine className="w-4 h-4 text-muted" />
                      {formatDate(student?.dateOfBirth)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted">Program</label>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <RiGraduationCapLine className="w-4 h-4 text-muted" />
                      {getProgramName(student?.program)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted">Course</label>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <RiBookLine className="w-4 h-4 text-muted" />
                      {getCourseName(student?.course)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted">Branch</label>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <RiBuilding4Line className="w-4 h-4 text-muted" />
                      {student?.branchCode || "Not Available"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted">
                      Graduation Year
                    </label>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <RiBriefcaseLine className="w-4 h-4 text-muted" />
                      {student?.gradYear || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <RiAwardLine className="w-5 h-5 text-primary" />
                  Academic Details
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CGPA Card */}
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RiStarLine className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted mb-1">Current CGPA</p>
                    <p className="text-2xl font-bold text-primary">
                      {student?.cgpa?.toFixed(2) || "N/A"}
                    </p>
                  </div>

                  {/* Subjects Failed Card */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      {student?.subjectsFailed > 0 ? (
                        <RiCloseLine className="w-6 h-6 text-red-500" />
                      ) : (
                        <RiCheckDoubleLine className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted mb-1">Backlogs</p>
                    <p
                      className={`text-2xl font-bold ${
                        student?.subjectsFailed > 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {student?.subjectsFailed ?? "N/A"}
                    </p>
                  </div>

                  {/* Graduation Year Card */}
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RiGraduationCapLine className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-muted mb-1">
                      Expected Graduation
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {student?.gradYear || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Educational Background */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-dark">
                    Educational Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Class 10 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-dark">
                          Class 10
                        </span>
                        <span className="text-sm text-primary font-medium">
                          {formatScore(
                            student?.class10Score,
                            student?.class10ScoreType
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Board: {student?.class10Board || "Not Available"}
                      </p>
                    </div>

                    {/* Class 12 */}
                    {student?.class12Score && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-dark">
                            Class 12
                          </span>
                          <span className="text-sm text-primary font-medium">
                            {formatScore(
                              student?.class12Score,
                              student?.class12ScoreType
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          Board: {student?.class12Board || "Not Available"}
                        </p>
                      </div>
                    )}

                    {/* Diploma */}
                    {student?.diplomaScore && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-dark">
                            Diploma
                          </span>
                          <span className="text-sm text-primary font-medium">
                            {formatScore(
                              student?.diplomaScore,
                              student?.diplomaScoreType
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          Graduation Year:{" "}
                          {student?.diplomaGradYear || "Not Available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills & Resume */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <RiStarLine className="w-5 h-5 text-primary" />
                  Skills
                </h2>
              </div>
              <div className="p-5">
                {skillsLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse h-8 bg-gray-200 rounded-full w-20"
                      ></div>
                    ))}
                  </div>
                ) : skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id || skill.name}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <RiStarLine className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-muted text-sm">No skills added yet</p>
                    <p className="text-xs text-muted mt-1">
                      Add skills to showcase your expertise
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Manager */}
            <ResumeManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
