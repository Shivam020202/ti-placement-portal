import React from 'react'

const PieChartBoxes = ({value, heading}) => {
    return (
        <div className="bg-white w-1/3 border border-gray-300 p-2 rounded-xl text-black text-center shadow-xl" >
            <span className="block font-bold max-md:text-2xl md:text-3xl max-md:m-2 md:m-4">{value}</span>
            {heading}
        </div>
    )
}

export default PieChartBoxes