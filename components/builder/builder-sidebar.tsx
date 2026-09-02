"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileText,
  Hotel,
  Info,
  ListChecks,
  Map,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

export type BuilderSection =
  | "trip-details"
  | "overview"
  | "days"
  | "inclusions"
  | "exclusions"
  | "accommodations"
  | "advantages"
  | "philosophy"
  | "pricing"
  | "safety";

type BuilderSidebarProps = {
  activeSection?: BuilderSection;
  onSectionChange?: (
    section: BuilderSection
  ) => void;

  completedSections?: BuilderSection[];

  open?: boolean;
  onClose?: () => void;

  aiEnabled?: boolean;
};

type SectionItem = {
  id: BuilderSection;
  label: string;
  description: string;
  icon: React.ElementType;
};

const sections: SectionItem[] = [
  {
    id: "trip-details",
    label: "Trip Details",
    description: "Destination, dates & travelers",
    icon: MapPin,
  },
  {
    id: "overview",
    label: "Overview",
    description: "Introduction to the journey",
    icon: FileText,
  },
  {
    id: "days",
    label: "Itinerary",
    description: "Build the day-by-day plan",
    icon: CalendarDays,
  },
  {
    id: "inclusions",
    label: "Inclusions",
    description: "What's included",
    icon: ListChecks,
  },
  {
    id: "exclusions",
    label: "Exclusions",
    description: "What's not included",
    icon: X,
  },
  {
    id: "accommodations",
    label: "Accommodations",
    description: "Hotels & stays",
    icon: Hotel,
  },
  {
    id: "advantages",
    label: "Advantages",
    description: "Why travelers should choose it",
    icon: Sparkles,
  },
  {
    id: "philosophy",
    label: "Travel Philosophy",
    description: "Style & experience",
    icon: Map,
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "Cost & adjustments",
    icon: CircleDollarSign,
  },
  {
    id: "safety",
    label: "Safety",
    description: "Travel precautions",
    icon: ShieldCheck,
  },
];

export default function BuilderSidebar({
  activeSection = "trip-details",
  onSectionChange,
  completedSections = [],
  open = true,
  onClose,
  aiEnabled = true,
}: BuilderSidebarProps) {
  const completedCount =
    completedSections.length;

  const progress = Math.round(
    (completedCount / sections.length) * 100
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex w-[280px] flex-col
        border-r border-[#292929]
        bg-[#0D0D0D]
        transition-transform duration-200
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      {/* HEADER */}

      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#292929] px-5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
            Builder
          </p>

          <h2 className="mt-1 text-sm font-black tracking-tight text-white">
            Itinerary
          </h2>
        </div>

        {/* MOBILE CLOSE */}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#1A1A1A] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* PROGRESS */}

      <div className="shrink-0 border-b border-[#292929] px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-700">
            Progress
          </span>

          <span className="text-[9px] font-black text-zinc-500">
            {progress}%
          </span>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#222222]">
          <div
            className="h-full rounded-full bg-[#E8820C] transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-[8px] text-zinc-700">
          {completedCount} of{" "}
          {sections.length} sections completed
        </p>
      </div>

      {/* NAVIGATION */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {sections.map((section, index) => {
            const active =
              activeSection === section.id;

            const completed =
              completedSections.includes(
                section.id
              );

            return (
              <SidebarItem
                key={section.id}
                section={section}
                index={index}
                active={active}
                completed={completed}
                onClick={() => {
                  onSectionChange?.(
                    section.id
                  );

                  onClose?.();
                }}
              />
            );
          })}
        </div>
      </nav>

      {/* AI PANEL */}

      {aiEnabled && (
        <div className="shrink-0 border-t border-[#292929] p-3">
          <div className="rounded-xl border border-[#E8820C]/15 bg-[#E8820C]/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
                <Sparkles
                  size={14}
                  className="text-[#E8820C]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#E8820C]">
                  Gemini Assistant
                </p>

                <p className="mt-1 text-[9px] leading-4 text-zinc-600">
                  Get suggestions while you build
                  your itinerary.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div className="shrink-0 border-t border-[#292929] px-5 py-3">
        <div className="flex items-center gap-2">
          <Info
            size={11}
            className="text-zinc-700"
          />

          <p className="text-[8px] leading-4 text-zinc-700">
            Changes are saved through the builder.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ================================================== */
/* SIDEBAR ITEM                                       */
/* ================================================== */

function SidebarItem({
  section,
  index,
  active,
  completed,
  onClick,
}: {
  section: SectionItem;
  index: number;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex w-full
        items-center gap-3
        rounded-lg px-3 py-2.5
        text-left transition
        ${
          active
            ? "border border-[#E8820C]/20 bg-[#E8820C]/5"
            : "border border-transparent hover:bg-[#151515]"
        }
      `}
    >
      {/* ACTIVE INDICATOR */}

      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[#E8820C]" />
      )}

      {/* ICON */}

      <div
        className={`
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-lg border
          ${
            active
              ? "border-[#E8820C]/20 bg-[#E8820C]/10"
              : "border-[#292929] bg-[#151515] group-hover:border-[#3A3A3A]"
          }
        `}
      >
        <Icon
          size={14}
          className={
            active
              ? "text-[#E8820C]"
              : "text-zinc-700 group-hover:text-zinc-400"
          }
        />
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`
              truncate text-[10px] font-black
              ${
                active
                  ? "text-white"
                  : "text-zinc-500 group-hover:text-zinc-300"
              }
            `}
          >
            {section.label}
          </span>

          {completed && (
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#E8820C] text-[7px] font-black text-black">
              ✓
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[8px] text-zinc-700">
          {section.description}
        </p>
      </div>

      {/* NUMBER */}

      <span
        className={`
          hidden text-[8px] font-black
          tabular-nums
          ${
            active
              ? "text-[#E8820C]/50"
              : "text-zinc-800"
          }
          xl:block
        `}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </button>
  );
}