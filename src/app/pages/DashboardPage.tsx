import { AppLayout } from "../components/dashboard/AppLayout";
import { ProfileCard } from "../components/dashboard/ProfileCard";
import { TimerCard } from "../components/dashboard/TimerCard";
import { HoursUnifiedCard } from "../components/dashboard/HoursUnifiedCard";

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Row 1: Profile + Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-1 flex">
          <div className="flex-1">
            <ProfileCard />
          </div>
        </div>
        <div className="lg:col-span-2 flex">
          <div className="flex-1">
            <TimerCard />
          </div>
        </div>
      </div>

      {/* Row 2: Unified hours card */}
      <div className="h-[168px]">
        <HoursUnifiedCard />
      </div>
    </AppLayout>
  );
}
