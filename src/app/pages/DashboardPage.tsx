import { useEffect, useState } from "react";
import ProfileCard from "../components/profileCard/ProfileCard";
import { TimerCard } from "../components/TimerCard/TimerCard";
import { HoursTracker } from "../components/HoursTracker/HoursTracker";
import { api } from "@/app/services/api";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { toAgesLevel } from "@/app/utils/agesLevel";
import {
  ProfileData,
  HoursData,
  DashboardResponse,
} from "../types/dashboard";
import { OnboardingTooltip } from "../components/Onboarding/OnboardingTooltip";
import { usePageOnboarding } from "../components/Onboarding/usePageOnboarding";

const DASHBOARD_STEPS = [
  {
    target: "[data-onboarding='sidebar-nav']",
    title: "Navegação Principal",
    description:
      "Use o menu lateral para navegar entre o Dashboard, Relatórios e o Mapa de Projetos. O ícone de cronômetro ativo aparece no topo quando uma sessão está em andamento.",
    placement: "right" as const,
  },
  {
    target: "[data-onboarding='profile-card']",
    title: "Seu Perfil",
    description:
      "Aqui estão seus dados do semestre: projeto atual, professor responsável e frequência nas aulas. Clique em Frequência para ver o detalhamento.",
    placement: "right" as const,
  },
  {
    target: "[data-onboarding='timer-card']",
    title: "Contagem de Horas",
    description:
      "Registre suas horas de trabalho com o cronômetro. Inicie uma sessão, trabalhe no projeto, e finalize com uma descrição das atividades realizadas.",
    placement: "left" as const,
  },
  {
    target: "[data-onboarding='hours-tracker']",
    title: "Controle de Horas",
    description:
      "Acompanhe seu progresso em tempo real: horas concluídas, pendentes e o total exigido no semestre. Os círculos mostram o percentual de cada categoria.",
    placement: "top" as const,
  },
];

export default function DashboardPage() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hours, setHours] = useState<HoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePageOnboarding("dashboard", DASHBOARD_STEPS);

  useEffect(() => {
    api
      .get<DashboardResponse>("/dashboard")
      .then((data) => {
        setProfile(data.profile);
        setHours(data.hours);
        updateUser({
          level: toAgesLevel(data.profile.agesLevel),
          avatarUrl: data.profile.avatarUrl ?? "",
        });
      })
      .catch((err: Error) => {
        setError(err.message);
        showToast({
          variant: "error",
          title: "Erro ao carregar",
          message: "Não foi possível carregar os dados do dashboard.",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshHours = (): Promise<void> => {
    setHoursLoading(true);
    return api
      .get<HoursData>("/hours/me/control")
      .then((data) => setHours(data))
      .catch((err: Error) => {
        setError(err.message);
        showToast({
          variant: "error",
          title: "Erro ao atualizar horas",
          message: "Não foi possível recarregar o controle de horas.",
        });
      })
      .finally(() => setHoursLoading(false));
  };

  return (
    <>
      <OnboardingTooltip steps={DASHBOARD_STEPS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_1fr] lg:h-full gap-6">
        <div className="lg:col-span-1 flex flex-col" data-onboarding="profile-card">
          <ProfileCard profile={profile} loading={loading} error={error} />
        </div>

        <div className="lg:col-span-2 flex flex-col" data-onboarding="timer-card">
          <TimerCard onConfirmFinish={refreshHours} />
        </div>

        <div className="lg:col-span-3" data-onboarding="hours-tracker">
          <HoursTracker
            hours={hours}
            loading={loading || hoursLoading}
            error={error}
          />
        </div>
      </div>
    </>
  );
}
