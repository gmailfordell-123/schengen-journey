"use client";

import { useRef, useCallback, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Physics-based 3D tilt card. Mouse position drives rotateX/rotateY through
 * spring physics — smooth, no cartoon bounce.
 */
export function TiltCard({
  children,
  className = "",
  style = {},
  intensity = 9,
  scaleOnHover = 1.025,
  onClick,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  scaleOnHover?: number;
  onClick?: () => void;
  as?: "div" | "button";
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement & HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 180,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 180,
    damping: 26,
  });
  const scaleSpring = useSpring(1, { stiffness: 260, damping: 28 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
      scaleSpring.set(scaleOnHover);
    },
    [rawX, rawY, scaleSpring, scaleOnHover]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    scaleSpring.set(1);
  }, [rawX, rawY, scaleSpring]);

  const MotionTag = Tag === "button" ? motion.button : motion.div;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLDivElement & HTMLButtonElement>}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        scale: scaleSpring,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={className}
      {...(Tag === "button" ? { type: "button" } : {})}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
