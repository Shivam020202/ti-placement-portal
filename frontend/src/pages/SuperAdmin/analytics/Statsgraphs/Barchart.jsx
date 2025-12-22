import React, { useState } from "react";
import { PLacementData } from "../PlacementData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label bg-red-300 px-4 py-1 rounded">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

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

export default function BarGraph({ course, handleCourseChange }) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const chartData = PLacementData.find((data) => data.course === course).branchData.map((data) => ({
    branch: data.branch,
    students: data.data.find((d) => d.status === "Placed").students,
    fill: "rgba(217, 217, 217, 1)"
  }));

  // Determine the maximum number of students for coloring the tallest bar
  const maxStudents = Math.max(...chartData.map(data => data.students));

  const chartConfig = {
    students: {
      label: "Students",
    },
    ...PLacementData.find((data) => data.course === course).branchData.reduce((acc, data) => {
      const isMax = data.data.find((d) => d.status === "Placed").students === maxStudents;
      acc[data.branch] = {
        label: data.branch,
        color: isMax ? "rgba(217, 217, 217, 1)" : "rgba(215, 7, 7, 1)",
      };
      return acc;
    }, {}),
  };

  return (
    <div className="h-full w-full rounded-lg bg-white shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-800 font-bold text-lg">
          Student Placement Statistics
        </div>
        <select
          className="select select-bordered select-sm"
          value={course}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          {PLacementData.map((item) => (
            <option key={item.course} value={item.course}>
              {item.course}
            </option>
          ))}
        </select>
      </div>
      <div className="max-md:p-2 h-full">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" tick={<CustomAxisTick dy={16} />} interval={0} />
            <YAxis tick={<CustomAxisTick dy={4} dx={-15} />} />
            <Tooltip />
            <Bar
              dataKey="students"
              shape={({ x, y, width, height, fill, payload, index }) => (
                <CustomBar
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={"rgba(215, 7, 7, 1)"}
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
    </div>
  );
};
