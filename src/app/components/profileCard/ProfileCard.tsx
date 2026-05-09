import { Card } from "../Card/Card";
import styles from "./ProfileCard.module.css";
import { useState, useEffect } from "react";
import { Folder, GraduationCap, CircleStar } from "lucide-react";
import { ProfileData } from "../../types/dashboard";
import { toAgesLevel } from "@/app/utils/agesLevel";

interface ProfileCardProps {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

function ProfileCard({ profile, loading, error }: ProfileCardProps) {
  // CORTE AQUI: a linha do useState foi removida para não duplicar com a prop 'loading'

  const nome = profile?.name || "Ellen Miranda";
  const email = profile?.email || "teste@mock.com";
  const projeto = profile?.currentProject?.name || "Sis. Gestão Acadêmica";
  const professor = profile?.professor?.name || "Prof. João Silva";
  const aulas = profile?.attendance?.totalClasses ?? "24";
  const presencas = profile?.attendance?.presences ?? "12";
  const faltas = profile?.attendance?.absences ?? "12";

  const agesLevel = toAgesLevel(profile?.agesLevel) || "I";


  function gerarCor(nome: string) {
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 60%, 50%)`;
  }

  const iniciais = nome
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const corAvatar = gerarCor(nome);

  if (loading) {
    return (
      <Card title="Perfil do Estudante">
        <div className={styles.skeleton}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonTextSmall}></div>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Perfil do Estudante" headerAction={<button>Editar</button>}>
      <div className={styles.profile}>
        <div className={styles.userInfo}>
          <div className={styles.avatar} style={{ backgroundColor: corAvatar }}>
            {iniciais}
          </div>
          <div>
            <h3>{nome}</h3>
            <p>{email}</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><Folder size={16} /></div>
          <div>
            <small>PROJETO ATUAL</small>
            <p>{projeto}</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><GraduationCap size={16} /></div>
          <div>
            <small>PROFESSOR</small>
            <p>{professor}</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><CircleStar size={16} /></div>
          <div>
            <small>NÍVEL AGES</small>
            <p>{agesLevel}</p>
          </div>
        </div>

        <hr />

        <button className={styles.frequencia} onClick={() => console.log("clicou")}>
          <div>Aulas <b>{aulas}</b></div>
          <div>Presenças <b style={{ color: "green" }}>{presencas}</b></div>
          <div>Faltas <b style={{ color: "red" }}>{faltas}</b></div>
        </button>
      </div>
    </Card>
  );
}

export default ProfileCard;