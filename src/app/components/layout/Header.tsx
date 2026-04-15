import { Info } from "lucide-react";
import { useLocation } from "react-router";
import ThemeToggle from "./ThemeToggle";
import styles from "./header.module.css";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/relatorios": "Relatórios",
  "/mapa-projetos": "Mapa de Projetos",
};

export default function Header() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.center}>
        {/* Reserved for timer widget (FLU-57) */}
      </div>

      <div className={styles.right}>
        <button
          className="p-2 rounded-lg text-[var(--grey)] hover:bg-[var(--border-light)] transition-colors cursor-pointer"
          aria-label="Informações"
        >
          <Info size={20} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
