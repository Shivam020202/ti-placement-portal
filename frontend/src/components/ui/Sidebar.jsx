import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import {
  RiDashboardFill,
  RiAdminFill,
  RiBriefcaseFill,
  RiTeamFill,
  RiFileListFill,
  RiFileUserFill,
  RiFileTextFill,
} from "react-icons/ri";
import { ImOffice } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BiSolidSchool } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { assets } from "../../assets/assets";
import { resolveAvatarSync } from "@/utils/avatarHelper";

const menuConfigs = {
  "super-admin": [
    {
      id: "dashboard",
      icon: <RiDashboardFill size={24} />,
      label: "Dashboard",
      path: "/super-admin/dashboard",
    },
    {
      id: "jobs",
      icon: <RiBriefcaseFill size={24} />,
      label: "Job Listings",
      path: "/super-admin/job-listings",
    },
    {
      id: "applications",
      icon: <RiFileListFill size={24} />,
      label: "Applications",
      path: "/super-admin/applications",
    },
    {
      id: "team-members",
      icon: <RiTeamFill size={24} />,
      label: "Team Members",
      path: "/super-admin/team-members",
    },
    {
      id: "analytics",
      icon: <RiFileListFill size={24} />,
      label: "Analytics",
      path: "/super-admin/analytics",
    },
    {
      id: "companies",
      icon: <ImOffice size={24} />,
      label: "Company",
      path: "/super-admin/companies",
    },
  ],
  student: [
    {
      id: "dashboard",
      icon: <RiDashboardFill size={24} />,
      label: "Dashboard",
      path: "/student/dashboard",
    },
    {
      id: "jobs",
      icon: <RiBriefcaseFill size={24} />,
      label: "Job Listings",
      path: "/student/jobs",
    },
    {
      id: "applications",
      icon: <RiFileListFill size={24} />,
      label: "My Applications",
      path: "/student/applications",
    },
    {
      id: "resumes",
      icon: <RiFileTextFill size={24} />,
      label: "My Resumes",
      path: "/student/resumes",
    },
    {
      id: "profile",
      icon: <RiFileUserFill size={24} />,
      label: "Profile",
      path: "/student/profile",
    },
  ],
  recruiter: [
    {
      id: "dashboard",
      icon: <RiDashboardFill size={24} />,
      label: "Dashboard",
      path: "/recruiter/dashboard",
    },
    {
      id: "jobs",
      icon: <RiBriefcaseFill size={24} />,
      label: "Job Listings",
      path: "/recruiter/jobs",
    },
    {
      id: "applications",
      icon: <RiFileListFill size={24} />,
      label: "Applications",
      path: "/recruiter/applications",
    },
    {
      id: "profile",
      icon: <RiFileUserFill size={24} />,
      label: "Profile",
      path: "/recruiter/profile",
    },
  ],
};

const Sidebar = () => {
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const location = useLocation();
  const isAnalyticsPage = location.pathname.includes("analytics");
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    const currentMenu = menuConfigs[auth.user?.role || "admin"];
    return currentMenu.find((item) => item.path === path)?.id || "dashboard";
  });

  const menuItems = menuConfigs[auth.user?.role || "admin"];

  const handleLogout = async () => {
    try {
      setAuth({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const avatarSrc = resolveAvatarSync(
    auth.user?.email,
    auth.user?.fullName,
    auth.user?.photoURL || assets.profileimg
  );

  return (
    <div className="h-full z-100">
      <div
        className={`flex flex-col gap-10 items-center h-full ml-10 mt-4 ${
          isAnalyticsPage ? "bg-white" : "bg-background"
        }`}
      >
        <div className="mb-14">
          <img src={assets.logo} alt="Logo" />
        </div>
        <nav className="flex flex-col items-center gap-2 justify-center max-h-fit min-w-16 rounded-full bg-white mb-14">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center p-5 rounded-full hover:bg-muted hover:text-white group relative
                                ${
                                  activeItem === item.id
                                    ? "bg-dark text-red"
                                    : ""
                                }`}
              onClick={() => setActiveItem(item.id)}
            >
              <span>{item.icon}</span>
              <span
                className="absolute left-20 text-nowrap bg-dark text-white px-2 py-1 rounded-md opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="bg-white mt-12 flex flex-col rounded-full items-center gap-2">
          <button
            className="p-5 group relative flex items-center hover:bg-dark hover:text-red rounded-full transition-colors"
            onClick={handleLogout}
          >
            <IoMdLogOut size={24} />
            <span className="absolute left-20 text-nowrap bg-dark text-white px-2 py-1 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              Logout
            </span>
          </button>
          <img
            className="w-16 rounded-full"
            src={avatarSrc}
            alt="Profile"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
