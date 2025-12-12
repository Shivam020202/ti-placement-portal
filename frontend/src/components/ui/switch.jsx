import React from 'react';

const Switch = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      disabled={disabled}
    />
  );
};

export { Switch };