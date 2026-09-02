"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  RotateCcw,
  Trash2,
  Sparkles,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

type Settings = {
  aiSuggestions: boolean;
  autoSave: boolean;
  currency: string;
  defaultTravellers: number;
  defaultDuration: number;
  travelStyle: string;
};

const DEFAULT_SETTINGS: Settings = {
  aiSuggestions: true,
  autoSave: true,
  currency: "INR",
  defaultTravellers: 2,
  defaultDuration: 5,
  travelStyle: "Adventure",
};

const STORAGE_KEY = "itineraXZ-settings";

const travelStyles = [
  "Adventure",
  "Luxury",
  "Relaxed",
  "Family",
  "Wellness",
  "Cultural",
  "Nature",
  "Photography",
];

const currencies = [
  {
    value: "INR",
    label: "Indian Rupee",
    symbol: "₹",
  },
  {
    value: "USD",
    label: "US Dollar",
    symbol: "$",
  },
  {
    value: "EUR",
    label: "Euro",
    symbol: "€",
  },
  {
    value: "GBP",
    label: "British Pound",
    symbol: "£",
  },
];

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Settings>(DEFAULT_SETTINGS);

  const [saved, setSaved] = useState(false);

  const [clearConfirm, setClearConfirm] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    }
  }, []);

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );
    }
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to reset settings:",
        error
      );
    }
  }

  function clearLocalData() {
    try {
      /*
       * Only remove ItineraXZ-related browser data.
       * Do NOT use localStorage.clear() because that
       * would destroy unrelated websites' data.
       */

      const keysToRemove: string[] = [];

      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);

        if (
          key &&
          (key.startsWith("itineraXZ") ||
            key.startsWith("itinera-"))
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) =>
        localStorage.removeItem(key)
      );

      setSettings(DEFAULT_SETTINGS);
      setClearConfirm(false);

      alert("Local ItineraXZ data has been cleared.");
    } catch (error) {
      console.error(
        "Failed to clear local data:",
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}

      <header className="border-b border-[#242424] bg-[#0D0D0D]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <SettingsIcon
              size={15}
              className="text-[#E8820C]"
            />

            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Settings
            </span>
          </div>

          <div className="w-[50px]" />
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        {/* TITLE */}

        <div className="mb-10">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E8820C]">
            Configuration
          </p>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Settings
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
            Control how the itinerary builder behaves.
            These settings are stored locally on this
            device.
          </p>
        </div>

        <div className="space-y-5">
          {/* AI SETTINGS */}

          <section className="rounded-xl border border-[#292929] bg-[#111111]">
            <SectionHeader
              number="01"
              title="AI assistant"
              description="Control Gemini-powered itinerary suggestions."
              icon={<Sparkles size={17} />}
            />

            <div className="border-t border-[#242424]">
              <SettingToggle
                title="AI suggestions"
                description="Allow Gemini to suggest descriptions, activities, highlights and itinerary improvements."
                checked={settings.aiSuggestions}
                onChange={(value) =>
                  updateSetting(
                    "aiSuggestions",
                    value
                  )
                }
              />

              <SettingInfo
                title="AI provider"
                value="Gemini Flash"
              />
            </div>
          </section>

          {/* BUILDER SETTINGS */}

          <section className="rounded-xl border border-[#292929] bg-[#111111]">
            <SectionHeader
              number="02"
              title="Builder"
              description="Set the default behaviour for new itineraries."
              icon={<Save size={17} />}
            />

            <div className="border-t border-[#242424]">
              <SettingToggle
                title="Auto-save"
                description="Automatically save changes while working on an itinerary."
                checked={settings.autoSave}
                onChange={(value) =>
                  updateSetting(
                    "autoSave",
                    value
                  )
                }
              />

              <div className="grid gap-5 border-b border-[#242424] p-5 md:grid-cols-2 md:p-6">
                <NumberSetting
                  label="Default duration"
                  suffix="days"
                  value={settings.defaultDuration}
                  min={1}
                  onChange={(value) =>
                    updateSetting(
                      "defaultDuration",
                      value
                    )
                  }
                />

                <NumberSetting
                  label="Default travellers"
                  suffix="people"
                  value={settings.defaultTravellers}
                  min={1}
                  onChange={(value) =>
                    updateSetting(
                      "defaultTravellers",
                      value
                    )
                  }
                />
              </div>

              <div className="border-b border-[#242424] p-5 md:p-6">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                    Default travel style
                  </span>

                  <div className="relative">
                    <select
                      value={settings.travelStyle}
                      onChange={(event) =>
                        updateSetting(
                          "travelStyle",
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 pr-10 text-sm font-bold text-white outline-none focus:border-[#E8820C]"
                    >
                      {travelStyles.map(
                        (style) => (
                          <option
                            key={style}
                            value={style}
                          >
                            {style}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* PRICING */}

          <section className="rounded-xl border border-[#292929] bg-[#111111]">
            <SectionHeader
              number="03"
              title="Pricing"
              description="Choose the currency used throughout your itineraries."
              icon={
                <span className="text-sm font-black">
                  ₹
                </span>
              }
            />

            <div className="border-t border-[#242424] p-5 md:p-6">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  Default currency
                </span>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {currencies.map(
                    (currency) => {
                      const selected =
                        settings.currency ===
                        currency.value;

                      return (
                        <button
                          key={currency.value}
                          type="button"
                          onClick={() =>
                            updateSetting(
                              "currency",
                              currency.value
                            )
                          }
                          className={`rounded-lg border p-4 text-left transition ${
                            selected
                              ? "border-[#E8820C] bg-[#E8820C]/10"
                              : "border-[#292929] bg-[#181818] hover:border-[#444]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-lg font-black ${
                                selected
                                  ? "text-[#E8820C]"
                                  : "text-zinc-500"
                              }`}
                            >
                              {currency.symbol}
                            </span>

                            {selected && (
                              <Check
                                size={14}
                                className="text-[#E8820C]"
                              />
                            )}
                          </div>

                          <p className="mt-3 text-xs font-black">
                            {currency.value}
                          </p>

                          <p className="mt-1 text-[9px] text-zinc-600">
                            {currency.label}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              </label>
            </div>
          </section>

          {/* PRIVACY */}

          <section className="rounded-xl border border-[#292929] bg-[#111111]">
            <SectionHeader
              number="04"
              title="Privacy & data"
              description="Manage data stored locally by ItineraXZ."
              icon={<ShieldCheck size={17} />}
            />

            <div className="border-t border-[#242424]">
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#181818] text-zinc-500">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      No account required
                    </h3>

                    <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-600">
                      ItineraXZ does not require a login.
                      Preferences configured here are stored
                      in your browser using local storage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#242424] p-5 md:p-6">
                {!clearConfirm ? (
                  <button
                    type="button"
                    onClick={() =>
                      setClearConfirm(true)
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/10 px-4 py-3 text-xs font-black text-red-400 transition hover:bg-red-950/20"
                  >
                    <Trash2 size={14} />
                    Clear local data
                  </button>
                ) : (
                  <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-4">
                    <p className="text-xs font-black text-red-400">
                      Clear all ItineraXZ browser data?
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-red-400/60">
                      This cannot be undone from this
                      browser.
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={clearLocalData}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-xs font-black text-white"
                      >
                        Yes, clear data
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setClearConfirm(false)
                        }
                        className="rounded-lg border border-[#333] px-4 py-2.5 text-xs font-bold text-zinc-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RESET + SAVE */}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resetSettings}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#292929] px-5 py-3 text-xs font-bold text-zinc-500 transition hover:border-[#444] hover:text-white"
            >
              <RotateCcw size={14} />
              Reset defaults
            </button>

            <button
              type="button"
              onClick={saveSettings}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#E8820C] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#F29420]"
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================================================== */
/* COMPONENTS                                         */
/* ================================================== */

function SectionHeader({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-5 md:p-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] text-[#E8820C]">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8820C]">
          {number}
        </p>

        <h2 className="mt-1 text-base font-black">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-[#242424] p-5 md:p-6">
      <div>
        <h3 className="text-sm font-black">
          {title}
        </h3>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#E8820C]"
            : "bg-[#303030]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between p-5 md:p-6">
      <span className="text-xs font-bold text-zinc-500">
        {title}
      </span>

      <span className="rounded-md border border-[#292929] bg-[#181818] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
        {value}
      </span>
    </div>
  );
}

function NumberSetting({
  label,
  value,
  min,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) =>
            onChange(
              Math.max(
                min,
                Number(event.target.value)
              )
            )
          }
          className="w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 pr-20 text-sm font-bold text-white outline-none focus:border-[#E8820C]"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-zinc-600">
          {suffix}
        </span>
      </div>
    </label>
  );
}