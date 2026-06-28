"use client";

import { useSyncExternalStore } from "react";

// Fecha de la boda: 6 de marzo de 2027 (hora local).
const WEDDING_DATE = new Date("2027-03-06T00:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Suscripción al "reloj": refresca una vez por segundo.
function subscribe(callback: () => void) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

// Snapshot en segundos para que el valor sea estable dentro del mismo segundo.
function getSnapshot() {
  return Math.floor(Date.now() / 1000);
}

// En el servidor no hay reloj en vivo: devolvemos null para renderizar un
// placeholder estable y evitar el mismatch de hidratación.
function getServerSnapshot(): number | null {
  return null;
}

function getTimeLeft(nowSeconds: number): TimeLeft | null {
  const diff = WEDDING_DATE.getTime() - nowSeconds * 1000;

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
];

export default function CountdownTimer() {
  const nowSeconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const timeLeft = nowSeconds === null ? null : getTimeLeft(nowSeconds);

  // La fecha ya pasó (solo posible una vez montado en el cliente).
  if (nowSeconds !== null && timeLeft === null) {
    return (
      <p className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
        ¡Llegó el gran día! 🎉
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm"
        >
          <span className="text-4xl font-semibold tabular-nums tracking-tight text-slate-950 sm:text-5xl">
            {timeLeft ? String(timeLeft[key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
