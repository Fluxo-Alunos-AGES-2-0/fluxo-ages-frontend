import { useEffect, useState } from "react";
import { ProfileCard } from "../components/profileCard/ProfileCard";
import { TimerCard } from "../components/TimerCard/TimerCard";
import { HoursTracker } from "../components/HoursTracker/HoursTracker";
import { api } from "@/app/services/api";
import { useAuth } from "@/app/context/AuthContext";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  agesLevel: number;
  currentProject: { id: number; name: string } | null;
  professor: { id: number; name: string } | null;
  attendance: { totalClasses: number; presences: number; absences: number };
}

interface HoursData {
  completedSeconds: number;
  remainingSeconds: number;
  totalSeconds: number;
  percentual: number;
}

interface DashboardResponse {
  profile: ProfileData;
  hours: HoursData;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
function toAgesLevel(n: number) {
  return `AGES ${ROMAN[n - 1] ?? n}`;
}

export default function DashboardPage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hours, setHours] = useState<HoursData | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api
      .get<DashboardResponse>("/dashboard")
      .then((data) => {
        setProfile(data.profile);
        setHours(data.hours);
        updateUser({ level: toAgesLevel(data.profile.agesLevel) });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => {
        setLoading(false);
    });
  }, []);
  const refreshHours = () => {
  setHoursLoading(true)
  api
    .get<HoursData>("/hours/me/control")
    .then((data) => setHours(data))
    .catch((err: Error) => setError(err.message))
    .finally(() => setHoursLoading(false))
}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:rows-[auto_1fr] lg:h-full gap-6">
      <div className="lg:col-span-1 flex flex-col">
        <ProfileCard profile={profile} loading={loading} error={error} />
      </div>

      <div className="lg:col-span-2 flex flex-col">
        <TimerCard onConfirmFinish={refreshHours}/>
      </div>

      <div className="lg:col-span-3">
        <HoursTracker hours={hours} loading={loading || hoursLoading} error={error} />
      </div>
    </div>
  );
}
