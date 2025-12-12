import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import DatePicker from '@/components/ui/datepicker';
import { RiAddLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';

const BranchCard = ({ branch, isSelected, onToggle, cgpa, onCGPAChange, error }) => (
  <div 
    className={`card bg-base-100 transition-all duration-300 ease-in-out
      ${isSelected 
        ? 'border-2 border-red shadow-[0_0_15px_rgba(239,68,68,0.1)] scale-100' 
        : 'border border-base-200 hover:border-red/30 scale-95 hover:scale-100'
      }
    `}
  >
    <div className="card-body p-4">
      <label className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-300
            ${isSelected ? 'bg-red scale-100' : 'bg-base-300 scale-0 group-hover:scale-100'}
          `}/>
          <span className="font-medium text-dark group-hover:text-red transition-colors">
            {branch.name}
          </span>
        </div>
        <input
          type="checkbox"
          className="checkbox checkbox-error"
          checked={isSelected}
          onChange={onToggle}
        />
      </label>
      
      {isSelected && (
        <div className="mt-3 animate-slideDown">
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={cgpa || ''}
              onChange={onCGPAChange}
              className={`input input-bordered input-sm w-full
                pr-8 transition-all duration-200
                ${error 
                  ? 'input-error border-red focus:border-red' 
                  : 'focus:border-red hover:border-red/30'}
              `}
              placeholder="Min. CGPA"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-base-content/60">
              /10
            </span>
          </div>
          {error && (
            <span className="text-error text-xs mt-1 animate-slideDown">
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

const EligibilityForm = ({ formData, setFormData, errors }) => {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const { auth } = useAuth();
  const [bulkCGPA, setBulkCGPA] = useState('');
  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URI}/super-admin/branch`, {
          headers: { Authorization: auth.token },
        });
        return response.data.data;
      } catch (error) {
        Toast.error('Failed to fetch branches');
        return [];
      }
    }
  });

  const handleBranchToggle = (branchCode) => {
    const newSelected = selectedBranches.includes(branchCode)
      ? selectedBranches.filter(code => code !== branchCode)
      : [...selectedBranches, branchCode];
    setSelectedBranches(newSelected);
    
    // Clear CGPA for removed branches
    const newCgpa = { ...formData.branchWiseMinCgpa };
    if (!newSelected.includes(branchCode)) {
      delete newCgpa[branchCode];
      setFormData({
        ...formData,
        branchWiseMinCgpa: newCgpa,
      });
    }
  };

  const handleCGPAChange = (branchCode, value) => {
    setFormData({
      ...formData,
      branchWiseMinCgpa: {
        ...formData.branchWiseMinCgpa,
        [branchCode]: parseFloat(value) || ''
      }
    });
  };

  const handleBulkCGPAUpdate = () => {
    if (bulkCGPA && selectedBranches.length > 0) {
      const newCgpa = { ...formData.branchWiseMinCgpa };
      selectedBranches.forEach(branchCode => {
        newCgpa[branchCode] = parseFloat(bulkCGPA);
      });
      setFormData({
        ...formData,
        branchWiseMinCgpa: newCgpa
      });
      setBulkCGPA('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Academic Criteria */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-200 pb-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-dark">Academic Criteria</h3>
              <p className="text-sm text-base-content/60">Set eligibility requirements for branches</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="join">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={bulkCGPA}
                  onChange={(e) => setBulkCGPA(e.target.value)}
                  className="join-item input input-sm w-24 
                    border-base-300 focus:border-red hover:border-red/30
                    placeholder:text-base-content/30"
                  placeholder="Set CGPA"
                />
                <button
                  type="button"
                  onClick={handleBulkCGPAUpdate}
                  disabled={!bulkCGPA || selectedBranches.length === 0}
                  className={`join-item btn btn-sm normal-case
                    ${!bulkCGPA || selectedBranches.length === 0 
                      ? 'btn-disabled' 
                      : 'bg-red hover:bg-red/90 text-white border-red'}
                  `}
                >
                  <RiAddLine size={18} />
                  Apply to {selectedBranches.length} {selectedBranches.length === 1 ? 'branch' : 'branches'}
                </button>
              </div>
            </div>
          </div>

          {/* Selected Count */}
          {branches?.length > 0 && (
            <div className="flex items-center gap-2 mt-4 text-sm text-base-content/60">
              <span>{selectedBranches.length} of {branches.length} branches selected</span>
              <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red transition-all duration-300"
                  style={{ width: `${(selectedBranches.length / branches.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Branch Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center gap-2 py-8">
                <span className="loading loading-spinner loading-md text-red"></span>
                <span className="text-sm text-base-content/60">Loading branches...</span>
              </div>
            ) : branches?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-base-content/60">
                No branches found
              </div>
            ) : (
              branches?.map(branch => (
                <BranchCard
                  key={branch.code}
                  branch={branch}
                  isSelected={selectedBranches.includes(branch.code)}
                  onToggle={() => handleBranchToggle(branch.code)}
                  cgpa={formData.branchWiseMinCgpa[branch.code]}
                  onCGPAChange={(e) => handleCGPAChange(branch.code, e.target.value)}
                  error={errors?.branchWiseMinCgpa?.[branch.code]}
                />
              ))
            )}
          </div>

          {/* Move Backlogs Switch here */}
          <div className="flex items-center justify-between border-t border-base-200 mt-4 pt-4">
            <div className="space-y-1">
              <h4 className="font-medium">Active Backlogs</h4>
              <p className="text-sm text-base-content/60">Allow students with active backlogs to apply</p>
            </div>
            <Switch
              checked={formData.activeBacklogsAcceptable}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                activeBacklogsAcceptable: checked
              })}
              className="data-[state=checked]:bg-red"
            />
          </div>

          {/* Failed Subjects Input */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium">Maximum Failed Subjects Allowed*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.failedSubjects}
              onChange={(e) => setFormData({
                ...formData,
                failedSubjects: parseInt(e.target.value) || 0
              })}
              className={`input input-bordered w-full focus:border-red ${
                errors?.failedSubjects ? 'input-error' : ''
              }`}
              placeholder="Enter maximum number of failed subjects allowed"
            />
            {errors?.failedSubjects && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.failedSubjects}</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center border-b border-base-200 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-dark">Application Details</h3>
              <p className="text-sm text-base-content/60">Set application deadline and bond duration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Application Deadline */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Application Deadline*</span>
              </label>
              <DatePicker
                selected={formData.applicationDeadline ? new Date(formData.applicationDeadline) : null}
                onChange={(date) => setFormData({
                  ...formData,
                  applicationDeadline: date
                })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                placeholderText="Select application deadline"
                className={`input input-bordered w-full focus:border-dark ${
                  errors?.applicationDeadline ? 'input-error' : ''
                }`}
              />
              {errors?.applicationDeadline && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.applicationDeadline}</span>
                </label>
              )}
            </div>

            {/* Bond Duration */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Bond Duration (in years)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.bondInYrs}
                onChange={(e) => setFormData({
                  ...formData,
                  bondInYrs: parseFloat(e.target.value) || 0
                })}
                className="input input-bordered focus:border-dark focus:ring-0 focus:outline-none"
                placeholder="Enter bond duration"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityForm;