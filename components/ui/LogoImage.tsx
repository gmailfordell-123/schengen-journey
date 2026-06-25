"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoImageProps {
  size?: number;
  className?: string;
}

export function LogoImage({ size = 36, className = "" }: LogoImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg text-sm font-bold text-white ${className}`}
        style={{ background: "var(--navy-600)", width: size, height: size }}
      >
        SJ
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={{ background: "#fff", width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Schengen Journey"
        width={size}
        height={size}
        className="object-contain"
        priority
        onError={() => setFailed(true)}
      />
    </span>
  );
}
