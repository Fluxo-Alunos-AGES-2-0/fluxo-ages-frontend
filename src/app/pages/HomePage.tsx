import React, { useState } from "react";
import { User, Lock, Mail } from "lucide-react";
import { InputField } from "../components/ui/InputField/InputField"; 

export default function HomePage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [emailErro, setEmailErro] = useState("usuario@errado.com");

  return (
    <main className="min-h-screen grid place-items-center p-8 bg-slate-50">
      <section className="w-full max-w-2xl p-8 rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <h1 className="mt-0 text-2xl font-bold text-slate-800 mb-2">
          [Frontend] - Componente InputField
        </h1>
        
        <p className="mb-8 text-slate-500">
          Abaixo estão os cenários do componente InputField conforme a US001.
        </p>

        <div className="flex flex-col gap-6">
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
        </div>
      </section>
    </main>
  );
}