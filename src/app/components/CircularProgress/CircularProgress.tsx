import React from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
}) => {
  const validPercentage = Math.max(0, Math.min(100, percentage));
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (validPercentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-[#e5e7eb] fill-transparent"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          className="fill-transparent stroke-[#3b5ccc] transition-[stroke-dashoffset] duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>

      <div className="text-center z-[1]">
        <span
          className="font-bold text-[#1f2937] block"
          style={{ fontSize: size * 0.22 }}
        >
          {validPercentage}%
        </span>
        <span
          className="text-[#6b7280] uppercase tracking-wide font-normal block"
          style={{ fontSize: size * 0.07 }}
        >
          Concluído
        </span>
      </div>
    </div>
  );
};
