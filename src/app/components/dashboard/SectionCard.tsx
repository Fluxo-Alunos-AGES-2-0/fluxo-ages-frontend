import React from "react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  accent?: boolean;
}

export function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
  noPadding = false,
  accent = false,
}: SectionCardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] transition-colors duration-300 ${className}`}
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {accent && (
        <div className="h-0.5 w-full rounded-t-[12px] bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />
      )}
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="text-[#3B5CCC] dark:text-[#4F6EF7] flex-shrink-0">
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h3
                  className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
                  style={{ fontWeight: 600 }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
}
