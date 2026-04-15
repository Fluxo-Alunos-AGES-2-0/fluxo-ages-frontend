import { Zap, Clock, BarChart3, Map } from "lucide-react";
import { useLocation } from "react-router";
import { mockSchedule } from "../../data/mockSchedule";
import NavItem from "./NavItem";
import ScheduleItem from "./ScheduleItem";
import UserFooter from "./UserFooter";
import styles from "./sidebar.module.css";

const menuItems = [
  { label: "Controle de Horas", icon: Clock, path: "/dashboard" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { label: "Mapa de Projetos", icon: Map, path: "/mapa-projetos" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Zap size={24} className={styles.logoIcon} />
        <span className={styles.logoText}>FluxoAGES</span>
      </div>

      <div className={styles.nav}>
        <p className={styles.sectionLabel}>Menu Principal</p>
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            icon={item.icon}
            path={item.path}
            active={pathname === item.path}
          />
        ))}

        <p className={styles.sectionLabel}>Cronograma da Turma</p>
        {mockSchedule.map((event) => (
          <ScheduleItem key={event.id} event={event} />
        ))}
      </div>

      <UserFooter />
    </aside>
  );
}
