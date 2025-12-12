import React, { useState } from 'react';
import { RiEditLine, RiFileDownloadLine } from 'react-icons/ri';
import DOMPurify from 'dompurify';
import { Toast } from '@/components/ui/toast';
import { exportToPDF } from '@/utils/pdfExport';

const PreviewSection = ({ title, children, onEdit, step }) => (
  <div className="card bg-base-100 border border-base-200 hover:border-red/20 transition-all duration-300">
    <div className="card-body p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark">{title}</h3>
          <div className="h-0.5 w-20 bg-red mt-2"></div>
        </div>
        <button
          onClick={() => onEdit(step)}
          className="btn btn-ghost btn-sm gap-2 text-red hover:bg-red/5"
        >
          <RiEditLine size={18} />
          Edit Section
        </button>
      </div>
      {children}
    </div>
  </div>
);

const PreviewForm = ({ formData, onEditSection }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToPDF(formData);
    } catch (error) {
      console.error('Export failed:', error);
      Toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-base-100 border-b border-base-200 -mx-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-dark">{formData.title || 'Job Listing Preview'}</h2>
            <p className="text-sm text-base-content/60 mt-1">Review all information before submitting</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn bg-red hover:bg-red/90 text-white gap-2"
          >
            <RiFileDownloadLine size={20} />
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-6 py-6">
          {/* Basic Info */}
          <PreviewSection title="Basic Information" onEdit={onEditSection} step={1}>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-red/5 text-red rounded-lg font-medium">{formData.role}</span>
                <span className="px-4 py-2 bg-base-200 rounded-lg">Batch {formData.gradYear?.join(', ')}</span>
              </div>
            </div>
          </PreviewSection>

          {/* Description */}
          <PreviewSection title="Job Description" onEdit={onEditSection} step={2}>
            <div className="space-y-8">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(formData.descriptionText || '') 
                }} />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-dark">Requirements</h4>
                  <ul className="space-y-2">
                    {formData.requirements?.split('\n').filter(Boolean).map((req, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="h-6 w-6 rounded-full bg-red/5 text-red flex items-center justify-center flex-shrink-0">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-dark">Responsibilities</h4>
                  <ul className="space-y-2">
                    {formData.responsibilities?.split('\n').filter(Boolean).map((resp, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="h-6 w-6 rounded-full bg-red/5 text-red flex items-center justify-center flex-shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </PreviewSection>

          {/* Eligibility */}
          <PreviewSection title="Eligibility Criteria" onEdit={onEditSection} step={3}>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Branch-wise CGPA Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(formData.branchWiseMinCgpa).map(([branch, cgpa]) => (
                    <div key={branch} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                      <span>{branch}</span>
                      <span className="font-medium">{cgpa} CGPA</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="badge badge-outline">
                  {formData.activeBacklogsAcceptable ? 'Active Backlogs Allowed' : 'No Active Backlogs'}
                </div>
                <div className="badge badge-outline">
                  Max Failed Subjects: {formData.failedSubjects}
                </div>
                {formData.bondInYrs > 0 && (
                  <div className="badge badge-outline">
                    {formData.bondInYrs} Year Bond
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Application Deadline</h4>
                <p>{new Date(formData.applicationDeadline).toLocaleString()}</p>
              </div>
            </div>
          </PreviewSection>

          {/* Location & CTC */}
          <PreviewSection title="Location & Compensation" onEdit={onEditSection} step={4}>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Work Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.locationOptions?.map((location, index) => (
                    <span key={index} className="badge badge-outline">{location}</span>
                  ))}
                </div>
                {formData.remoteWork && (
                  <p className="text-sm text-base-content/60 mt-2">Remote work available</p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Compensation</h4>
                <p className="text-xl font-bold">₹{formData.ctc?.toLocaleString()} per annum</p>
                
                {formData.ctcBreakup?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">CTC Breakdown</h5>
                    <div className="space-y-2">
                      {formData.ctcBreakup.map((component, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
                          <span>{component.name}</span>
                          <span className="font-medium">₹{component.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PreviewSection>

          {/* Hiring Process */}
          <PreviewSection title="Hiring Process" onEdit={onEditSection} step={5}>
            <div className="space-y-4">
              {formData.workflowData?.map((process, index) => (
                <div key={process.id} className="p-4 bg-base-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-sm">{index + 1}</span>
                    <h4 className="font-medium">{process.title}</h4>
                  </div>
                  <div className="text-sm text-base-content/60">
                    <p>Type: {process.type.replace('_', ' ')}</p>
                    <p>Venue: {process.venue}</p>
                    <p>Date: {new Date(process.date.from).toLocaleString()} - {new Date(process.date.to).toLocaleString()}</p>
                    {process.interviewType && <p>Interview Type: {process.interviewType}</p>}
                    {process.topic && <p>Topic: {process.topic}</p>}
                    {process.link && <p>Link: {process.link}</p>}
                  </div>
                </div>
              ))}
            </div>
          </PreviewSection>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm;