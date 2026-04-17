import {
  Clock,
  FileText,
  LayoutGrid,
  ChevronRight,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { mockSchedule, type ScheduleEvent } from "@/app/data/mockSchedule";
import logoFluxoAges from "@/app/assets/images/login/logo_fluxo_ages.webp";

const menuItems = [
  { label: "Controle de Horas", icon: Clock, path: "/dashboard" },
  { label: "Relatórios", icon: FileText, path: "/relatorios" },
  { label: "Mapa de Projetos", icon: LayoutGrid, path: "/projetos" },
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
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors no-underline",
        active
          ? "bg-[#eef1fb] text-[#3b5ccc] font-semibold"
          : "text-[#4b5563] font-medium hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={18} className="text-[#3b5ccc]" />}
    </Link>
  );
}

function ScheduleItem({ event }: { event: ScheduleEvent }) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-2 py-2 rounded-xl",
        event.isToday ? "bg-[#eef1fb]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "w-[42px] h-[42px] rounded-lg flex flex-col items-center justify-center shrink-0",
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
            event.isToday
              ? "font-semibold text-[#1f2937]"
              : "font-normal text-[#1f2937]",
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
    <div className="border-t border-[#e5e7eb] px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-full bg-[#3b5ccc] text-white flex items-center justify-center text-[15px] font-semibold shrink-0">
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
    <aside className="flex flex-col h-screen sticky top-0 bg-white border-r border-[#e5e7eb]">
      {/* Logo */}
      <div className="h-[72px] flex items-center justify-center px-6 shrink-0 border-b border-[#e5e7eb]">
        <img
          src={logoFluxoAges}
          alt="FluxoAGES"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Nav + Schedule */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] px-4 pt-5 pb-3 m-0">
          Menu Principal
        </p>
        <div className="flex flex-col gap-0.5">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              path={item.path}
              active={pathname === item.path}
            />
          ))}
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] px-4 pt-6 pb-3 m-0 flex items-center gap-1.5">
          <CalendarDays size={14} className="text-[#9ca3af]" />
          Cronograma da Turma
        </p>
        <div className="flex flex-col gap-1">
          {mockSchedule.map((event) => (
            <ScheduleItem key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <UserFooter />
    </aside>
  );
}
