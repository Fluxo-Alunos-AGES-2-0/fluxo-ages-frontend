import React, { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputField.module.css';

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
  let wrapperClasses = styles.inputWrapper;
  if (error) {
    wrapperClasses += ` ${styles.error}`;
  } else if (isFocused) {
    wrapperClasses += ` ${styles.focused}`;
  }
  if (disabled) {
    wrapperClasses += ` ${styles.disabled}`;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Label */}
      <label className={styles.label}>
        {label}
      </label>

      {/* CONTAINER DO INPUT */}
      <div className={wrapperClasses}>
        
        {/* Ícone da esquerda */}
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}

        {/* Input Real */}
        <input
          type={inputType}
          disabled={disabled}
          className={styles.input}
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
            className={styles.toggleButton}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};