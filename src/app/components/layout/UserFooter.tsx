import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./userFooter.module.css";

export default function UserFooter() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className={styles.footer}>
      <div className={styles.profile}>
        <div className={styles.avatar}>{user.initials}</div>
        <div>
          <p className={styles.name}>{user.name}</p>
          <p className={styles.level}>{user.level}</p>
        </div>
      </div>
      <button onClick={logout} className={styles.logoutBtn}>
        <LogOut size={16} />
        Sair da conta
      </button>
    </div>
  );
}
