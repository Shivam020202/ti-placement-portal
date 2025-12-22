import React from "react";

const TopBarChartBoxes = ({ value, heading }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg justify-center items-center gap-2">
      <p className="md:text-base font-semibold text-gray-800 text-nowrap">{heading}</p>
      <p className="text-2xl text-center font-bold text-gray-900 text-nowrap">{value}</p>
    </div>
  );
};

export default TopBarChartBoxes;
