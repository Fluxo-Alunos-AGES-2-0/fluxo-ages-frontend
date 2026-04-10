import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#3B5CCC] text-white hover:bg-[#2d4db3] active:bg-[#243f94]',
  secondary:
    'border border-[#3B5CCC] text-[#3B5CCC] bg-transparent hover:bg-[#3B5CCC]/10 active:bg-[#3B5CCC]/15',
  ghost:
    'bg-transparent text-[#3B5CCC] hover:underline px-1',
};

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'px-5 py-2.5 rounded-lg',
        'text-[0.9375rem] font-semibold leading-tight',
        'cursor-pointer transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#3B5CCC]/35',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
