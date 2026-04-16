import { ProfileCard } from "@/app/components/profileCard/ProfileCard";
import { TimerCard } from "@/app/components/TimerCard/TimerCard";
import { HoursTracker } from "@/app/components/HoursTracker/HoursTracker";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="col-span-3">
        <HoursTracker />
      </div>
      <div className="col-span-1">
        <ProfileCard />
      </div>
      <div className="col-span-2">
        <TimerCard />
      </div>
    </div>
  );
}
