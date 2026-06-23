"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Horizontal progress indicator for the flow steps.
 */
export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor:
                    isActive || isDone ? "#2563eb" : "#e2e8f0",
                  color: isActive || isDone ? "#ffffff" : "#64748b",
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
              >
                {isDone ? <Check size={15} strokeWidth={3} /> : i + 1}
              </motion.div>
              <span
                className={`hidden text-sm font-medium sm:block ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 w-6 overflow-hidden rounded bg-slate-200 sm:w-10">
                <motion.div
                  initial={false}
                  animate={{ scaleX: isDone ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full origin-left bg-brand-600"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
