import { useEffect, useState } from "react";
import { LoginCard } from "../components/LoginCard";
import { CronogramaPanel } from "../components/CronogramaPanel/CronogramaPanel";

import bg01 from "../assets/images/login/bg/bg-01.webp";
import bg02 from "../assets/images/login/bg/bg-02.webp";
import bg03 from "../assets/images/login/bg/bg-03.webp";
import bg04 from "../assets/images/login/bg/bg-04.webp";

const BG_IMAGES = [bg01, bg02, bg03, bg04];


function getImageByHour() {
  const currentHour = new Date().getHours();
  const index = currentHour % BG_IMAGES.length;
  return BG_IMAGES[index];
}

export default function LoginPage() {
  const [cronogramaOpen, setCronogramaOpen] = useState(false);
  const [bgImage, setBgImage] = useState(getImageByHour());

  useEffect(() => {
    const updateBackground = () => {
      setBgImage(getImageByHour());
    };

    updateBackground();

    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();

    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      updateBackground();
      interval = setInterval(updateBackground, 60 * 60 * 1000);
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "blur(5px)",
        }}
      />

      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0f1c3f]/75 via-[#1a2e5c]/65 to-[#0f1c3f]/70" />

      {/* Noise texture */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative blurs */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#3B5CCC]/20 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F47B20]/15 blur-3xl pointer-events-none z-0" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[440px] px-4">
        <LoginCard onOpenCronograma={() => setCronogramaOpen(true)} />
      </div>

      <CronogramaPanel
        isOpen={cronogramaOpen}
        onClose={() => setCronogramaOpen(false)}
      />
    </div>
  );
}