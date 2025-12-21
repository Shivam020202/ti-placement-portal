import React from "react";
import { FaRupeeSign } from "react-icons/fa";

const CTCBox = ({ title, value }) => {
  return (
    <div className="p-4 rounded-md border shadow-lg text-center flex-1 bg-gray-50">
      <h3
        className="font-semibold text-md mb-2"
        style={{ color: "rgba(68, 67, 67, 1)" }}
      >
        {title}
      </h3>
      <p className="flex justify-center items-center text-xl">
        <FaRupeeSign
          className="mr-1"
          style={{ color: "rgba(68, 67, 67, 1)" }}
        />{" "}
        {value}
      </p>
    </div>
  );
};

export default CTCBox;
