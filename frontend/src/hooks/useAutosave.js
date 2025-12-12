import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { draftJobsState } from '../store/atoms/jobFormAtom';
import { Toast } from '@/components/ui/toast';

export const useAutosave = (formData, currentStep) => {
  const [drafts, setDrafts] = useRecoilState(draftJobsState);

  const calculateProgress = (data) => {
    const requiredFields = {
      'Basic Details': ['companyId', 'title', 'role', 'gradYear'],
      'Requirements': ['requirements', 'responsibilities', 'descriptionText'],
      'Eligibility': ['branchWiseMinCgpa', 'applicationDeadline'],
      'Location & CTC': ['locationOptions', 'ctc'],
      'Hiring Process': ['workflowData']
    };

    let completedSteps = 0;
    const totalSteps = 5; // Total number of steps (excluding Preview)

    for (const [_, fields] of Object.entries(requiredFields)) {
      const isStepComplete = fields.every(field => {
        const value = data[field];
        return value && (
          Array.isArray(value) ? value.length > 0 :
          typeof value === 'object' ? Object.keys(value).length > 0 :
          Boolean(value)
        );
      });
      if (isStepComplete) completedSteps++;
    }

    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Enhanced autosave with more metadata
  useEffect(() => {
    const saveDraft = () => {
      if (!formData.title && !formData.companyId) return;

      const draftData = {
        id: formData.draftId || `draft_${Date.now()}`,
        title: formData.title || 'Untitled Job',
        companyId: formData.companyId,
        companyName: formData.companyName,
        progress: calculateProgress(formData),
        currentStep,
        lastEdited: new Date().toISOString(), // Ensure this is set
        role: formData.role,
        ctc: formData.ctc,
        locations: formData.locationOptions,
        applicationDeadline: formData.applicationDeadline,
        formData: formData
      };

      // Update drafts state
      const existingDraftIndex = drafts.findIndex(d => d.id === draftData.id);
      if (existingDraftIndex !== -1) {
        const updatedDrafts = [...drafts];
        updatedDrafts[existingDraftIndex] = draftData;
        setDrafts(updatedDrafts);
      } else {
        setDrafts(prev => [...prev, draftData]);
      }

      // Save to localStorage immediately after updating state
      localStorage.setItem('jobDrafts', JSON.stringify(
        existingDraftIndex !== -1 
          ? [...drafts.slice(0, existingDraftIndex), draftData, ...drafts.slice(existingDraftIndex + 1)]
          : [...drafts, draftData]
      ));
    };

    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep]);
};