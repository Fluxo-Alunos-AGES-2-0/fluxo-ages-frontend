import React, {
  CSSProperties,
  SelectHTMLAttributes,
  forwardRef,
} from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  title?: string;
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
          border border-[#e5e7eb] dark:border-[#334155]
          bg-white dark:bg-[#1E293B]
          text-[13px] text-[#6b7280] dark:text-[#F4F6F7] font-medium
          focus:outline-none focus:ring-2 focus:ring-[#3b5ccc]/30 focus:border-[#3b5ccc]
          cursor-pointer transition-colors
          disabled:bg-[#f4f5f6] disabled:border-[#e2e4e9] disabled:text-slate-400
          dark:disabled:bg-[#0F172A] dark:disabled:border-[#334155] dark:disabled:text-[#64748B]
          disabled:cursor-not-allowed disabled:opacity-100 dark:disabled:opacity-60
          ${className}
        `}
          style={{ colorScheme: "light dark" }}
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
              style={option.style}
              title={option.title}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] dark:text-[#94A3B8]"
        />
      </div>
    );
  },
);

Select.displayName = "Select";
