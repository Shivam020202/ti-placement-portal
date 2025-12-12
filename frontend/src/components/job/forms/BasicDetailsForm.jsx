import React from 'react';
import CompanySelector from '@/components/ui/CompanySelector';

const BasicDetailsForm = ({ formData, setFormData, errors }) => {
  const roleTypes = [
    { value: 'FTE', label: 'Full Time' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'INTERNSHIP_FTE', label: 'Internship + FTE' }
  ];

  const currentYear = new Date().getFullYear();
  const gradYears = Array.from({ length: 4 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-6">
      {/* Company Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Select Company*</span>
        </label>
        <CompanySelector
          value={formData.companyId}
          onChange={(company) => setFormData({ ...formData, companyId: company.id })}
          error={errors?.companyId}
        />
      </div>

      {/* Job Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Job Title*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`input input-bordered w-full ${errors?.title ? 'border-red-500' : ''}`}
          placeholder="e.g. Software Engineer"
        />
      </div>

      {/* Role Type */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Role Type*</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className={`select select-bordered w-full ${errors?.role ? 'border-red-500' : ''}`}
        >
          <option value="">Select Role Type</option>
          {roleTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grad Years */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Graduation Years*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {gradYears.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => {
                const newYears = formData.gradYear.includes(year)
                  ? formData.gradYear.filter(y => y !== year)
                  : [...formData.gradYear, year];
                setFormData({ ...formData, gradYear: newYears });
              }}
              className={`px-4 py-2 rounded-lg border-2 ${
                formData.gradYear.includes(year)
                  ? 'bg-red text-white border-red'
                  : 'border-gray-300 hover:border-red'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;