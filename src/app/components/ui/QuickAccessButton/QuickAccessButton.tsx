import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

interface QuickAccessButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  highlighted?: boolean;
}

export function QuickAccessButton({
  icon,
  label,
  onClick,
  href,
  highlighted = false,
}: QuickAccessButtonProps) {
  const baseClasses =
    "w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer";

  const stateClasses = highlighted
    ? "bg-[#FFF5EC] border-[#F47B20]/50 text-[#F47B20] hover:bg-[#FFF1E5]"
    : "bg-white border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]";

  const iconClasses = highlighted ? "text-[#F47B20]" : "text-[#374151]";
  const externalIconClasses = "w-4 h-4 text-[#9CA3AF] shrink-0";

  const content = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <span className={iconClasses}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>

      {href ? <ExternalLink className={externalIconClasses} /> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${baseClasses} ${stateClasses}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      {content}
    </button>
  );
}