"use client";

import type { ReactNode } from "react";

type PageBackgroundProps = {
  children: ReactNode;
  className?: string;
  showGrid?: boolean;
  showGlow?: boolean;
};

export default function PageBackground({
  children,
  className = "",
  showGrid = true,
  showGlow = true,
}: PageBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-[#090909] text-white ${className}`}
    >
      {/* ====================================== */}
      {/* BACKGROUND GRID                        */}
      {/* ====================================== */}

      {showGrid && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize:
              "48px 48px",
          }}
        />
      )}

      {/* ====================================== */}
      {/* TOP GLOW                               */}
      {/* ====================================== */}

      {showGlow && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#E8820C]/[0.045] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-[30%] h-[350px] w-[350px] rounded-full bg-[#E8820C]/[0.025] blur-[100px]"
          />
        </>
      )}

      {/* ====================================== */}
      {/* CONTENT                                */}
      {/* ====================================== */}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}