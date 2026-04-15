import {
  Zap,
  Clock,
  BarChart3,
  Map,
  ChevronRight,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { mockSchedule, type ScheduleEvent } from "@/app/data/mockSchedule";

const menuItems = [
  { label: "Controle de Horas", icon: Clock, path: "/dashboard" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { label: "Mapa de Projetos", icon: Map, path: "/projetos" },
];

function NavItem({
  label,
  icon: Icon,
  path,
  active,
}: {
  label: string;
  icon: typeof Clock;
  path: string;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors no-underline",
        active
          ? "bg-[#eef1fb] text-[#3b5ccc]"
          : "text-[#6b7280] hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={16} className="text-[#3b5ccc]" />}
    </Link>
  );
}

function ScheduleItem({ event }: { event: ScheduleEvent }) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-2 py-1.5 rounded-xl",
        event.isToday ? "bg-[#eef1fb]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "w-[44px] h-[44px] rounded-xl flex flex-col items-center justify-center shrink-0",
          event.isToday
            ? "bg-[#3b5ccc] text-white"
            : "bg-gray-100 text-[#6b7280]",
        ].join(" ")}
      >
        <span className="text-[11px] font-bold leading-none">
          {event.dayAbbr}
        </span>
        <span className="text-[9px] leading-none mt-0.5">{event.time}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={[
            "text-[14px] truncate",
            event.isToday ? "font-semibold text-[#1f2937]" : "text-[#1f2937]",
          ].join(" ")}
        >
          {event.title}
        </span>
        {event.isToday && (
          <span className="text-[12px] font-semibold text-[#f47b20]">Hoje</span>
        )}
      </div>
    </div>
  );
}

function UserFooter() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="border-t border-[#e5e7eb] px-5 py-5 flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#3b5ccc] to-[#5b7ae8] text-white flex items-center justify-center text-[15px] font-semibold shrink-0">
          {user.initials}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#1f2937] m-0 leading-tight">
            {user.name}
          </p>
          <p className="text-[12px] text-[#6b7280] m-0">{user.level}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 bg-transparent border-none text-[#6b7280] text-[13px] cursor-pointer p-0 hover:text-[#1f2937] transition-colors"
      >
        <LogOut size={16} />
        Sair da conta
      </button>
    </div>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex flex-col h-screen bg-white border-r border-[#e5e7eb] sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 pb-5 border-b border-[#e5e7eb]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b5ccc] to-[#5b7ae8] flex items-center justify-center shrink-0">
          <Zap size={22} color="white" fill="white" />
        </div>
        <span className="text-[20px] font-bold text-[#3b5ccc]">FluxoAGES</span>
      </div>

      {/* Nav + Schedule */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] px-2 pt-4 pb-2 m-0">
          Menu Principal
        </p>
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            icon={item.icon}
            path={item.path}
            active={pathname === item.path}
          />
        ))}

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] px-2 pt-5 pb-2 m-0 flex items-center gap-1.5">
          <CalendarDays size={14} />
          Cronograma da Turma
        </p>
        {mockSchedule.map((event) => (
          <ScheduleItem key={event.id} event={event} />
        ))}
      </div>

      {/* Footer */}
      <UserFooter />
    </aside>
  );
}
