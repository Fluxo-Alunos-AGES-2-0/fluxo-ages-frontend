import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  label: string;
  icon: LucideIcon;
  path: string;
  active: boolean;
}

export default function NavItem({
  label,
  icon: Icon,
  path,
  active,
}: NavItemProps) {
  return (
    <Link
      to={path}
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline",
        active
          ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--nav-active-bg)]",
      ].join(" ")}
    >
      <Icon size={20} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={18} />}
    </Link>
  );
}
