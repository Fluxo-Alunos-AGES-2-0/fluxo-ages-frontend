import { useNavigate, useLocation } from "react-router";
import {
  Clock,
  FileText,
  FolderOpen,
  Zap,
  LogOut,
  X,
  Calendar,
  ChevronRight,
  Lock,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "horas",
    label: "Controle de Horas",
    icon: <Clock className="w-4 h-4" />,
    path: "/dashboard",
    disabled: false,
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: <FileText className="w-4 h-4" />,
    path: "/relatorios",
    disabled: false,
  },
  {
    id: "projetos",
    label: "Mapa de Projetos",
    icon: <FolderOpen className="w-4 h-4" />,
    path: "/projetos",
    disabled: false,
  },
];

const MINI_SCHEDULE = [
  { day: "Qui", time: "19:00", label: "Sprint Review", isToday: true },
  { day: "Sex", time: "08:30", label: "Retrospectiva", isToday: false },
  { day: "Seg", time: "08:00", label: "Daily Standup", isToday: false },
  { day: "Seg", time: "14:00", label: "Sprint Planning", isToday: false },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (item: NavItem) => {
    if (item.disabled) return;
    navigate(item.path);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed md:static inset-y-0 left-0 z-40 w-[260px] flex-shrink-0",
          "flex flex-col h-full bg-white dark:bg-[#1E293B]",
          "border-r border-[#E5E7EB] dark:border-[#334155]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#E5E7EB] dark:border-[#334155]">
          <button
            onClick={() => { navigate("/dashboard"); onClose(); }}
            className="flex items-center gap-2.5 cursor-pointer group"
            aria-label="Ir para o Dashboard"
          >
            <div className="w-8 h-8 rounded-[8px] bg-[#3B5CCC] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:opacity-85 transition-opacity">
              <Zap className="w-4 h-4 text-white" fill="rgba(255,255,255,0.9)" />
            </div>
            <div className="flex items-baseline">
              <span
                className="text-[#3B5CCC] dark:text-[#4F6EF7] text-lg tracking-tight group-hover:opacity-80 transition-opacity"
                style={{ fontWeight: 700 }}
              >
                Fluxo
              </span>
              <span
                className="text-[#F47B20] text-lg tracking-tight group-hover:opacity-80 transition-opacity"
                style={{ fontWeight: 700 }}
              >
                AGES
              </span>
            </div>
          </button>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p
            className="px-3 pb-2 text-[10px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-widest"
            style={{ fontWeight: 600 }}
          >
            Menu principal
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = !item.disabled && pathname === item.path;

            /* ── Disabled / coming-soon item ── */
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  title="Em breve"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm select-none opacity-45 cursor-not-allowed"
                >
                  <span className="text-[#9CA3AF] dark:text-[#64748B]">
                    {item.icon}
                  </span>
                  <span
                    className="flex-1 text-[#9CA3AF] dark:text-[#64748B]"
                    style={{ fontWeight: 400 }}
                  >
                    {item.label}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F5F6FA] dark:bg-[#334155]/60 border border-[#E5E7EB] dark:border-[#334155]">
                    <Lock className="w-2.5 h-2.5 text-[#C4C9D4] dark:text-[#475569]" />
                    <span
                      className="text-[9px] text-[#C4C9D4] dark:text-[#475569] leading-none"
                      style={{ fontWeight: 600 }}
                    >
                      Em breve
                    </span>
                  </span>
                </div>
              );
            }

            /* ── Active / enabled item ── */
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-all duration-150 cursor-pointer text-left group",
                  isActive
                    ? "bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 text-[#3B5CCC] dark:text-[#4F6EF7]"
                    : "text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 hover:text-[#1F2937] dark:hover:text-[#F9FAFB]",
                ].join(" ")}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                <span
                  className={
                    isActive
                      ? "text-[#3B5CCC] dark:text-[#4F6EF7]"
                      : "text-[#9CA3AF] dark:text-[#64748B] group-hover:text-[#6B7280] dark:group-hover:text-[#94A3B8]"
                  }
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>
            );
          })}

          {/* ── Mini Cronograma da Turma ── */}
          <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2 px-3 pb-3">
              <Calendar className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#64748B]" />
              <p
                className="text-[10px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-widest"
                style={{ fontWeight: 600 }}
              >
                Cronograma da Turma
              </p>
            </div>

            <div className="space-y-1 px-1">
              {MINI_SCHEDULE.map((event, idx) => (
                <div
                  key={idx}
                  className={[
                    "flex items-center gap-3 px-2 py-2 rounded-[8px] transition-colors",
                    event.isToday
                      ? "bg-[#EEF2FF] dark:bg-[#3B5CCC]/15"
                      : "hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/30",
                  ].join(" ")}
                >
                  {/* Day pill */}
                  <div
                    className={[
                      "flex-shrink-0 w-10 text-center py-1 rounded-[6px]",
                      event.isToday
                        ? "bg-[#3B5CCC] dark:bg-[#4F6EF7]"
                        : "bg-[#F5F6FA] dark:bg-[#334155]/60",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-[9px] block leading-none",
                        event.isToday
                          ? "text-white"
                          : "text-[#6B7280] dark:text-[#94A3B8]",
                      ].join(" ")}
                      style={{ fontWeight: 700 }}
                    >
                      {event.day}
                    </span>
                    <span
                      className={[
                        "text-[9px] block mt-0.5 leading-none",
                        event.isToday
                          ? "text-white/80"
                          : "text-[#9CA3AF] dark:text-[#64748B]",
                      ].join(" ")}
                    >
                      {event.time}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p
                      className={[
                        "text-xs truncate leading-snug",
                        event.isToday
                          ? "text-[#3B5CCC] dark:text-[#4F6EF7]"
                          : "text-[#6B7280] dark:text-[#94A3B8]",
                      ].join(" ")}
                      style={{ fontWeight: event.isToday ? 600 : 400 }}
                    >
                      {event.label}
                    </p>
                    {event.isToday && (
                      <span
                        className="text-[9px] text-[#F47B20]"
                        style={{ fontWeight: 600 }}
                      >
                        Hoje
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B5CCC] to-[#5B7AE8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs" style={{ fontWeight: 700 }}>
                LF
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate"
                style={{ fontWeight: 600 }}
              >
                Lucas Fernandes
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">
                AGES III
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs text-[#6B7280] dark:text-[#94A3B8] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}