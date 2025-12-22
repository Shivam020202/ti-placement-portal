"use client";

import React, { useEffect, useState } from "react";
import { PLacementData } from "../PlacementData";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CTCBox from "./CTCBox";
import { PiBooksFill } from "react-icons/pi";

// Define the chart data
const chartData = [
  { range: "0-2", count: 5 },
  { range: "3-5", count: 25 },
  { range: "6-8", count: 35 },
  { range: "9-11", count: 8 },
  { range: "12-14", count: 28 },
  { range: "15-17", count: 8 },
  { range: "18-20", count: 60 },
  { range: "21-23", count: 28 },
  { range: "24-26", count: 13 },
  { range: "27-29", count: 18 },
  { range: "30-32", count: 5 },
];

export function SalaryBarGraph() {

  const [course, setCourse] = useState(PLacementData[0].course);
  const [maxCTC, setMaxCTC] = useState(0);
  const [minCTC, setMinCTC] = useState(0);
  const [avgCTC, setAvgCTC] = useState(0);
  const [medianCTC, setMedianCTC] = useState(0);

  const handleCourseChange = (course) => {
    setCourse(course);
  };

  useEffect(() => {


    const calculateCTC = (course) => {
      const courseData = PLacementData.find((data) => data.course === course);
      setAvgCTC(courseData.avgCTC);
      setMaxCTC(courseData.maxCTC);
      setMinCTC(courseData.minCTC);
      setMedianCTC(courseData.medianCTC);
    };

    calculateCTC(course);

  }, [course]);



  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PiBooksFill />
          Salary Distribution
        </h2>
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
      <div className="mt-4 mb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CTCBox title="Minimum CTC" value={minCTC} />
          <CTCBox title="Average CTC" value={avgCTC} />
          <CTCBox title="Maximum CTC" value={maxCTC} />
          <CTCBox title="Median CTC" value={medianCTC} />
        </div>
      </div>
      <div className="flex flex-col max-w-screen-xl mx-auto">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              right: 30
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="range" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} />
            <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }} />
            <Bar
              dataKey="count"
              fill="#d21414"
              barSize={30}
              stroke="#ff0000"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalaryBarGraph;
