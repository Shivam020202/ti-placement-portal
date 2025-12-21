import React from "react";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { Navigate } from "react-router-dom";
import { RiFileTextLine, RiInformationLine } from "react-icons/ri";
import ResumeManager from "@/components/student/ResumeManager";

const Resumes = () => {
  const auth = useRecoilValue(authState);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <RiFileTextLine className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Resumes</h1>
              <p className="opacity-90 mt-1">
                Manage your resumes for job applications
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <RiInformationLine className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Resume Management Tips
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>You can upload up to 3 resumes at a time</li>
              <li>Supported formats: PDF, DOC, DOCX (max 5MB each)</li>
              <li>
                Use clear, professional file names for easy identification
              </li>
              <li>
                Keep your resumes updated with your latest experience and skills
              </li>
            </ul>
          </div>
        </div>

        {/* Resume Manager Component */}
        <ResumeManager />

        {/* Additional Tips Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">
            Resume Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">📝</span>
              </div>
              <h4 className="font-medium text-dark mb-1">Tailor Your Resume</h4>
              <p className="text-sm text-muted">
                Customize your resume for each job application to highlight
                relevant skills and experience.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">✨</span>
              </div>
              <h4 className="font-medium text-dark mb-1">Keep It Concise</h4>
              <p className="text-sm text-muted">
                Aim for 1-2 pages. Recruiters spend an average of 7 seconds on
                initial resume screening.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">🎯</span>
              </div>
              <h4 className="font-medium text-dark mb-1">Use Keywords</h4>
              <p className="text-sm text-muted">
                Include industry-specific keywords from job descriptions to pass
                ATS screening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Resumes;
