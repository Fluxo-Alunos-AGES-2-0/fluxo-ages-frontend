import { Card } from "@/app/components/Card/Card";
import { CircularProgress } from "@/app/components/CircularProgress/CircularProgress";
import { Loader } from "@/app/components/Loader/Loader";

interface HoursData {
  completedSeconds: number;
  remainingSeconds: number;
  totalSeconds: number;
  percentual: number;
}

interface HoursTrackerProps {
  hours: HoursData | null;
  loading: boolean;
  error: string | null;
}

function toHHMMSS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export const HoursTracker = ({ hours, loading, error }: HoursTrackerProps) => {
  return (
    <Card
      title="Controle de Horas"
      icon="arrow"
      className="col-span-full"
      classContent="h-full flex flex-row items-center justify-center gap-[50px] relative"
    >
      {loading ? (
        <Loader />
      ) : error || !hours ? (
        <p className="text-sm text-red-500">
          {error ?? "Erro ao carregar horas."}
        </p>
      ) : (
        <>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#3b5ccc] text-2xl font-bold leading-8">
              {toHHMMSS(hours.completedSeconds)}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              Concluídas
            </p>
          </div>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#f47b20] text-2xl font-bold leading-8">
              {toHHMMSS(hours.remainingSeconds)}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              A cumprir
            </p>
          </div>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#1f2937] text-2xl font-bold leading-8">
              {toHHMMSS(hours.totalSeconds)}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              Total
            </p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <CircularProgress percentage={Math.round(hours.percentual)} />
          </div>
        </>
      )}
    </Card>
  );
};
