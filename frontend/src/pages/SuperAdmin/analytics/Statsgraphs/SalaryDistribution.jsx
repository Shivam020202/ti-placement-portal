import { useEffect, useState } from "react";
import { PLacementData } from "../PlacementData";
import CTCBox from "./CTCBox";

const SalaryDistribution = () => {
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
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Salary Distribution</h2>
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
      <div className="mt-2 mb-8 rounded-md">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CTCBox title="Minimum CTC" value={minCTC} />
          <CTCBox title="Average CTC" value={avgCTC} />
          <CTCBox title="Maximum CTC" value={maxCTC} />
          <CTCBox title="Median CTC" value={medianCTC} />
        </div>
      </div>
    </>
  );
};

export default SalaryDistribution;
