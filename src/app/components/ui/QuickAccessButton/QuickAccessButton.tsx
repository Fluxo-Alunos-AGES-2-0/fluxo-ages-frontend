import type { ReactNode } from "react";

interface QuickAccessButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  /** @deprecated */
  highlighted?: boolean;
  iconOnly?: boolean;
}

export function QuickAccessButton({
  icon,
  label,
  onClick,
  href,
  iconOnly = false,
}: QuickAccessButtonProps) {
  if (iconOnly) {
    const iconContent = (
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)" }}
        >
          {icon}
        </div>
        <span className="text-[11px] text-[#374151] font-medium leading-tight text-center">
          {label}
        </span>
      </div>
    );

    if (href) {
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {iconContent}
        </a>
      );
    }

    return (
      <button type="button" onClick={onClick}>
        {iconContent}
      </button>
    );
  }

  const sharedClasses =
    "w-full flex items-center justify-center gap-2.5 rounded-lg border border-[#3B5CCC] px-4 py-2.5 text-[0.9375rem] font-semibold text-[#3B5CCC] bg-transparent hover:bg-[#3B5CCC]/10 active:bg-[#3B5CCC]/15 transition-colors duration-200 cursor-pointer";

  const content = (
    <>
      <span className="flex items-center">{icon}</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={sharedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  );
}