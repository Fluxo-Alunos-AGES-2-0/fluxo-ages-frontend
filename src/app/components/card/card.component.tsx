import React, { ReactNode } from "react";
import pencil from "@/assets/edit-pencil.svg";
import clockIcon from "@/assets/clock.svg";
import arrowIcon from "@/assets/rising-arrow.svg";

interface CardProps {
  title?: string;
  icon?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  classContent?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  headerAction,
  children,
  className,
  classContent,
}) => {
  const hasHeader = !!title;

  return (
    <div
      className={[
        "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-xl flex flex-col min-h-0 min-w-[280px] relative overflow-hidden w-full h-full",
        className || "",
      ].join(" ")}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b5ccc] to-[#5b7ae8] z-10 rounded-t-xl" />

      {hasHeader && (
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#e5e7eb] w-full h-[50px]">
          <div className="flex items-center gap-2.5">
            {icon === "clock" && <img src={clockIcon} alt="Clock icon" />}
            {icon === "arrow" && (
              <img src={arrowIcon} alt="Rising arrow icon" />
            )}
            {title && (
              <h2 className="text-[14px] font-semibold text-[#1f2937] leading-5 m-0">
                {title}
              </h2>
            )}
          </div>
          {headerAction && (
            <div className="text-[#6b7280] text-[12px] font-medium flex gap-1.5 items-center justify-end max-h-full w-1/4 cursor-pointer">
              <img src={pencil} alt="Edit icon" />
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div
        className={[
          "flex-1",
          hasHeader ? "p-5" : "p-8",
          classContent || "",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};
