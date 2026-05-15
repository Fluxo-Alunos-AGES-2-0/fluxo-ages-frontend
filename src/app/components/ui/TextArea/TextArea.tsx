import React, { useState, TextareaHTMLAttributes } from 'react';

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
  value?: string;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  disabled = false,
  className = '',
  onChange,
  value = '',
  maxLength = 1250,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const isLimitReached = value.length >= maxLength;
  const shouldShowCounter = !disabled && (value.length > 0 || isFocused);

  const textAreaClasses = `
    w-full min-h-[120px] p-4 bg-transparent outline-none
    text-sm text-slate-700 placeholder-slate-300 resize-none
    
    scrollbar-thin
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-thumb]:bg-slate-200
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-track]:bg-transparent
    hover:[&::-webkit-scrollbar-thumb]:bg-slate-300

    ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
  `;

  return (
    <div className={`flex flex-col w-full font-sans ${className}`}>
      <label className="mb-1.5 text-sm font-semibold text-[#6B7280] cursor-text">
        {label}
      </label>

      <div className={`
        relative w-full overflow-hidden border transition-all duration-200 ease-in-out rounded-2xl
        ${disabled ? 'bg-slate-50 opacity-60' : 'bg-white'}
        ${
          error 
            ? 'border-red-500' 
            : isFocused 
              ? 'border-blue-500 ring-1 ring-blue-500' 
              : 'border-slate-200'
        }
      `}>
        <textarea
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          className={textAreaClasses}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
      </div>

      {/* Container inferior para Erro e Contador */}
      <div className="flex justify-between items-start mt-1 min-h-[18px]">
        <div className="flex-1">
          {error && !disabled && (
            <span className="text-xs text-red-500 font-medium">
              {error}
            </span>
          )}
        </div>
        
        {shouldShowCounter && (
          <span className={`text-[11px] font-medium tracking-wide transition-colors duration-200 ${
            isLimitReached ? 'text-red-500' : 'text-slate-400'
          }`}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};