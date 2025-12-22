import { useEffect, useState } from "react";
import { PLacementData as PlacementData, BranchUnderDepartment } from "../PlacementData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Rectangle,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomAxisTick = ({ x, y, payload, dy, dx }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={dy}
      dx={dx}
      textAnchor="middle"
      fill="#666"
      fontSize={12}
      transform="rotate(0)"
    >
      {payload.value}
    </text>
  </g>
);


const CustomBar = ({ x, y, width, height, fill, payload, active }) => {
  const stroke = active ? payload.fill : "transparent";
  const fillOpacity = active ? 0.8 : 1;
  const strokeDasharray = active ? 4 : 0;
  const strokeDashoffset = active ? 4 : 0;

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={[12, 12, 12, 12]}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
    />
  );
};

export default function DepartmentWisePlacements() {
  const [course, setCourse] = useState(PlacementData[0].course);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const courseData = PlacementData.find((data) => data.course === course);
    const totalStudents = courseData.totalStudents;
    const totalPlacedStudents = courseData.data.find(
      (data) => data.status === "Placed"
    )?.students || 0; // Fallback to 0 if undefined
    const percentage = (totalPlacedStudents / totalStudents) * 100;
  }, [course]);

  const handleCourseChange = (course) => {
    setCourse(course);

    setDepartments(
      BranchUnderDepartment.filter(
        (item) => item.course === course
      )[0].departmentData.map((item) => item.department)
    );
    setDepartment(
      BranchUnderDepartment.filter(
        (item) => item.course === course
      )[0].departmentData.map((item) => item.department)[0]
    );
  };

  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const handleDepartmentChange = (course) => {
    setDepartment(course);
  };

  useEffect(() => {
    setDepartments(
      BranchUnderDepartment.filter(
        (item) => item.course === course
      )[0].departmentData.map((item) => item.department)
    );
    setDepartment(
      BranchUnderDepartment.filter(
        (item) => item.course === course
      )[0].departmentData.map((item) => item.department)[0]
    );

  }, [course]);

  useEffect(() => {
    if (department !== "") {
      setBranches(
        BranchUnderDepartment.filter((item) => item.course === course)[0]
          .departmentData.filter((item) => item.department === department)[0]
          .branches.map((item) => item.branch)
      );
    } else {
      setBranches(
        BranchUnderDepartment.filter(
          (item) => item.course === course
        )[0].departmentData[0].branches.map((item) => item.branch)
      );
    }
    console.log(branches)
  }, [department, course]);

  const chartData = PlacementData.find(
    (data) => data.course === course
  ).branchData.filter(i => branches.includes(i.branch)).map((data) => ({
    branch: data.branch,
    placed: data.data.find((d) => d.status === "Placed")?.students || 0,
    remaining: data.data.find((d) => d.status === "Remaining")?.students || 0,
    notResponded: data.data.find((d) => d.status === "Not Responded")?.students || 0,
    fill: "rgba(217, 217, 217, 1)",
  }));

  // Determine the maximum number of students for coloring the tallest bar
  const maxStudents = Math.max(...chartData.map((data) => data.placed));

  const chartConfig = {
    placed: {
      label: "Placed Students",
    },
    remaining: {
      label: "Remaining Students",
    },
    notResponded: {
      label: "Not Responded",
    },
    ...PlacementData.find((data) => data.course === course).branchData.reduce(
      (acc, data) => {
        const isMax =
          data.data.find((d) => d.status === "Placed")?.students === maxStudents;
        acc[data.branch] = {
          label: data.branch,
          color: isMax ? "rgba(217, 217, 217, 1)" : "rgba(215, 7, 7, 1)",
        };
        return acc;
      },
      {}
    ),
  };

  return (
    <>
      <div className="h-full w-full rounded-lg bg-white shadow p-4">
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-4 mb-4">
          <h1 className="text-2xl max-md:text-lg font-semibold">
            Department Wise Placement Statistics
          </h1>
          <select
            className="select select-bordered select-sm"
            value={course}
            onChange={(e) => handleCourseChange(e.target.value)}
          >
            {BranchUnderDepartment.map((item) => (
              <option key={item.course} value={item.course}>
                {item.course}
              </option>
            ))}
          </select>
        </div>

        <div className="max-md:p-2 flex w-full max-md:flex-col gap-4">
          <div className="w-full max-md:min-h-80">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="branch"
                  tick={<CustomAxisTick dy={16} />}
                  interval={0}
                />
                <YAxis tick={<CustomAxisTick dy={4} dx={-15} />} />
                <Tooltip />
                <Bar
                  dataKey="notResponded"
                  shape={({ x, y, width, height, fill, payload, index }) => (
                    <CustomBar
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={"#9BCE73"}
                      payload={payload}
                      active={index === hoveredBarIndex}
                    />
                  )}
                  onMouseEnter={(data, index) => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                />
                <Bar
                  dataKey="placed"
                  shape={({ x, y, width, height, fill, payload, index }) => (
                    <CustomBar
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={"rgba(187, 131, 119, 1)"}
                      payload={payload}
                      active={index === hoveredBarIndex}
                    />
                  )}
                  onMouseEnter={(data, index) => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                />
                <Bar
                  dataKey="remaining"
                  shape={({ x, y, width, height, fill, payload, index }) => (
                    <CustomBar
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={"#615656"}
                      payload={payload}
                      active={index === hoveredBarIndex}
                    />
                  )}
                  onMouseEnter={(data, index) => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2">
            {departments.map((item) => (
              <button
                key={item}
                className={`px-4 py-2 rounded-lg text-left transition-colors ${
                  department === item
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleDepartmentChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
