import React from "react";
import DashboardLayout from "@/components/layouts/Dashboard";
import JobListingForm from "@/components/forms/JobListingForm";

const CreateJob = () => {

  return (
    <DashboardLayout>
      <div className="h-[80vh]">
        <JobListingForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
