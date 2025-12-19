/* eslint-disable react/prop-types */
import { useState } from "react";
import StudentLoginForm from "./StudentLoginForm";
import RecruiterLoginForm from "./RecruiterLoginForm";
import AdminLoginForm from "./AdminLoginForm";

const Tab = () => {
  const [activeTab, setActiveTab] = useState("student");

  const TabButton = ({ label, value }) => (
    <button
      className={`relative w-1/3 py-3 text-sm font-semibold transition-all duration-300 z-10 ${
        activeTab === value ? "text-white font-semibold" : "hover:text-dark"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {label}
    </button>
  );

  const getTranslateClass = () => {
    switch (activeTab) {
      case "student":
        return "translate-x-0";
      case "recruiter":
        return "translate-x-full";
      case "admin":
        return "translate-x-[200%]";
      default:
        return "translate-x-0";
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex bg-background p-1 rounded-lg h-12 items-center relative">
        <div
          className={`absolute top-1 left-1 w-[calc(33.33%-0.5rem)] h-10 bg-dark rounded-md transition-all duration-500 ease-in-out ${getTranslateClass()}`}
        />
        <TabButton label="Student" value="student" />
        <TabButton label="Recruiter" value="recruiter" />
        <TabButton label="Admin" value="admin" />
      </div>

      <div>
        {activeTab === "student" && <StudentLoginForm />}
        {activeTab === "recruiter" && <RecruiterLoginForm />}
        {activeTab === "admin" && <AdminLoginForm />}
      </div>
    </div>
  );
};

export default Tab;
