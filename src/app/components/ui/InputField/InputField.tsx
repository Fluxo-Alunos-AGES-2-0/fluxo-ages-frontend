import React, { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  type = 'text',
  disabled,
  className = '',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  // Lógica para aplicar as classes dinamicamente com base no estado
  let wrapperClasses = `flex items-center border rounded-lg px-3 py-2.5 bg-white transition-all duration-200 ease-in-out ${
    error 
      ? 'border-red-500' 
      : isFocused 
        ? 'border-blue-500 outline outline-1 outline-blue-500' 
        : 'border-slate-300'
  } ${disabled ? 'bg-slate-50 opacity-60' : ''}`;

  return (
    <div className={`flex flex-col w-full font-sans ${className}`}>
      {/* Label */}
      <label className="mb-1.5 text-sm font-semibold text-slate-700">
        {label}
      </label>

      {/* CONTAINER DO INPUT */}
      <div className={wrapperClasses}>
        
        {/* Ícone da esquerda */}
        {icon && (
          <div className="flex items-center text-slate-400 mr-2.5">
            {icon}
          </div>
        )}

        {/* Input Real */}
        <input
          type={inputType}
          disabled={disabled}
          className="flex-1 border-none outline-none bg-transparent text-sm text-slate-700 w-full disabled:cursor-not-allowed"
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
            className="flex items-center bg-transparent border-none cursor-pointer text-slate-400 ml-2.5 p-0 disabled:cursor-not-allowed hover:text-slate-600 transition-colors"
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <span className="mt-1 text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};