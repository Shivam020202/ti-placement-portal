/* eslint-disable react/prop-types */
import { useState } from "react";
import StudentLoginForm from "./StudentLoginForm";
import RecruiterLoginForm from "./RecruiterLoginForm";

const Tab = () => {
  const [activeTab, setActiveTab] = useState("student");

  const TabButton = ({ label, value }) => (
    <button
      className={`relative w-1/2 py-3 text-sm font-semibold transition-all duration-300 ${
        activeTab === value
          ? "text-white font-semibold"
          : "hover:text-dark"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="relative w-full max-w-xs">
      <div className="flex bg-background p-1 rounded-lg h-12 items-center">
        <div
          className={`absolute top-1 left-1 w-1/2 h-10 bg-dark rounded-md transition-all duration-500 ease-in-out ${
            activeTab === "recruiter" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <TabButton label="Student/Admin" value="student" />
        <TabButton label="Recruiter" value="recruiter" />
      </div>
      
      <div>
        {activeTab === "student" ? <StudentLoginForm /> : <RecruiterLoginForm />}
      </div>
    </div>
  );
};

export default Tab;