import React, { useState } from "react";
import PieChartBranch from "./PieChartBranch";
import PieChartCourse from "./PieChartCourse";
import { PLacementData } from "../PlacementData";

const PieChartsCombined = () => {
  const [selectedCourse, setSelectedCourse] = useState(PLacementData[0].course);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-black font-bold text-xl mb-2 ml-0">
        Placement Insights
      </p>

      <div className="flex justify-between flex-col md:flex-row gap-6 w-full">
        <PieChartCourse
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          setIsLoading={setIsLoading}
        />
        <PieChartBranch selectedCourse={selectedCourse} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PieChartsCombined;
