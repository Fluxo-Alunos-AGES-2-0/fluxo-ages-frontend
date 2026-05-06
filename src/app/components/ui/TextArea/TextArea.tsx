import React, { useState, TextareaHTMLAttributes } from 'react';

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
  value?: string; // Garante que o value seja aceito
}

export const TextArea: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  disabled = false,
  className = '',
  onChange,
  value, // Extraímos o value aqui
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textAreaClasses = `
    w-full min-h-[80px] p-4 bg-white border rounded-2xl transition-all duration-200 ease-in-out
    text-sm text-slate-700 placeholder-slate-300 resize-none
    ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'cursor-text'}
    ${
      error 
        ? 'border-red-500' 
        : isFocused 
          ? 'border-blue-500 outline outline-1 outline-blue-500' 
          : 'border-slate-200'
    }
  `;

  return (
    <div className={`flex flex-col w-full font-sans ${className}`}>
      <label className="mb-1.5 text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        value={value}
        disabled={disabled}
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
      {error && (
        <span className="mt-1 text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};