import React, { useState } from 'react';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import { Switch } from '@/components/ui/switch';
import { Toast } from '@/components/ui/toast';

const LocationCTCForm = ({ formData, setFormData, errors }) => {
  const [newLocation, setNewLocation] = useState('');
  const [newComponent, setNewComponent] = useState({ name: '', amount: '' });

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setFormData({
        ...formData,
        locationOptions: [...formData.locationOptions, newLocation.trim()]
      });
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (index) => {
    setFormData({
      ...formData,
      locationOptions: formData.locationOptions.filter((_, i) => i !== index)
    });
  };

  const handleAddCtcComponent = () => {
    if (!newComponent.name || !newComponent.amount) {
      Toast.error('Please fill both component name and amount');
      return;
    }

    const amount = parseFloat(newComponent.amount);
    if (isNaN(amount) || amount <= 0) {
      Toast.error('Please enter a valid amount');
      return;
    }

    setFormData({
      ...formData,
      ctcBreakup: [...formData.ctcBreakup, newComponent]
    });
    setNewComponent({ name: '', amount: '' });
  };

  const handleRemoveCtcComponent = (index) => {
    setFormData({
      ...formData,
      ctcBreakup: formData.ctcBreakup.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* Work Location */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="card-body">
          <div className="flex justify-between items-center border-b border-base-200 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-dark">Work Location</h3>
              <p className="text-sm text-base-content/60">Add work location details</p>
            </div>
            <div>
              <label className="label cursor-pointer gap-3">
                <span className="label-text">Remote Work Available</span>
                <Switch
                  checked={formData.remoteWork}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    remoteWork: checked
                  })}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Add location (e.g., Mumbai, Bangalore)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="btn btn-primary"
              >
                <RiAddLine size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.locationOptions.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg group"
                >
                  <span>{location}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>
              ))}
            </div>
            {errors?.locationOptions && (
              <p className="text-error text-sm">{errors.locationOptions}</p>
            )}
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="card-body">
          <div className="border-b border-base-200 pb-4">
            <h3 className="text-xl font-semibold text-dark">Compensation Details</h3>
            <p className="text-sm text-base-content/60">Set CTC and compensation breakup</p>
          </div>

          <div className="space-y-6 mt-4">
            {/* Total CTC */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Total CTC (per annum)*</span>
              </label>
              <div className="join">
                <span className="join-item flex items-center px-4 bg-base-200">₹</span>
                <input
                  type="number"
                  value={formData.ctc || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    ctc: parseFloat(e.target.value) || 0
                  })}
                  className={`join-item input input-bordered w-full ${
                    errors?.ctc ? 'input-error' : ''
                  }`}
                  placeholder="Enter total CTC"
                />
              </div>
              {errors?.ctc && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.ctc}</span>
                </label>
              )}
            </div>

            {/* CTC Breakup */}
            <div className="space-y-4">
              <h4 className="font-medium">CTC Breakup (Optional)</h4>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({
                    ...newComponent,
                    name: e.target.value
                  })}
                  className="input input-bordered flex-1"
                  placeholder="Component name (e.g., Base Pay)"
                />
                <input
                  type="number"
                  value={newComponent.amount}
                  onChange={(e) => setNewComponent({
                    ...newComponent,
                    amount: parseFloat(e.target.value) || ''
                  })}
                  className="input input-bordered w-32"
                  placeholder="Amount"
                />
                <button
                  type="button"
                  onClick={handleAddCtcComponent}
                  className="btn bg-red hover:bg-red/80 text-white"
                >
                  <RiAddLine size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {formData.ctcBreakup.map((component, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg group"
                  >
                    <span>{component.name}</span>
                    <div className="flex items-center gap-4">
                      <span>₹{component.amount.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCtcComponent(index)}
                        className="text-red opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <RiCloseLine size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {errors?.ctcBreakup && (
                <p className="text-error text-sm">{errors.ctcBreakup}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCTCForm;