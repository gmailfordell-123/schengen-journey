"use client";

import { useEffect, useState } from "react";

export function Meteors({ number = 18 }: { number?: number }) {
  const [meteors, setMeteors] = useState<
    { id: number; left: string; delay: string; duration: string; size: number }[]
  >([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: number }, (_, i) => ({
        id: i,
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        duration: `${(Math.random() * 6 + 4).toFixed(2)}s`,
        size: Math.floor(Math.random() * 60 + 40),
      }))
    );
  }, [number]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute top-0 rotate-[215deg] animate-meteor"
          style={{
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
            width: `${m.size}px`,
            height: "1px",
            background: `linear-gradient(90deg, rgba(34,111,84,0.7), transparent)`,
            boxShadow: "0 0 6px 1px rgba(34,111,84,0.3)",
          }}
        />
      ))}
    </div>
  );
}
