import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { cn } from '@/lib/utils';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="form-control w-full">
      <ReactDatePicker
        ref={ref}
        className={cn(
          "input input-bordered w-full bg-white",
          error ? "input-error border-red" : "focus:border-red/10",
          "focus:ring-0 focus:outline-none",
          className
        )}
        calendarClassName="bg-dark card card-bordered shadow-xl p-4"
        dayClassName={date => 
          "hover:bg-red hover:text-red rounded-full cursor-pointer"
        }
        wrapperClassName="w-full"
        dateFormat="MMMM d, yyyy"
        showTimeSelect={false}
        popperClassName="shadow-xl"
        popperPlacement="bottom-start"
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;