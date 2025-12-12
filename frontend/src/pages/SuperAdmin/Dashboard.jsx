import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/Dashboard";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atoms/authAtom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  RiBuilding2Line,
  RiMapPinLine,
  RiTimeLine,
  RiUser3Line,
} from "react-icons/ri";

const mockPendingJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: { name: "Google", logo: "frontend\src\assets\googl.webp" },
    locationOptions: ["Bangalore", "Hyderabad"],
    createdAt: new Date(),
    type: "Full Time",
    mode: "Remote",
    batch: "2024",
  },
  {
    id: 2,
    title: "Software Engineer",
    company: { name: "Google", logo: "frontend\src\assets\googl.webp" },
    locationOptions: ["Bangalore", "Hyderabad"],
    createdAt: new Date(),
    type: "Full Time",
    mode: "Remote",
    batch: "2024",
  },
];

const mockActiveJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: { name: "Microsoft", logo: "/company-logos/microsoft.png" },
    locationOptions: ["Mumbai", "Pune"],
    createdAt: new Date(),
    type: "Internship",
    mode: "Hybrid",
    batch: "2025",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: { name: "Microsoft", logo: "/company-logos/microsoft.png" },
    locationOptions: ["Mumbai", "Pune"],
    createdAt: new Date(),
    type: "Internship",
    mode: "Hybrid",
    batch: "2025",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: { name: "Microsoft", logo: "/company-logos/microsoft.png" },
    locationOptions: ["Mumbai", "Pune"],
    createdAt: new Date(),
    type: "Internship",
    mode: "Hybrid",
    batch: "2025",
  },
];

const mockBranchStats = {
  CSE: {
    totalPlaced: 150,
    placementRate: 85,
    totalCompanies: 25,
  },
  IT: {
    totalPlaced: 120,
    placementRate: 80,
    totalCompanies: 20,
  },
};

const Dashboard = () => {
  const auth = useRecoilValue(authState);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [date, setDate] = useState(new Date());

  const { data: assignedJobs = mockPendingJobs } = useQuery({
    queryKey: ["assigned-jobs"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/job/job-page`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        return response.data?.inactiveJobs || mockPendingJobs;
      } catch (error) {
        console.error("Error fetching assigned jobs:", error);
        return mockPendingJobs;
      }
    },
  });

  const { data: branchStats = mockBranchStats[selectedBranch] } = useQuery({
    queryKey: ["branch-stats", selectedBranch],
    enabled: !!selectedBranch,
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_URI
          }/super-admin/branch/${selectedBranch}/stats`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        return response.data || mockBranchStats[selectedBranch];
      } catch (error) {
        console.error("Error fetching branch stats:", error);
        return mockBranchStats[selectedBranch];
      }
    },
  });

  return (
    <DashboardLayout>
      <div className="flex h-[80vh] gap-6">
        <div className="flex flex-col h-full gap-6 w-[70%]">
          {/* Pending Requests Card - Taller */}
          <div className="bg-white rounded-xl p-6 h-[45%] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Listing Requests</h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="space-y-3 pr-2">
                {assignedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>

          {/* Active Listings Card - Shorter */}
          <div className="bg-white rounded-xl p-6 h-[51.5%] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Active Listings</h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="space-y-3 pr-2">
                {mockActiveJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col h-full w-[30%] gap-6">
          {/* Calendar Card - Taller */}
          <div className="rounded-xl overflow-hidden h-[55%] bg-dark">
            <div className="calendar h-full flex flex-col">
              <div className="calendar-header bg-dark text-white py-2 text-center flex-shrink-0">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <CalendarGrid date={date} setDate={setDate} />
            </div>
          </div>

          {/* Branch Stats Card - Shorter */}
          <div className="rounded-xl h-[45%]">
            <div className="flex pl-4 pr-1 py-1 rounded-xl justify-between bg-white w-[full] items-center mb-4">
              <h2 className="text-md">Branch Statistics</h2>
              <BranchSelector
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
              />
            </div>
            <BranchStats stats={branchStats} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper Components
const JobCard = ({ job }) => (
  <div className="bg-background p-4 rounded-lg mb-3 cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <img
        src={job.company?.logo}
        alt={job.company?.name}
        className="w-12 h-12 rounded-lg object-contain"
      />
      <div>
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <div className="text-sm text-muted flex items-center gap-4">
          <span className="flex items-center gap-1">
            <RiBuilding2Line /> {job.company?.name}
          </span>
          <span className="flex items-center gap-1">
            <RiMapPinLine /> {job.locationOptions?.join(", ")}
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine /> {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <span className="badge badge-ghost">{job.type}</span>
          <span className="badge badge-ghost">{job.mode}</span>
          <span className="badge badge-ghost">{job.batch}</span>
        </div>
      </div>
    </div>
  </div>
);

const CalendarGrid = ({ date, setDate }) => {
  // Get first day of month and days in month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  // Create calendar days array
  let days = [];
  let day = 1;

  for (let i = 0; i < 42; i++) {
    if (i < startingDay || day > daysInMonth) {
      days.push(null);
    } else {
      days.push(day);
      day++;
    }
  }

  return (
    <div className="bg-dark text-white rounded-b-xl h-[calc(100%-2.5rem)] p-2">
      <div className="grid grid-cols-7 gap-1 h-full">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div 
            key={day} 
            className="text-red text-center text-xs font-medium h-6 flex items-center justify-center"
          >
            {day.slice(0,1)}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((dayNum, i) => {
          if (!dayNum) {
            return (
              <div 
                key={i} 
                className="h-6 flex items-center justify-center text-xs"
              />
            );
          }

          const currentDate = new Date(date.getFullYear(), date.getMonth(), dayNum);
          const isToday = currentDate.toDateString() === new Date().toDateString();
          const isSelected = currentDate.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              onClick={() => setDate(currentDate)}
              className={`
                h-6 w-6 mx-auto flex items-center justify-center rounded-full text-xs
                transition-colors duration-200
                ${isToday ? 'bg-red text-white hover:bg-red/90' : 'hover:bg-muted'}
                ${isSelected && !isToday ? 'border border-red' : ''}
              `}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BranchSelector = ({ selectedBranch, setSelectedBranch }) => (
  <select
    className="select select-bordered w-54"
    value={selectedBranch}
    onChange={(e) => setSelectedBranch(e.target.value)}
  >
    <option value="">Select Branch</option>
    <option value="CSE">Computer Science</option>
    <option value="IT">Information Technology</option>
  </select>
);

const BranchStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalPlaced || 0}</div>
      <div className="stat-title">Total Students</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalCompanies || 0}</div>
      <div className="stat-title">Placed Students</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.placementRate || 0}%</div>
      <div className="stat-title">Placement Rate</div>
    </div>
    <div className="stat bg-white flex flex-col items-center rounded-lg p-4">
      <div className="stat-value">{stats?.totalCompanies || 0}</div>
      <div className="stat-title">Companies</div>
    </div>
  </div>
);

export default Dashboard;
