import { useEffect, useState } from "react";
import { Card } from "@/app/components/Card/Card";
import { CircularProgress } from "@/app/components/CircularProgress/CircularProgress";
import { Loader } from "@/app/components/Loader/Loader";

export const HoursTracker = () => {
  const [hours, setHours] = useState({
    total: "",
    done: "",
    todo: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchHoursData = () => {
    setTimeout(() => {
      setHours({
        total: "60:00:00",
        done: "42:00:00",
        todo: "18:00:00",
      });
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    fetchHoursData();
  }, []);

  return (
    <Card
      title="Controle de Horas"
      icon="arrow"
      className="col-span-full"
      classContent="h-full flex flex-row items-center justify-center gap-[50px] relative"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#3b5ccc] text-2xl font-bold leading-8">
              {hours.done}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              Concluídas
            </p>
          </div>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#f47b20] text-2xl font-bold leading-8">
              {hours.todo}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              A cumprir
            </p>
          </div>
          <div className="w-full h-full border-r border-[#e5e7eb] flex flex-col items-center justify-center">
            <span className="text-[#1f2937] text-2xl font-bold leading-8">
              {hours.total}
            </span>
            <p className="text-[#6b7280] text-center text-[11px] font-normal leading-[16.5px] m-0">
              Total
            </p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <CircularProgress percentage={65} />
          </div>
        </>
      )}
    </Card>
  );
};
