import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 transition-all duration-200 rounded-[8px] px-4 py-3 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1";

  const variants: Record<string, string> = {
    primary:
      "bg-[#3B5CCC] text-white hover:bg-[#2d4db3] active:bg-[#2640a0] shadow-sm hover:shadow-md focus-visible:ring-[#3B5CCC]",
    outline:
      "border border-[#E5E7EB] text-[#1F2937] bg-white hover:bg-[#F5F6FA] hover:border-[#3B5CCC] hover:text-[#3B5CCC] focus-visible:ring-[#3B5CCC]",
    ghost:
      "text-[#6B7280] hover:bg-[#F5F6FA] hover:text-[#1F2937] focus-visible:ring-[#3B5CCC]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
