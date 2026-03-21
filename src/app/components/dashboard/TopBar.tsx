import { useLocation } from "react-router";
import { Menu, Moon, Sun, Info, ChevronRight, Clock } from "lucide-react";
import { useTimer } from "../../context/TimerContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCompact(total: number) {
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
interface BreadcrumbItem {
  label: string;
}

const ROUTE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  "/dashboard":  [{ label: "Dashboard" }],
  "/relatorios": [{ label: "Dashboard" }, { label: "Relatórios" }],
  "/projetos":   [{ label: "Dashboard" }, { label: "Mapa de Projetos" }],
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface TopBarProps {
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSidebar: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TopBar({ isDark, onToggleDark, onOpenSidebar }: TopBarProps) {
  const { pathname } = useLocation();
  const crumbs = ROUTE_BREADCRUMBS[pathname] ?? [{ label: "Dashboard" }];

  // Timer state from shared context
  const { running, seconds } = useTimer();

  // Show compact timer only when a session is running AND we are NOT on the
  // dashboard (where the full chronometer is already visible)
  const showCompactTimer = running && pathname !== "/dashboard";

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] transition-colors duration-300">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-[8px] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <span key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#64748B]" />
                )}
                <span
                  className={
                    isLast
                      ? "text-[#1F2937] dark:text-[#F9FAFB]"
                      : "text-[#6B7280] dark:text-[#94A3B8]"
                  }
                  style={{ fontWeight: isLast ? 600 : 400 }}
                >
                  {crumb.label}
                </span>
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right: compact timer + info + dark toggle + avatar */}
      <div className="flex items-center gap-2">

        {/* ── Compact session timer ── */}
        {showCompactTimer && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FFF5EC] dark:bg-[#F47B20]/10 border border-[#F47B20]/25 mr-1"
            title="Sessão em andamento"
          >
            {/* Pulsing dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#F47B20] animate-pulse flex-shrink-0" />
            {/* Clock icon */}
            <Clock className="w-3 h-3 text-[#F47B20] flex-shrink-0" />
            {/* Time */}
            <span
              className="font-mono text-xs text-[#F47B20] tabular-nums"
              style={{ fontWeight: 700, letterSpacing: "0.02em" }}
            >
              {formatCompact(seconds)}
            </span>
          </div>
        )}

        {/* Info button */}
        <button className="relative p-2 rounded-[8px] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors">
          <Info className="w-[18px] h-[18px]" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className={[
            "relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0",
            isDark ? "bg-[#4F6EF7]" : "bg-[#E5E7EB] dark:bg-[#334155]",
          ].join(" ")}
          aria-label="Alternar modo escuro"
        >
          <span
            className={[
              "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300",
              isDark ? "translate-x-7" : "translate-x-0",
            ].join(" ")}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-[#4F6EF7]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[#F47B20]" />
            )}
          </span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B5CCC] to-[#5B7AE8] flex items-center justify-center shadow-sm ml-1 cursor-pointer hover:opacity-90 transition-opacity">
          <span className="text-white text-xs" style={{ fontWeight: 700 }}>
            LF
          </span>
        </div>
      </div>
    </header>
  );
}
