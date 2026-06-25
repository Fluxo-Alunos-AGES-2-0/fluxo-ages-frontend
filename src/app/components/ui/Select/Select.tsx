import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder, wrapperClassName = "", className = "", ...props },
    ref,
  ) => {
    return (
      <div className={`relative inline-block ${wrapperClassName}`}>
        <select
          ref={ref}
          className={`
          appearance-none pl-4 pr-9 rounded-lg h-[38px] 
          border border-[#e5e7eb] bg-white
          text-[13px] text-[#6b7280] font-medium
          focus:outline-none focus:ring-2 focus:ring-[#3b5ccc]/30 focus:border-[#3b5ccc]
          cursor-pointer transition-colors
          disabled:bg-[#f4f5f6] disabled:border-[#e2e4e9] disabled:text-slate-400
          disabled:cursor-not-allowed disabled:opacity-100
          ${className}
        `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
        />
      </div>
    );
  },
);

Select.displayName = "Select";