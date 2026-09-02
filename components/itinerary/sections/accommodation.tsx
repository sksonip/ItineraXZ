"use client";

import { useState } from "react";
import {
  BedDouble,
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

export type Accommodation = {
  id: string;
  hotelName: string;
  location?: string;
  roomType?: string;
  nights: number;
  pricePerNight: number;
  rating?: number;
  description?: string;
  included?: boolean;
};

type AccommodationsProps = {
  accommodations: Accommodation[];
  currency?: string;

  onChange?: (
    accommodations: Accommodation[]
  ) => void;

  onAdd?: () => void;

  disabled?: boolean;
};

export default function Accommodations({
  accommodations,
  currency = "₹",
  onChange,
  onAdd,
  disabled = false,
}: AccommodationsProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  function updateAccommodation(
    id: string,
    updates: Partial<Accommodation>
  ) {
    const updated = accommodations.map(
      (accommodation) =>
        accommodation.id === id
          ? {
              ...accommodation,
              ...updates,
            }
          : accommodation
    );

    onChange?.(updated);
  }

  function deleteAccommodation(
    id: string
  ) {
    const updated = accommodations.filter(
      (accommodation) =>
        accommodation.id !== id
    );

    onChange?.(updated);
  }

  const totalNights =
    accommodations.reduce(
      (total, accommodation) =>
        total +
        Math.max(
          0,
          accommodation.nights || 0
        ),
      0
    );

  const totalCost =
    accommodations.reduce(
      (total, accommodation) =>
        total +
        Math.max(
          0,
          accommodation.nights || 0
        ) *
          Math.max(
            0,
            accommodation.pricePerNight ||
              0
          ),
      0
    );

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#111111]">
      {/* HEADER */}

      <div className="border-b border-[#292929] bg-[#151515]">
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          {/* ICON */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8820C]/20 bg-[#E8820C]/10">
            <BedDouble
              size={17}
              className="text-[#E8820C]"
            />
          </div>

          {/* TITLE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="min-w-0 flex-1 text-left"
          >
            <h2 className="text-sm font-black text-white md:text-base">
              Accommodations
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
              Manage hotels, rooms, nights and
              accommodation costs.
            </p>
          </button>

          {/* SUMMARY */}

          <div className="hidden text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
              {accommodations.length}{" "}
              {accommodations.length === 1
                ? "stay"
                : "stays"}
            </p>

            <p className="mt-1 text-xs font-black text-zinc-400">
              {formatMoney(
                totalCost,
                currency
              )}
            </p>
          </div>

          {/* COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-[#222] hover:text-white"
            aria-label={
              collapsed
                ? "Expand accommodations"
                : "Collapse accommodations"
            }
          >
            {collapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>

        {/* MOBILE SUMMARY */}

        <div className="flex items-center justify-between border-t border-[#242424] px-5 py-3 sm:hidden">
          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
            {accommodations.length}{" "}
            {accommodations.length === 1
              ? "stay"
              : "stays"}
          </span>

          <span className="text-xs font-black text-zinc-400">
            {formatMoney(
              totalCost,
              currency
            )}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      {!collapsed && (
        <>
          {accommodations.length === 0 ? (
            <EmptyState
              onAdd={onAdd}
              disabled={disabled}
            />
          ) : (
            <div>
              {accommodations.map(
                (accommodation) => (
                  <AccommodationCard
                    key={accommodation.id}
                    accommodation={
                      accommodation
                    }
                    currency={currency}
                    disabled={disabled}
                    onChange={(updates) =>
                      updateAccommodation(
                        accommodation.id,
                        updates
                      )
                    }
                    onDelete={() =>
                      deleteAccommodation(
                        accommodation.id
                      )
                    }
                  />
                )
              )}

              {/* ADD */}

              {onAdd && (
                <div className="border-t border-[#292929] p-5 md:p-6">
                  <button
                    type="button"
                    onClick={onAdd}
                    disabled={disabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#292929] py-3 text-[9px] font-black uppercase tracking-wider text-zinc-600 transition hover:border-[#E8820C] hover:text-[#E8820C] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={13} />
                    Add accommodation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#292929] bg-[#151515] px-5 py-4 md:px-6">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-wider text-zinc-700">
              <span>
                {totalNights}{" "}
                {totalNights === 1
                  ? "night"
                  : "nights"}
              </span>

              <span className="h-1 w-1 rounded-full bg-zinc-800" />

              <span>
                Total{" "}
                {formatMoney(
                  totalCost,
                  currency
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ================================================== */
/* ACCOMMODATION CARD                                 */
/* ================================================== */

function AccommodationCard({
  accommodation,
  currency,
  disabled,
  onChange,
  onDelete,
}: {
  accommodation: Accommodation;
  currency: string;
  disabled: boolean;
  onChange: (
    updates: Partial<Accommodation>
  ) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] =
    useState(false);

  const nights = Math.max(
    0,
    accommodation.nights || 0
  );

  const pricePerNight = Math.max(
    0,
    accommodation.pricePerNight || 0
  );

  const total = nights * pricePerNight;

  if (editing) {
    return (
      <EditAccommodation
        accommodation={accommodation}
        currency={currency}
        disabled={disabled}
        onChange={onChange}
        onDelete={onDelete}
        onClose={() =>
          setEditing(false)
        }
      />
    );
  }

  return (
    <div className="border-b border-[#242424] p-5 last:border-b-0 md:p-6">
      <div className="flex gap-4">
        {/* HOTEL ICON */}

        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#181818] sm:flex">
          <BedDouble
            size={18}
            className="text-zinc-600"
          />
        </div>

        {/* INFO */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white">
                {accommodation.hotelName ||
                  "Unnamed hotel"}
              </h3>

              {accommodation.location && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-bold text-zinc-600">
                  <MapPin size={10} />

                  {accommodation.location}
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-[#222] hover:text-white disabled:opacity-30"
                title="Edit accommodation"
              >
                <Pencil size={13} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-950/20 hover:text-red-400 disabled:opacity-30"
                title="Delete accommodation"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* DETAILS */}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {accommodation.roomType && (
              <span className="rounded-md border border-[#292929] bg-[#181818] px-2.5 py-1.5 text-[9px] font-black text-zinc-500">
                {accommodation.roomType}
              </span>
            )}

            <span className="text-[9px] font-bold text-zinc-600">
              {nights}{" "}
              {nights === 1
                ? "night"
                : "nights"}
            </span>

            {accommodation.rating !==
              undefined &&
              accommodation.rating > 0 && (
                <span className="flex items-center gap-1 text-[9px] font-black text-zinc-500">
                  <Star
                    size={10}
                    className="fill-current text-[#E8820C]"
                  />

                  {accommodation.rating.toFixed(
                    1
                  )}
                </span>
              )}
          </div>

          {accommodation.description && (
            <p className="mt-3 max-w-2xl text-[10px] leading-5 text-zinc-600">
              {accommodation.description}
            </p>
          )}

          {/* PRICE */}

          <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#242424] pt-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
                Per night
              </p>

              <p className="mt-1 text-xs font-black text-zinc-400">
                {formatMoney(
                  pricePerNight,
                  currency
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-wider text-zinc-700">
                Total
              </p>

              <p className="mt-1 text-sm font-black text-[#E8820C]">
                {formatMoney(
                  total,
                  currency
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* EDIT ACCOMMODATION                                 */
/* ================================================== */

function EditAccommodation({
  accommodation,
  currency,
  disabled,
  onChange,
  onDelete,
  onClose,
}: {
  accommodation: Accommodation;
  currency: string;
  disabled: boolean;
  onChange: (
    updates: Partial<Accommodation>
  ) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-[#242424] bg-[#141414] p-5 last:border-b-0 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E8820C]">
            Accommodation
          </p>

          <h3 className="mt-1 text-sm font-black text-white">
            Edit stay
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:text-white"
        >
          Done
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* HOTEL */}

        <Field label="Hotel name">
          <input
            type="text"
            value={
              accommodation.hotelName
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                hotelName:
                  event.target.value,
              })
            }
            placeholder="The Grand Hotel"
            className={inputClass}
          />
        </Field>

        {/* LOCATION */}

        <Field label="Location">
          <input
            type="text"
            value={
              accommodation.location ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                location:
                  event.target.value,
              })
            }
            placeholder="Bengaluru"
            className={inputClass}
          />
        </Field>

        {/* ROOM */}

        <Field label="Room type">
          <input
            type="text"
            value={
              accommodation.roomType ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                roomType:
                  event.target.value,
              })
            }
            placeholder="Deluxe Room"
            className={inputClass}
          />
        </Field>

        {/* RATING */}

        <Field label="Rating">
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={
              accommodation.rating ?? ""
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                rating:
                  event.target.value === ""
                    ? undefined
                    : Math.min(
                        5,
                        Math.max(
                          0,
                          Number(
                            event.target
                              .value
                          ) || 0
                        )
                      ),
              })
            }
            placeholder="4.5"
            className={inputClass}
          />
        </Field>

        {/* NIGHTS */}

        <Field label="Nights">
          <input
            type="number"
            min={0}
            value={
              accommodation.nights
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                nights: Math.max(
                  0,
                  Number(
                    event.target.value
                  ) || 0
                ),
              })
            }
            className={inputClass}
          />
        </Field>

        {/* PRICE */}

        <Field
          label={`Price per night (${currency})`}
        >
          <input
            type="number"
            min={0}
            value={
              accommodation.pricePerNight
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                pricePerNight:
                  Math.max(
                    0,
                    Number(
                      event.target.value
                    ) || 0
                  ),
              })
            }
            className={inputClass}
          />
        </Field>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <Field label="Description">
            <textarea
              value={
                accommodation.description ||
                ""
              }
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe the stay..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-zinc-700 transition hover:text-red-400 disabled:opacity-30"
        >
          <Trash2 size={12} />
          Delete stay
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ================================================== */
/* EMPTY STATE                                        */
/* ================================================== */

function EmptyState({
  onAdd,
  disabled,
}: {
  onAdd?: () => void;
  disabled: boolean;
}) {
  return (
    <div className="px-5 py-12 text-center md:px-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#292929] bg-[#181818]">
        <BedDouble
          size={20}
          className="text-zinc-700"
        />
      </div>

      <h3 className="mt-4 text-xs font-black text-zinc-400">
        No accommodations yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-700">
        Add hotels and stays to make the
        itinerary complete.
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E8820C] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black disabled:opacity-30"
        >
          <Plus size={13} />
          Add accommodation
        </button>
      )}
    </div>
  );
}

/* ================================================== */
/* FIELD                                              */
/* ================================================== */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ================================================== */
/* HELPERS                                            */
/* ================================================== */

const inputClass =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-[#E8820C] disabled:cursor-not-allowed disabled:opacity-50";

function formatMoney(
  value: number,
  currency: string
) {
  return `${currency}${Math.round(
    value
  ).toLocaleString("en-IN")}`;
}