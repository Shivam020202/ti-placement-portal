import { RiBuildingLine } from "react-icons/ri";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-48 h-48 mb-8 relative">
        {/* Background circle with animation */}
        <div className="absolute inset-0 bg-red/5 rounded-full animate-pulse"></div>
        
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <RiBuildingLine className="w-24 h-24 text-red/40" />
        </div>
      </div>

      <h3 className="text-xl font-medium text-dark mb-2">
        No companies yet
      </h3>
      <p className="text-base-content/60 text-center max-w-sm">
        Get started by adding your first company. Click the "Add Company" button above.
      </p>
    </div>
  );
};

export default EmptyState;