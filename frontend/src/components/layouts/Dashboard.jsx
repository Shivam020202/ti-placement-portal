import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { CiSearch } from "react-icons/ci";
import { IoIosAddCircle } from "react-icons/io";
import DraftModal from "../ui/DraftModal";

const Dashboard = ({ children }) => {
  const auth = useRecoilValue(authState);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

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

  const handleLogout = () => {
    // Add your logout logic here
  };

  const getSearchPlaceholder = () => {
    if (location.pathname.includes('team-members')) {
      return 'Search team members...';
    }
    if (location.pathname.includes('job-listings')) {
      return 'Search job listings...';
    }
    if (location.pathname.includes('companies')) {
      return 'Search companies...';
    }
    return 'Search...';
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (location.pathname.includes('team-members')) {
      window.dispatchEvent(new CustomEvent('searchTeamMembers', { 
        detail: { searchTerm: term } 
      }));
    } else if (location.pathname.includes('job-listings')) {
      window.dispatchEvent(new CustomEvent('searchJobs', { 
        detail: { searchTerm: term } 
      }));
    } else if (location.pathname.includes('companies')) {
      window.dispatchEvent(new CustomEvent('searchCompanies', { 
        detail: { searchTerm: term } 
      }));
    }
  };

  return (
    <div className="flex gap-14 w-full h-full">
      <Sidebar />
      <main className="flex flex-col gap-10 w-full mr-16">
        <div className="mt-5 w-full flex items-center justify-between gap-10">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Hi, {auth.user.fullName}</h1>
            <p className="text-muted">
              Let's take a look at your activity today
            </p>
          </div>
          <label className="input flex h-14 items-center gap-2 rounded-full">
            <CiSearch size={24} className="text-muted" />
            <input
              type="text"
              className="grow text-muted text-md font-medium"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </label>
          {auth.user.role === "super-admin" ? (
            <button 
              onClick={() => setShowDraftModal(true)} 
              className="flex items-center p-4 gap-2 h-14 hover:bg-dark rounded-full bg-primary text-white"
            >
              <IoIosAddCircle size={24} />
              <p>Create New Listings</p>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center font-medium w-36 h-14 hover:bg-red rounded-full bg-dark text-white"
            >
              <p>Logout</p>
            </button>
          )}
        </div>
        {children}
        <DraftModal 
          isOpen={showDraftModal}
          onClose={() => setShowDraftModal(false)}
        />
      </main>
    </div>
  );
};

export default Dashboard;
