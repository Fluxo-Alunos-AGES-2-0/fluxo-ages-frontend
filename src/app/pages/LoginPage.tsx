import { useState } from "react";
import { LoginCard } from "../components/LoginCard";
import { CronogramaPanel } from "../components/CronogramaPanel";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1625640776489-4186592c6f00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGNhbXB1cyUyMG1vZGVybnxlbnwxfHx8fDE3NzM5NDIyNjN8MA&ixlib=rb-4.1.0&q=80&w=1080";

export default function LoginPage() {
  const [cronogramaOpen, setCronogramaOpen] = useState(false);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
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
        <LoginCard
          onOpenCronograma={() => setCronogramaOpen(true)}
        />
      </div>

      <CronogramaPanel
        isOpen={cronogramaOpen}
        onClose={() => setCronogramaOpen(false)}
      />
    </div>
  );
}