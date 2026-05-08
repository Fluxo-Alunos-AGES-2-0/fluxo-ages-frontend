import {Card} from "../Card/Card";
import styles from "./ProfileCard.module.css";
import { useState, useEffect } from "react";
import { Folder, GraduationCap, CircleStar } from "lucide-react";

interface ProfileCardProps {
  profile: any;
  loading: boolean;
  error: string | null;
}

function ProfileCard({ profile, loading, error }: ProfileCardProps) { 
  // CORTE AQUI: a linha do useState foi removida para não duplicar com a prop 'loading'
  
  const nome = profile?.name || "Ellen Miranda";

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
            <p>lfucas@email.com</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><Folder size={16} /></div>
          <div>
            <small>PROJETO ATUAL</small>
            <p>Sis. Gestão Acadêmica</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><GraduationCap size={16} /></div>
          <div>
            <small>PROFESSOR</small>
            <p>Prof. João Silva</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.iconBox}><CircleStar size={16} /></div>
          <div>
            <small>NÍVEL AGES</small>
            <p>AGES III</p>
          </div>
        </div>

        <hr />

        <button className={styles.frequencia} onClick={() => console.log("clicou")}>
          <div>Aulas <b>0</b></div>
          <div>Presenças <b style={{color: "green"}}>0</b></div>
          <div>Faltas <b style={{color: "red"}}>0</b></div>
        </button>
      </div>
    </Card>
  );
}

export default ProfileCard;