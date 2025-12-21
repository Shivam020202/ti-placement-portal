import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import BasicDetailsForm from "../job/forms/BasicDetailsForm";
import RequirementsForm from "../job/forms/RequirementsForm";
import EligibilityForm from "../job/forms/EligibilityForm";
import LocationCTCForm from "../job/forms/LocationCTCForm";
import HiringProcessForm from "../job/forms/HiringProcessForm";
import PreviewForm from "../job/forms/PreviewForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import { useRecoilState } from "recoil";
import { draftJobsState } from "@/store/atoms/jobFormAtom";

const INITIAL_DATA = {
  // Basic Info
  companyId: "",
  title: "",
  requirements: "",
  responsibilities: "",
  descriptionText: "",
  descriptionFile: null,
  webLinks: [],
  role: "",
  gradYear: [],

  // Eligibility
  failedSubjects: 0,
  activeBacklogsAcceptable: false,
  applicationDeadline: "",
  bondInYrs: 0,

  // Location & Work
  remoteWork: false,
  locationOptions: [],

  // Compensation
  ctc: 0,
  ctcBreakup: [],

  // Branch Requirements
  branchWiseMinCgpa: {},

  // Hiring Process
  workflowData: [],
};

// Add this helper function before getStepValidation
const calculateTotal = (ctcBreakup) => {
  return (
    ctcBreakup?.reduce(
      (sum, component) => sum + (parseFloat(component.amount) || 0),
      0
    ) || 0
  );
};

// Add step validation helpers
const getStepValidation = (step, formData) => {
  switch (step) {
    case 1:
      return {
        isValid: !!(
          formData.companyId &&
          formData.title &&
          formData.role &&
          formData.gradYear.length > 0
        ),
        requiredFields: [
          "Company",
          "Job Title",
          "Role Type",
          "Graduation Years",
        ],
      };
    case 2:
      return {
        isValid: !!(
          formData.requirements &&
          formData.responsibilities &&
          formData.descriptionText
        ),
        requiredFields: ["Description", "Requirements", "Responsibilities"],
      };
    case 3:
      return {
        isValid: !!(
          Object.keys(formData.branchWiseMinCgpa).length > 0 &&
          formData.applicationDeadline
        ),
        requiredFields: ["Branch CGPA Requirements", "Application Deadline"],
      };
    case 4: // Location & CTC step
      return {
        isValid: !!(
          formData.locationOptions?.length > 0 &&
          formData.ctc > 0 &&
          // Remove ctcBreakup validation since it's optional
          (!formData.ctcBreakup?.length ||
            Math.abs(formData.ctc - calculateTotal(formData.ctcBreakup)) < 0.01)
        ),
        requiredFields: ["Location Options", "CTC"],
      };
    case 5:
      return {
        isValid: !!(formData.workflowData.length > 0),
        requiredFields: ["Hiring Process Rounds"],
      };
    default:
      return { isValid: true, requiredFields: [] };
  }
};

const JobListingForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useRecoilState(draftJobsState);

  // Add states for step validation
  const [stepValidation, setStepValidation] = useState({
    isValid: false,
    requiredFields: [],
  });

  // Initialize react-hook-form
  const {
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: INITIAL_DATA,
  });

  const steps = [
    {
      id: 1,
      title: "Company & Role",
      description: "Basic job details",
      isComplete: false,
    },
    {
      id: 2,
      title: "Requirements",
      description: "Job requirements and responsibilities",
      isComplete: false,
    },
    {
      id: 3,
      title: "Eligibility",
      description: "CGPA and other criteria",
      isComplete: false,
    },
    {
      id: 4,
      title: "Location & CTC",
      description: "Work location and compensation",
      isComplete: false,
    },
    {
      id: 5,
      title: "Hiring Process",
      description: "Interview rounds and workflow",
      isComplete: false,
    },
    {
      id: 6,
      title: "Preview",
      description: "Review all details",
      isComplete: false,
    },
  ];

  // Restore draft if available
  useEffect(() => {
    const { state } = location;
    if (state?.draft) {
      setFormData(state.draft.formData);
      setCurrentStep(state.draft.currentStep);
      Toast.success("Draft restored");
    }
  }, [location]);

  // Update auto-save functionality
  useEffect(() => {
    const saveFormData = async () => {
      if (!formData.title && !formData.companyId) return;

      setIsSaving(true);
      try {
        const validation = getStepValidation(currentStep, formData);
        const draftId = formData.draftId || `draft_${Date.now()}`;

        const draftData = {
          id: draftId,
          draftId, // Keep consistent ID
          title: formData.title || "Untitled Job",
          formData: {
            ...formData,
            draftId, // Store draft ID in form data
          },
          currentStep,
          lastSaved: new Date().toISOString(),
          progress: calculateProgress(formData),
          stepsCompleted: steps.map((step) => ({
            id: step.id,
            isComplete: getStepValidation(step.id, formData).isValid,
          })),
        };

        // Update drafts in Recoil state
        const existingDraftIndex = drafts.findIndex(
          (d) =>
            d.draftId === draftId || d.formData.companyId === formData.companyId
        );

        if (existingDraftIndex !== -1) {
          const updatedDrafts = [...drafts];
          updatedDrafts[existingDraftIndex] = draftData;
          setDrafts(updatedDrafts);
        } else {
          setDrafts((prev) => [...prev, draftData]);
        }

        localStorage.setItem("jobDrafts", JSON.stringify(drafts));
        setStepValidation(validation);
      } catch (error) {
        Toast.error("Failed to save draft");
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(saveFormData, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep]);

  // Calculate form completion progress
  const calculateProgress = (data) => {
    const requiredFields = [
      "title",
      "companyId",
      "requirements",
      "responsibilities",
      "role",
      "gradYear",
      "locationOptions",
      "ctc",
    ];

    const completedFields = requiredFields.filter((field) => {
      const value = data[field];
      return (
        value &&
        (Array.isArray(value)
          ? value.length > 0
          : typeof value === "string"
          ? value.trim() !== ""
          : true)
      );
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Create job listing mutation
  const createJobMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        // First validate all required fields
        if (!formData.companyId || !formData.title || !formData.role) {
          throw new Error("Please fill all required basic details");
        }

        if (!formData.applicationDeadline) {
          throw new Error("Application deadline is required");
        }

        // Format the application deadline
        let applicationDeadline;
        try {
          applicationDeadline = new Date(
            formData.applicationDeadline
          ).toISOString();
        } catch (error) {
          throw new Error("Invalid application deadline format");
        }

        const payload = {
          companyId: formData.companyId,
          jobListingData: {
            title: formData.title.trim(),
            requirements: formData.requirements,
            responsibilities: formData.responsibilities,
            descriptionText: formData.descriptionText,
            descriptionFile: formData.descriptionFile || "",
            webLinks: formData.webLinks || [],
            role: formData.role,
            gradYear: formData.gradYear || [],
            failedSubjects: parseInt(formData.failedSubjects) || 0,
            activeBacklogsAcceptable: Boolean(
              formData.activeBacklogsAcceptable
            ),
            applicationDeadline: applicationDeadline,
            bondInYrs: parseInt(formData.bondInYrs) || 0,
            remoteWork: Boolean(formData.remoteWork),
            locationOptions: formData.locationOptions || [],
            ctc: parseFloat(formData.ctc) || 0,
            ctcBreakup: formData.ctcBreakup || [],
            workflowData: formData.workflowData || [],
          },
          branchWiseMinCgpa: formData.branchWiseMinCgpa || {},
        };

        console.log("Submitting job data:", payload);

        const response = await axios.post(
          `${import.meta.env.VITE_URI}/super-admin/job/create`,
          payload,
          {
            headers: {
              Authorization: auth.token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Job creation response:", response);

        if (!response.data) {
          throw new Error("No response received from server");
        }

        return response.data;
      } catch (error) {
        console.error("Job creation error:", {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
          data: formData,
        });
        throw error; // Throw the original error to preserve the message
      }
    },
    onSuccess: (data) => {
      Toast.success("Job listing created successfully");
      queryClient.invalidateQueries(["job-listings"]);
      navigate("/super-admin/job-listings");
    },
    onError: (error) => {
      Toast.error(error.message || "Failed to create job listing");
    },
  });

  const onSubmit = async (data) => {
    try {
      // Validate form data before submitting
      const validation = getStepValidation(currentStep, formData);
      if (!validation.isValid) {
        Toast.error(`Please complete: ${validation.requiredFields.join(", ")}`);
        return;
      }

      console.log("Submitting form data:", formData); // Use formData instead of data
      await createJobMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Update step click handler
  const handleStepClick = async (e, stepId) => {
    e.preventDefault();

    // Always allow going back
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      return;
    }

    // Check if current step is valid before allowing forward navigation
    const validation = getStepValidation(currentStep, formData);
    if (!validation.isValid) {
      Toast.error(`Please complete: ${validation.requiredFields.join(", ")}`);
      return;
    }

    setCurrentStep(stepId);
  };

  // Update next button handler
  const handleNext = async () => {
    const validation = getStepValidation(currentStep, formData);

    if (!validation.isValid) {
      Toast.error(
        `Please complete required fields: ${validation.requiredFields.join(
          ", "
        )}`
      );
      return;
    }

    if (currentStep === steps.length) {
      handleSubmit(onSubmit)();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-w-full gap-12 max-w-7xl h-[80vh]"
    >
      {/* Vertical Stepper - Left Side */}
      <div className="w-64 flex flex-col bg-white rounded-xl min-w-64">
        {/* Fixed Header */}
        <div className="p-6 border-b border-base-200">
          <button className="bg-dark py-2 w-full text-nowrap rounded-lg text-white">
            Back to Homepage
          </button>
        </div>

        {/* Scrollable Steps */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-10 py-6">
          <div className="flex flex-col">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "relative flex flex-col pl-8",
                  step.id !== steps.length && "pb-8"
                )}
              >
                {/* Rest of step content remains the same */}
                {step.id !== steps.length && (
                  <div className="absolute left-0 top-4 bottom-0 w-0.5">
                    <div className="absolute inset-0 bg-muted/20" />
                    {currentStep >= step.id && (
                      <div
                        className="border-progress"
                        style={{
                          top: "0",
                          bottom: "0",
                          background:
                            currentStep > step.id
                              ? "linear-gradient(to bottom, #22c55e, #22c55e)"
                              : "linear-gradient(to bottom, #3b82f6, #60a5fa)",
                        }}
                      />
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    "absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    currentStep === step.id &&
                      "border-blue-500 bg-blue-50 text-blue-500",
                    currentStep > step.id &&
                      "border-green-500 bg-green-50 text-green-500",
                    currentStep < step.id &&
                      "border-gray-200 bg-white text-gray-400"
                  )}
                >
                  <div className="relative z-10">
                    {step.isComplete ? "✓" : step.id}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStepClick(e, step.id)}
                    className={cn(
                      "mb-2 text-left transition-colors relative z-10",
                      currentStep === step.id && "text-blue-500",
                      currentStep > step.id && "text-green-500",
                      currentStep < step.id && "text-muted/50"
                    )}
                  >
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted">{step.description}</p>
                  </button>
                  {step.id < currentStep && (
                    <span className="text-xs text-green-500">
                      Completed{" "}
                      {new Date(
                        drafts.find(
                          (d) => d.formData.draftId === formData.draftId
                        )?.lastSaved
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Fields - Right Side */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col h-full">
          {/* Form title and save indicator */}
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-2xl font-semibold">
              {steps[currentStep - 1].title}
            </h2>
            {isSaving && (
              <span className="text-sm text-muted flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
                Saving...
              </span>
            )}
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pr-4">
            <div className="space-y-6">
              {currentStep === 1 && (
                <BasicDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <RequirementsForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <EligibilityForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <LocationCTCForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <HiringProcessForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 6 && (
                <PreviewForm
                  formData={formData}
                  onEditSection={(step) => setCurrentStep(step)}
                />
              )}
            </div>
          </div>

          {/* Navigation - Fixed at bottom */}
          <div className="flex justify-between mt-6 pt-6 border-t flex-shrink-0">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 border-2 border-dark text-dark hover:bg-dark hover:text-white rounded-lg"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-red/80 text-white rounded-lg hover:bg-red"
            >
              {currentStep === steps.length ? "Submit" : "Next Step"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default JobListingForm;
