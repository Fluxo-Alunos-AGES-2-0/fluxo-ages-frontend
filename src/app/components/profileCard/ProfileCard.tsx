import { Card } from "@/app/components/Card/Card";
import { useState, useEffect } from "react";
import { Folder, GraduationCap, CircleStar } from "lucide-react";

function gerarCor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
}

export function ProfileCard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const nome = "Ellen Miranda";
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const corAvatar = gerarCor(nome);

  if (loading) {
    return (
      <Card title="Perfil do Estudante">
        <div className="flex flex-col gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="w-3/5 h-4 bg-gray-200 rounded" />
          <div className="w-2/5 h-3 bg-gray-200 rounded" />
          <div className="w-full h-3.5 bg-gray-200 rounded" />
          <div className="w-full h-3.5 bg-gray-200 rounded" />
          <div className="w-full h-3.5 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Perfil do Estudante" headerAction={<button>Editar</button>}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: corAvatar }}
          >
            {iniciais}
          </div>
          <div>
            <h3>{nome}</h3>
            <p>lfucas@email.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Folder size={16} />
          </div>
          <div>
            <small className="text-gray-400 text-xs">PROJETO ATUAL</small>
            <p className="m-0 font-medium">Sis. Gestão Acadêmica</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} />
          </div>
          <div>
            <small className="text-gray-400 text-xs">PROFESSOR</small>
            <p className="m-0 font-medium">Prof. João Silva</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <CircleStar size={16} />
          </div>
          <div>
            <small className="text-gray-400 text-xs">NÍVEL AGES</small>
            <p className="m-0 font-medium">AGES III</p>
          </div>
        </div>

        <hr />

        <button
          className="opacity-70 flex justify-between items-center gap-3 p-3 rounded-lg cursor-pointer border-none bg-transparent w-full"
          onClick={() => console.log("clicou")}
        >
          <div className="flex flex-col items-center">
            Aulas <b>0</b>
          </div>
          <div className="flex flex-col items-center">
            Presenças <b className="text-green-600">0</b>
          </div>
          <div className="flex flex-col items-center">
            Faltas <b className="text-red-600">0</b>
          </div>
        </button>
      </div>
    </Card>
  );
}
