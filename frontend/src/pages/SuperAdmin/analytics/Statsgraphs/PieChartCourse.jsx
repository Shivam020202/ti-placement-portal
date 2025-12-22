import React, { useMemo } from "react";
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts";
import { TbCertificate } from "react-icons/tb";
import { PLacementData } from "../PlacementData";
import PieChartBoxes from "./PieChartBoxes";

const chartConfig = {
  // Eligible: {
  //     label: "Eligible",
  //     color: "rgba(210, 20, 20, 1)",
  // },
  Placed: {
    label: "Placed",
    // color: "rgba(210, 20, 20, 1)",
    color: "rgba(187, 131, 119, 1)",
  },
  "Not Responded": {
    label: "Not Responded",
    color: "rgba(58, 0, 30, 1)",
  },
  Remaining: {
    label: "Remaining",
    color: "rgba(210, 20, 20, 1)",
    // color: "rgba(255, 229, 218, 1)",
  },
};

function PieChartCourse({ selectedCourse, setSelectedCourse, setIsLoading }) {
  const id = "pie-interactive";

  const activeData = useMemo(
    () => PLacementData.find((item) => item.course === selectedCourse).data,
    [selectedCourse]
  );

  const handleCourseChange = (course) => {
    setIsLoading(true);
    setSelectedCourse(course);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const totalStudents = useMemo(
    () =>
      PLacementData.find((item) => item.course === selectedCourse)
        .totalStudents,
    [selectedCourse]
  );

  const placedStudents = useMemo(
    () => activeData.find((item) => item.status === "Placed").students,
    [activeData]
  );

  // const eligibleStudents = useMemo(
  //     () => activeData.find((item) => item.status === "Eligible").students,
  //     [activeData]
  // );

  const offersCount = useMemo(
    () => PLacementData.find((item) => item.course === selectedCourse).offers,
    [selectedCourse]
  );

  return (
    <div className="flex flex-col shadow-lg w-full bg-white rounded-lg p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="font-bold flex items-center">
          <TbCertificate />
          <span className="ml-2">Course</span>
        </div>
        <select
          className="select select-bordered select-sm"
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          {PLacementData.map((item) => (
            <option key={item.course} value={item.course}>
              {item.course}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 items-center justify-center pb-0">
        <div className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart width={300} height={300}>
            <Pie
              data={activeData}
              dataKey="students"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="ml-2">
          {Object.keys(chartConfig).map((key) => (
            <div key={key} className="flex items-center mb-1">
              <span
                className="min-w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: chartConfig[key].color }}
              />
              <span>{chartConfig[key].label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center w-full">
        <div className="flex md:space-x-6 max-md:space-x-4 flex-row justify-around m-6">
          <PieChartBoxes value={totalStudents} heading="Total" />
          <PieChartBoxes value={placedStudents} heading="Placed" />
          <PieChartBoxes value={offersCount} heading="Offers" />
        </div>
      </div>
    </div>
  );
}

export default PieChartCourse;
