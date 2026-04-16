import React, { useState } from "react";
import { User, Lock, Mail } from "lucide-react";
import { InputField } from "../components/ui/InputField/InputField"; 
import Modal from "../components/ui/Modal/Modal";
import styles from "./HomePage.module.css";
//import ProfileCard from "../components/profileCard/ProfileCard";
// import Card from "../components/card/card.component"; 

export default function HomePage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [emailErro, setEmailErro] = useState("usuario@errado.com");
  const [open, setOpen] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "40rem",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Frontend resetado</h1>
        <p style={{ marginBottom: 0 }}>
          A estrutura base do React foi mantida para o grupo começar a implementar.
        </p>

         <div className={styles.inputList}>
          <div>
            <InputField 
              label="Usuário" 
              icon={<User size={18} />}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <InputField 
              label="Senha" 
              type="password"
              icon={<Lock size={18} />}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <InputField 
              label="E-mail"
              icon={<Mail size={18} />}
              error="Usuário ou senha incorretos."
              value={emailErro}
              onChange={(e) => setEmailErro(e.target.value)}
            />

            
          </div>
        </div>
      </section>

      
      

    </main>
  );
}
