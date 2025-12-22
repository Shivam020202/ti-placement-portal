import React, { useEffect } from "react";
import DashboardLayout from "@/components/layouts/Dashboard";
import DepartmentWisePlacements from "./Statsgraphs/DepartmentWisePlacements";
import PieChartsCombined from "./Statsgraphs/PieChartsCombined";
import SalaryDistribution from "./Statsgraphs/SalaryDistribution";
import TopBarChartComponent from "./Statsgraphs/TopBarChartComponent";

const Graphs = () => {
  useEffect(() => {
    document.body.classList.add("bg-white");

    return () => {
      document.body.classList.remove("bg-white");
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="px-6 max-md:px-2 mt-6 flex flex-col gap-8">
        <TopBarChartComponent />
        <DepartmentWisePlacements />
        <PieChartsCombined />
        <SalaryDistribution />
      </div>
    </DashboardLayout>
  );
};

export default Graphs;
