import React, { useState, useMemo, useEffect } from "react";
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts";
import { PiBooksFill } from "react-icons/pi";
import { PLacementData } from "../PlacementData";
import PieChartBoxes from "./PieChartBoxes";

const chartConfig = {
    // Eligible: {
    //     label: "Eligible",
    //     color: "rgba(210, 20, 20, 1)",
    // },
    Placed: {
        label: "Placed",
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

function PieChartBranch({ selectedCourse, isLoading }) {
    const id = "pie-interactive";

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

    useEffect(() => {
        const courseData = PLacementData.find((item) => item.course === selectedCourse);
        if (courseData) {
            setBranches(courseData.branchData.map((item) => item.branch));
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (branches.length > 0) {
            setSelectedBranch(branches[0]);
        }
    }, [branches]);

    const activeData = useMemo(() => {
        const courseData = PLacementData.find((item) => item.course === selectedCourse);
        if (courseData) {
            return courseData.branchData.find((item) => item.branch === selectedBranch);
        }
        return null;
    }, [selectedCourse, selectedBranch]);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
    };

    if (!activeData) {
        return null;
    }

    const totalStudents = activeData.totalStudents;
    const placedStudents = activeData.data.find((item) => item.status === "Placed")?.students || 0;
    // const eligibleStudents = activeData.data.find((item) => item.status === "Eligible")?.students || 0;
    const offersCount = activeData.offers;


    return (
        <div className="flex flex-col shadow-lg w-full bg-white rounded-lg p-4">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="font-bold flex items-center">
                    <PiBooksFill />
                    <span className="ml-2">Branch</span>
                </div>
                <select
                    className="select select-bordered select-sm"
                    value={selectedBranch}
                    onChange={(e) => handleBranchChange(e.target.value)}
                >
                    {branches.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            {!isLoading ? (
                <div className="flex flex-1 items-center justify-center pb-0">
                    <div className="mx-auto aspect-square w-full max-w-[300px]">
                        <PieChart width={300} height={300}>
                            <Pie
                                data={activeData.data}
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
                                    className=" min-w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: chartConfig[key].color }}
                                />
                                <span>{chartConfig[key].label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <span>Loading...</span>
                </div>
            )}
            <div className="text-center w-full">
                <div className="flex md:space-x-6 max-md:space-x-4 flex-row justify-around m-6">
                    <PieChartBoxes value={isLoading ? 0 : totalStudents} heading="Total" />
                    <PieChartBoxes
                        value={isLoading ? 0 : placedStudents}
                        heading="Placed"
                    />
                    <PieChartBoxes value={isLoading ? 0 : offersCount} heading="Offers" />
                </div>
            </div>
        </div>
    );
}

export default PieChartBranch;
