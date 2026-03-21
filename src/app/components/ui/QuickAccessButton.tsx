import React from "react";
import { ExternalLink } from "lucide-react";

interface QuickAccessButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  highlighted?: boolean;
  className?: string;
}

export function QuickAccessButton({
  icon,
  label,
  onClick,
  href,
  highlighted = false,
  className = "",
}: QuickAccessButtonProps) {
  const base =
    "w-full flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all duration-200 cursor-pointer group text-left";

  const highlightedStyle =
    "bg-[#FFF5EC] border border-[#F47B20]/50 text-[#F47B20] hover:bg-[#F47B20] hover:text-white hover:shadow-md hover:border-[#F47B20]";

  const defaultStyle =
    "bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F5F6FA] hover:border-[#3B5CCC]/40 hover:text-[#3B5CCC] hover:shadow-sm";

  const content = (
    <>
      <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
        {icon}
      </span>
      <span className="flex-1 text-sm">{label}</span>
      {href && (
        <ExternalLink className="w-3.5 h-3.5 opacity-40 flex-shrink-0 group-hover:opacity-70 transition-opacity" />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${highlighted ? highlightedStyle : defaultStyle} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${highlighted ? highlightedStyle : defaultStyle} ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
