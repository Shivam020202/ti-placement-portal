import { atom } from 'recoil';

export const jobFormState = atom({
  key: 'jobFormState',
  default: {
    currentStep: 1,
    data: null,
    isDirty: false,
    lastSaved: null
  }
});

export const draftJobsState = atom({
  key: 'draftJobsState',
  default: []
});