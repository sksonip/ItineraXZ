# Bettada Jeeva - Itinerary Builder

**What this is:** an internal tool for Bettada Jeeva that lets Vignesh (non-technical) fill in a trip's **Overview, Description, Day-wise Plan, and Price Breakdown** through a simple form, and get back a polished, on-brand itinerary document — automatically laid out to match the studio-designed reference template, with no manual PowerPoint/Canva work per trip.

Reference file: `Eastern_Bhutan_Road_Expedition_-_2026.pptx` (provided). Treat it as the **visual and content spec** — the source of truth for what sections exist, what order they appear in, and how they should look. It is not the target output format (see [Output Format](#4-output-format-decision) below).

---

## 1. The problem

Today every itinerary is built by hand in a design tool. That doesn't scale: every new trip means re-laying-out text boxes, prices don't auto-total, inclusions/exclusions get copy-pasted and drift out of sync between trips, and a 6-day trip or a 21-day trip both have to be force-fit into a layout that was hand-built for 14 days across 4 fixed pages.

## 2. What we're building instead

A small web app with two parts:

1. **Builder** — a form where Vignesh enters trip content once, structured into fields (not free-form text dumps).
2. **Renderer** — takes that structured data and generates the branded itinerary document, with layout, pagination, and price totals handled automatically — so the output always looks like the reference template regardless of trip length.

This is the standard pattern behind tools like Travefy, TripCreator, or Journey: **structured data in → reusable branded template → generated document out.** We are building a lightweight, single-business version of that, not licensing one.

## 3. Content model

The reference deck breaks down into the four inputs Vignesh needs control over, plus supporting sections that are mostly boilerplate (write once, reuse across trips, edit occasionally). Everything below should be a typed field in the builder — not a rich-text blob — so the renderer can lay it out consistently.

### 3.1 Trip meta

| Field | Type | Example (from reference) |
|---|---|---|
| `tripName` | text | "Eastern Bhutan Road Expedition" |
| `tagline` | text | "Curated for explorers. Designed for stories." |
| `heroImage` | image upload | cover photo |
| `durationDays` | number | 14 |
| `maxAltitude` | text | "3000M" |
| `tempRange` | text | "15 to 22°C" |
| `startPoint` / `endPoint` | text | "Samdrup Jongkhar" → "Gelephu" |
| `totalDistanceKm` | number | 1385 |

### 3.2 Overview ("About the Expedition")

| Field | Type | Notes |
|---|---|---|
| `description` | long text (1–2 paragraphs) | the main "About" copy |
| `highlights` | list of `{title, text}` | reference shows 4 (The High East, Living Art, Sacred Cradles, Dramatic Geography) — should be add/remove-able, not fixed at 4 |
| `stayPreference` | `{title, text}` | e.g. "Comfortable Farmhouses & Hotels" |
| `foodPreference` | `{title, text}` | e.g. "Local food (veg & non-veg)" |
| `travelCadence` | list of short bullets | 3 in reference |
| `quote` | `{text, attribution}` | pull-quote block |

### 3.3 Description / Philosophy ("Expedition Focus and Philosophy")

| Field | Type | Notes |
|---|---|---|
| `philosophyIntro` | long text | intro paragraph |
| `pillars` | list of `{title, text}` | reference shows 4 (Slow Travel in the Valleys, Cultural Immersive Exploration, etc.) — add/remove-able |

### 3.4 Day-wise plan

This is the section that most needs good UX, since it's the bulk of the content and must handle **any** trip length.

Structure it as **phases (chapters)**, each containing days — this mirrors what the reference actually does (e.g. "Days 1–5: Eastern Gateway to the Nomadic Highlands", "Days 6–9: Heritage Valleys…"). Vignesh writes the phase title; the system doesn't invent it.

```json
{
  "itinerary": [
    {
      "phaseTitle": "Eastern Gateway to the Nomadic Highlands",
      "dayRangeLabel": "Days 1 - 5",
      "days": [
        {
          "dayLabel": "Day - 1",
          "title": "Arrival at Samdrup Jongkhar",
          "distance": "Approx. 100 km (3-4 hrs)",
          "altitude": "~250M",
          "overnight": "Samdrup Jongkhar",
          "description": "Immigration formalities and vehicle permits managed upon arrival from Guwahati…"
        }
      ]
    }
  ]
}
```

Notes for the builder UI:
- A "day" can span multiple calendar days (reference has "Days 4 & 5: Merak to Sakteng" as one card) — `dayLabel` should be a free-text string, not derived purely from an index.
- Need add / remove / reorder (drag) for both phases and days within a phase.
- **Pagination is automatic, not manual.** Don't make Vignesh decide what goes on which page. The renderer should flow phases onto pages and start a new page when a phase doesn't fit — see [§5](#5-pagination-logic).

### 3.5 Price breakdown

```json
{
  "pricing": {
    "currency": "INR",
    "lineItems": [
      { "label": "Transportation (SUV)", "amount": 40000 },
      { "label": "Accommodation (14 Days)", "amount": 40000 },
      { "label": "Meals (Breakfast & Dinner)", "amount": 10000 }
    ],
    "totalPerPerson": 150000,
    "paymentSchedule": [
      { "label": "Advance (20%)", "note": "At the time of booking", "amount": 30000 },
      { "label": "Remaining (80%)", "note": "15 days before trip", "amount": 120000 }
    ],
    "disclaimer": "Prices are subject to change based on availability and season…"
  }
}
```

Behavior:
- `totalPerPerson` should **auto-sum** from `lineItems`, with the field left editable in case Vignesh wants to override (discounts, rounding).
- `paymentSchedule` amounts should auto-calculate from the % in the label against the total, but stay editable — don't hard-lock the math.

### 3.6 Supporting sections (write-once, edit-occasionally)

These exist in the reference but change far less per trip. Model them as their own fields so they're still editable per trip, but don't force Vignesh to rewrite them each time — default to cloning from the last itinerary (see [§6](#6-functional-requirements)).

- `inclusions` / `exclusions` — two lists of short strings
- `advantages` — list of `{title, bullets[]}` (reference shows 8 cards in a 2-column grid, e.g. "Untouched Eastern Bhutan" / "Epic Mountain Roads")
- `accommodationComfort` — `{bullets[], closingStatement}`
- `safetyTeam` — `{bullets[], closingStatement}`

### 3.7 Global brand settings (not per-trip)

Configured once in an admin/settings area, not re-entered per itinerary:
- Logo, recognition/membership/partner logos (Startup India, MSME, Karnataka Tourism, Incredible India, ATOAI, etc.)
- Footer tagline "INDIA. SLOWER. BETTER", hashtag `#slowtravelling`, footer link labels
- Color palette and fonts (§8)

---

## 4. Output format decision

Check the reference file's actual page size before assuming it's a slide deck: it's built at **8.27" × 11.69" — A4 portrait**, not a 16:9 widescreen slide. So even though the source file is a `.pptx`, it was designed as a **portrait, print/PDF-style document**, one section per page. Build for that, not for a slide-deck aspect ratio.

**Recommended approach:** build the renderer as an HTML/CSS template (matching the brand tokens in §8), rendered in-browser for the live preview, and converted to PDF with a headless-browser print pipeline (e.g. Puppeteer/Playwright `page.pdf()`). This keeps preview and export pixel-identical, and it's far less brittle than generating `.pptx` XML per trip. A shareable read-only web link (same template, rendered live) is a natural bonus on top of this and worth including if time allows — clients can open it on a phone without downloading anything.

If you'd rather keep `.pptx` as the literal output (e.g. because Vignesh wants to hand-tweak individual trips afterward in PowerPoint), that's viable too — a Node script populating a `.pptx` template via `pptxgenjs` from the same JSON schema — but you lose the auto-pagination and live-preview benefits and gain a fair amount of layout brittleness as day-count varies. Confirm which matters more before starting.

## 5. Pagination logic

Because trip length varies (a 5-day trip and a 21-day trip both need to look intentional, not cramped or sparse), the day-by-day section needs rules, e.g.:
- Start a new page for each phase's title.
- Within a phase, flow day-cards down the page; if a phase's days overflow the page, continue the same phase onto a new page (repeat the phase header, as the reference does with "6.1 / 6.2 / 6.3" continuation labels).
- Keep a day-card from splitting across a page break.

Exact thresholds (cards per page, min/max font sizes) should be tuned visually against the reference — this is a QA pass, not a guess up front.

## 6. Functional requirements

- **Builder flow:** Trip meta → Overview → Philosophy → Day-by-day (phase/day editor with drag-reorder) → Pricing → Inclusions/Exclusions → Advantages → Accommodation/Safety → Review & Export.
- **Live preview** alongside the form, styled as the final document.
- **Duplicate an existing itinerary** as the starting point for a new one — this is the single highest-value feature, since most fields (philosophy, safety, inclusions, brand footer) repeat across trips almost unchanged.
- **Save as draft.**
- **Export to PDF**; shareable web link is a nice-to-have.

## 7. Non-functional requirements

- Single business owner + possibly a couple of team members — simple auth is enough, no need for complex role management.
- Any lightweight datastore is fine at this scale (e.g. Postgres via Supabase, or even SQLite) — don't over-engineer storage for what is currently a handful of trips.
- Must gracefully support trip lengths from a few days to several weeks (drives the pagination requirement above).

## 8. Design tokens (extracted from the reference file)

**Colors**

| Role | Hex |
|---|---|
| Base background | `#0A0A0A` – `#141414` |
| Card / panel background | `#1A1A1A` – `#272525` (several close shades layer cards on background) |
| Accent (brand orange — badges, highlights, checkmarks) | `#E8820C` |
| Heading text | `#FFFFFF` |
| Body text (on dark card) | `#CCCCCC`, or `#E5E0DF` on the itinerary day-cards specifically |
| Muted / secondary text | `#B7B7B7`, `#888888` |
| Exclusion marker (✗) | `#CC3333` |
| Dividers / borders | `#2A2A2A` |

**Typography**
- Headings / day badges / section labels: **Arial Black** or **Overpass Bold** (bold, high-impact, often uppercase)
- Body copy: **Inter** (or Calibri/Arial as fallback)

**Texture**
- A subtle topographic contour-line pattern sits behind all pages at low opacity — treat as a fixed background asset, not something Vignesh configures per trip.

Pull exact values from the unpacked `.pptx` XML if anything above needs double-checking — colors were sampled directly from the slide XML (`ppt/slides/slideN.xml`), not eyeballed.

## 9. Suggested stack

Not prescriptive — pick what your developer is fastest in — but this fits the requirements well:
- **Frontend:** React (Next.js) + Tailwind for the builder form and the HTML/CSS render template
- **PDF export:** Puppeteer/Playwright, printing the same template used for live preview
- **Storage:** Postgres (Supabase/Neon) — simple relational schema mirroring §3
- **Hosting:** Vercel or similar

## 10. Build checklist

- [ ] JSON schema formalized (TypeScript types / Zod) from §3
- [ ] Builder form for all sections, with add/remove/reorder for repeatable fields (highlights, pillars, days, phases, line items, advantages)
- [ ] Render template matching brand tokens (§8), one component per section
- [ ] Auto-pagination for the day-by-day section (§5)
- [ ] Price auto-sum + payment schedule auto-calc, both overridable
- [ ] PDF export pipeline (preview and export sharing one template)
- [ ] Save draft / duplicate-as-new-itinerary
- [ ] Global brand settings screen (logos, footer, links — §3.7)
- [ ] (Nice-to-have) shareable read-only web link per itinerary

## 11. Open questions to settle before/during build

- Keep output as a portrait multi-page PDF (matches reference exactly), or is a single long scrollable web page also acceptable for the shareable-link version?
- Any need to hand-edit a generated itinerary in PowerPoint afterward, or is PDF-only fine going forward?
- Per-day photos — not in the current reference, but worth asking if future trips want them, since it changes the day-card layout.
- How many people (besides Vignesh) need to log in and build itineraries?
