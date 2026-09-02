"use client";

import type { ReactNode } from "react";

type A4PreviewProps = {
  children: ReactNode;
  className?: string;
  scale?: number;
};

export default function A4Preview({
  children,
  className = "",
  scale = 1,
}: A4PreviewProps) {
  return (
    <div
      className={`flex w-full justify-center overflow-auto bg-[#D7D7D7] p-4 md:p-8 ${className}`}
    >
      <div
        className="relative shrink-0 origin-top"
        style={{
          width: "210mm",
          minHeight: "297mm",
          transform: `scale(${scale})`,
          marginBottom:
            scale < 1
              ? `-${(1 - scale) * 297}mm`
              : undefined,
        }}
      >
        <div
          id="a4-page"
          className="relative min-h-[297mm] w-[210mm] overflow-hidden bg-white text-black shadow-[0_10px_40px_rgba(0,0,0,0.18)] print:shadow-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
}