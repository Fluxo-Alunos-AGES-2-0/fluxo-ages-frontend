import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  error,
  autoComplete,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm text-[#1F2937]"
        style={{ fontWeight: 500 }}
      >
        {label}
      </label>

      <div className="relative">
        {/* Left icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none flex items-center">
          {icon}
        </div>

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "w-full pl-10 py-3 text-sm rounded-[8px] border bg-white text-[#1F2937]",
            "transition-all duration-200 outline-none",
            "placeholder:text-[#C4C9D4]",
            isPassword ? "pr-10" : "pr-4",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-[#E5E7EB] focus:border-[#3B5CCC] focus:ring-2 focus:ring-[#3B5CCC]/20",
          ].join(" ")}
        />

        {/* Right toggle for password */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-0.5"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
      )}
    </div>
  );
}
