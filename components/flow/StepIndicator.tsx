"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="w-full overflow-hidden">
      {/* Step row */}
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const isDone = i < current;
          const isActive = i === current;
          return (
            <div key={label} className="flex flex-1 items-center">
              {/* Circle */}
              <motion.div
                animate={{
                  backgroundColor: isDone
                    ? "var(--gold-500)"
                    : isActive
                    ? "var(--navy-600)"
                    : "rgba(255,255,255,0.10)",
                  color: isActive || isDone ? "#fff" : "rgba(255,255,255,0.35)",
                  border: isActive
                    ? "2px solid var(--gold-400)"
                    : isDone
                    ? "2px solid var(--gold-500)"
                    : "2px solid rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.2 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              >
                {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
              </motion.div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="mx-1 h-0.5 flex-1 overflow-hidden rounded" style={{ background: "rgba(255,255,255,0.10)" }}>
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full origin-left"
                    style={{ background: "var(--gold-500)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step label below */}
      <div className="mt-2 text-center text-xs font-semibold" style={{ color: "rgba(240,244,255,0.80)" }}>
        {steps[current]}
      </div>
    </div>
  );
}
