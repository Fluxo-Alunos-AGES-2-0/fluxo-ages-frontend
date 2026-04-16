import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
  secondary:
    "border border-primary text-primary bg-transparent hover:bg-primary/10 active:bg-primary/15",
  ghost: "bg-transparent text-primary hover:underline px-1",
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2",
        "px-5 py-2.5 rounded-lg",
        "text-[0.9375rem] font-semibold leading-tight",
        "cursor-pointer transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/35",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
