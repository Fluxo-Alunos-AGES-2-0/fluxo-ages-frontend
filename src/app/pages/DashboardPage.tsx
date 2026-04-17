import { ProfileCard } from "../components/profileCard/ProfileCard";
import { TimerCard } from "../components/TimerCard/TimerCard";
import { HoursTracker } from "../components/HoursTracker/HoursTracker";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_1fr] lg:h-full gap-6">
      {/* Linha Superior - Coluna Esquerda */}
      <div className="lg:col-span-1 flex flex-col">
        <ProfileCard />
      </div>

      {/* Linha Superior - Coluna Direita */}
      <div className="lg:col-span-2 flex flex-col">
        <TimerCard />
      </div>

      {/* Linha Inferior - Largura Total */}
      <div className="lg:col-span-3">
        <HoursTracker />
      </div>
    </div>
  );
}
