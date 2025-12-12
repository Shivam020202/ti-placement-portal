import { useState } from 'react';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import { Toast } from '@/components/ui/toast';

const CTCBreakdownSection = ({ formData, setFormData, errors }) => {
  const [newComponent, setNewComponent] = useState({ title: '', value: '' });

  const handleAddComponent = () => {
    if (!newComponent.title || !newComponent.value) {
      Toast.error('Please fill both title and value');
      return;
    }

    const value = parseFloat(newComponent.value);
    if (isNaN(value)) {
      Toast.error('Please enter a valid amount');
      return;
    }

    setFormData(prev => ({
      ...prev,
      ctcBreakup: [...(prev.ctcBreakup || []), newComponent]
    }));
    setNewComponent({ title: '', value: '' });
  };

  const calculateTotal = () => {
    return formData.ctcBreakup?.reduce((sum, component) => 
      sum + parseFloat(component.value), 0
    ) || 0;
  };

  return (
    <div className="space-y-4">
      {/* Existing Components */}
      <div className="space-y-3">
        {formData.ctcBreakup?.map((component, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-base-100 rounded-lg group hover:shadow-md transition-all"
          >
            <div>
              <span className="font-medium">{component.title}</span>
              <span className="text-sm text-muted ml-2">₹{component.value}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const newBreakup = formData.ctcBreakup.filter((_, i) => i !== index);
                setFormData(prev => ({ ...prev, ctcBreakup: newBreakup }));
              }}
              className="text-red opacity-0 group-hover:opacity-100 transition-all"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Component */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Component Name (e.g. Base Salary)"
          className="flex-1 input input-bordered"
          value={newComponent.title}
          onChange={(e) => setNewComponent(prev => ({ 
            ...prev, 
            title: e.target.value 
          }))}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-40 input input-bordered"
          value={newComponent.value}
          onChange={(e) => setNewComponent(prev => ({ 
            ...prev, 
            value: e.target.value 
          }))}
        />
        <button
          type="button"
          onClick={handleAddComponent}
          className="btn bg-red hover:bg-red/80 text-white px-4"
        >
          <RiAddLine size={20} />
        </button>
      </div>

      {/* Total CTC */}
      <div className="flex justify-between items-center p-4 bg-base-100 rounded-lg border border-red">
        <span className="font-semibold">Total CTC</span>
        <span className="text-lg font-bold">₹{calculateTotal()}</span>
      </div>

      {errors?.ctcBreakup && (
        <p className="text-red text-sm">{errors.ctcBreakup}</p>
      )}
    </div>
  );
};

export default CTCBreakdownSection;