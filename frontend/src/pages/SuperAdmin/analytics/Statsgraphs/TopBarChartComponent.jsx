import React, { useEffect, useState } from "react";
import { PLacementData } from "../PlacementData";
import TopBarChartBoxes from "./TopBarChartBoxes";
import BarGraph from "./Barchart";

export default function TopBarChartComponent() {

  const [course, setCourse] = useState(PLacementData[0].course);
  const [totalStudentsInCourse, setTotalStudentsInCourse] = useState(0);
  const [totalPlacedStudentsInCourse, setTotalPlacedStudentsInCourse] =
    useState(0);
  const [placementPercentage, setPlacementPercentage] = useState(0);


  useEffect(() => {
    const courseData = PLacementData.find((data) => data.course === course);
    const totalStudents = courseData.totalStudents;
    const totalPlacedStudents = courseData.data.find(
      (data) => data.status === "Placed"
    ).students;
    const percentage = (totalPlacedStudents / totalStudents) * 100;
    setTotalStudentsInCourse(totalStudents);
    setTotalPlacedStudentsInCourse(totalPlacedStudents);
    setPlacementPercentage(percentage.toPrecision(2));
  }, [course]);


  const handleCourseChange = (course) => {
    setCourse(course);
  };

  const topBoxesData = [
    {
      value: totalStudentsInCourse,
      heading: "Total Students",
    },
    {
      value: totalPlacedStudentsInCourse,
      heading: "Placed",
    },
    {
      value: `${placementPercentage} %`,
      heading: "Placement %"
    },
  ];

  return (
    <div className="flex gap-3 w-full overflow-hidden flex-col lg:flex-row">

      <div className="h-full w-full">
        <BarGraph course={course} handleCourseChange={handleCourseChange} />
      </div>
      <div className="flex flex-col md:h-[78vh]">
        <TopBoxes topBoxesData={topBoxesData} />
        <BranchWisePlacementInfo PLacementData={PLacementData} course={course} />
      </div>

    </div>
  );
};



function TopBoxes({ topBoxesData }) {

  return (
    <div className="flex justify-between mb-4 gap-2 bg-white px-4 py-2 rounded-md shadow-md">
      {topBoxesData.map((item, index) => (
        <TopBarChartBoxes
          key={index}
          heading={item.heading}
          value={item.value}
        />
      ))}
    </div>
  )
}

function BranchWisePlacementInfo({ PLacementData, course }) {

  return (
    <div className="flex flex-col gap-2 border-t overflow-auto pt-4 w-full">
      {PLacementData.find((data) => data.course === course).branchData.map(
        (item, index) => (
          <div
            key={index}
            className="flex text-lg py-3 px-4 rounded-lg justify-between hover:bg-slate-200 duration-150 bg-white shadow-md"
          >
            <p>{item.branch}</p>
            <p>
              {item.data.find((data) => data.status === "Placed").students}
            </p>
          </div>
        )
      )}
    </div>
  )
}
