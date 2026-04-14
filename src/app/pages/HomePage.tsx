import React, { useState } from "react";
import { User, Lock, Mail } from "lucide-react";
import { InputField } from "../components/ui/InputField/InputField"; 
import styles from "./HomePage.module.css";
import Modal from "../components/ui/Modal/Modal";

export default function HomePage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [emailErro, setEmailErro] = useState("usuario@errado.com");
  const [open, setOpen] = useState(false);

  return (
    <main className={styles.mainContainer}>
      <section className={styles.contentCard}>
        <h1 className={styles.title}>[Frontend] - Componente InputField</h1>
        <p className={styles.description}>
          Abaixo estão os cenários do componente InputField conforme a US001.
        </p>


        <div className={styles.inputList}>
          
          <InputField 
            label="Usuário" 
            placeholder="Digite seu usuário" 
            icon={<User size={18} />}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <InputField 
            label="Senha" 
            type="password" 
            placeholder="Digite sua senha" 
            icon={<Lock size={18} />}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <InputField 
            label="E-mail (Validação de Erro)" 
            icon={<Mail size={18} />} 
            error="Usuário ou senha incorretos."
            value={emailErro}
            onChange={(e) => setEmailErro(e.target.value)}
          />

          <InputField 
            label="Usuário (Desabilitado)" 
            icon={<User size={18} />} 
            disabled 
            value="admin_sistema"
            onChange={() => {}}
          />

          <button onClick={() => setOpen(true)}>
            Abrir Modal
          </button>

        </div>
      </section>
      <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Meu modal"
        >
          <p>Teste de conteúdo</p>
      </Modal>
    </main>
  );
}