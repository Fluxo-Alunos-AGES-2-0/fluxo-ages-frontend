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

export default function DashboardPage() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hours, setHours] = useState<HoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<DashboardResponse>("/dashboard")
      .then((data) => {
        setProfile(data.profile);
        setHours(data.hours);
        updateUser({ level: toAgesLevel(data.profile.agesLevel) });
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
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:rows-[auto_1fr] lg:h-full gap-6">
      <div className="lg:col-span-1 flex flex-col">
        <ProfileCard profile={profile} loading={loading} error={error} />
      </div>

      <div className="lg:col-span-2 flex flex-col">
        <TimerCard onConfirmFinish={refreshHours} />
      </div>

      <div className="lg:col-span-3">
        <HoursTracker
          hours={hours}
          loading={loading || hoursLoading}
          error={error}
        />
      </div>
    </div>
  );
}
