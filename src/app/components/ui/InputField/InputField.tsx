import React, { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  onChange?: (value: string) => void;
  mandatory?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  type = 'text',
  disabled,
  className = '',
  onChange,
  mandatory = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  // Lógica para aplicar as classes dinamicamente com base no estado
  const wrapperClasses = `flex items-center border rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out ${
    disabled
      ? 'bg-[#f4f5f6] border-[#e2e4e9] dark:bg-[#334155] dark:border-[#334155]'
      : error 
        ? 'border-red-500 bg-white dark:bg-[#1E293B] dark:border-red-500' 
        : isFocused 
          ? 'border-blue-500 ring-1 ring-blue-500 bg-white dark:bg-[#1E293B]' 
          : 'border-slate-300 bg-white dark:border-[#334155] dark:bg-[#1E293B]'
  }`;

  return (
    <div className={`flex flex-col w-full font-sans ${className}`}>
      {/* Label */}
      <label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-[#94A3B8]">
        {
          mandatory
          ? <>{label}<span className="text-[#f47b20]">*</span></>
          : <>{label}</>
        }
      </label>

      {/* CONTAINER DO INPUT */}
      <div className={wrapperClasses}>
        
        {/* Ícone da esquerda */}
        {icon && (
          <div className={`flex items-center mr-2.5 ${disabled ? 'text-slate-300 dark:text-[#64748B]' : 'text-slate-400 dark:text-[#94A3B8]'}`}>
            {icon}
          </div>
        )}

        {/* Input Real */}
        <input
          type={inputType}
          disabled={disabled}
          className={`flex-1 border-none outline-none bg-transparent text-sm disabled:cursor-not-allowed ${
            disabled
              ? 'text-slate-400 placeholder-slate-300 dark:text-[#94A3B8] dark:placeholder-[#64748B]'
              : 'text-slate-700 placeholder-slate-400 dark:text-[#F4F6F7] dark:placeholder-[#94A3B8]'
          }`}
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

        {/* Ação à direita (Toggle de Senha) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={disabled}
            className={`flex items-center bg-transparent border-none cursor-pointer ml-2.5 p-0 transition-colors ${
              disabled
                ? 'text-slate-300 dark:text-[#64748B] cursor-not-allowed'
                : 'text-slate-400 dark:text-[#94A3B8] hover:text-slate-600 dark:hover:text-[#F4F6F7]'
            }`}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && !disabled && (
        <span className="mt-1 text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
