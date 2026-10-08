# Panasonic S-CLASS — Game training content V0.7

This content is derived from the customer-provided Panasonic S-CLASS catalog and should be reviewed when catalog/product specifications change.

The customer catalog is **【価格改定】パナソニック キッチン Sクラス.pdf**. Its local copy was available and inspected for V0.7. The V0.6 product knowledge copy originated from the customer's approved catalog-derived summaries; it remains unchanged. The V0.7 layout content was checked against the catalog's layout overview on printed pages 46–47 (PDF pages 48–49), with the L-shaped example on printed page 37 (PDF page 39). These are paraphrases, not long catalog extracts. No edition/date is inferred from the filename. Incorrect choices are distractors, not product claims.

## Sink

- **Catalog terminology:** Raku-Suru Sink; Sugo-Pika material.
- **Learning objective:** Recognize the construction and material features described as making wiping/cleaning easier.
- **Key points:** Low-step/gapless construction supports easier cleaning; Sugo-Pika has water- and oil-repellent properties; the catalog describes its pencil hardness as 9H.
- **Question:** Which feature helps make the Raku-Suru Sink easier to clean?
- **Choices:** A — deep joint between sink and countertop; B — gapless/low-step construction; C — raised metal frame; D — separate countertop insert.
- **Correct answer:** B — gapless/low-step construction.
- **Game use:** First learning card/question after all three installations; 100 points once; wrong answers retry with no score change; explicit Next Knowledge.

## Cooktop

- **Catalog terminology:** Flat Wide Cooktop series.
- **Learning objective:** Understand the horizontal zone layout and the described access/preparation/cleaning benefits.
- **Key points:** Zones are horizontal; multiple pots are easier to access/use; the front area supports preparation/plating; a small cooktop-to-counter height difference helps wiping.
- **Question:** What is a key advantage of the Flat Wide cooktop layout?
- **Choices:** A — horizontal zones for easier access; B — no range hood needed; C — automatic counter-height increase; D — zones all behind one another.
- **Correct answer:** A — horizontal zones for easier access.
- **Game use:** Second learning card/question; 100 points once; wrong answers retry; explicit Next Knowledge.

## Range Hood

- **Catalog terminology:** Hottoku Clean Hood 15; Raku-Wash plate/ring.
- **Learning objective:** Distinguish reduced fan maintenance from normal plate and surface cleaning.
- **Key points:** The system reduces fan maintenance. Under the catalog's stated conditions, fan cleaning is approximately once in 15 years. The Raku-Wash plate/ring is normally removed for cleaning about once per year. Normal surface maintenance/wiping remains necessary.
- **Question:** According to the S-CLASS catalog, about how often is the Raku-Wash plate normally removed for cleaning?
- **Choices:** A — every day; B — every week; C — about once a year; D — never requires cleaning.
- **Correct answer:** C — about once a year.
- **Game use:** Third learning card/question; 100 points once; success completes Product Knowledge at 900. Customer Scenario Training begins only through its explicit Start action.

The 15-year statement belongs specifically to the catalog's **Hottoku Clean Hood 15** concept and its stated conditions. It must not be applied to every range hood model or presented as a no-cleaning claim. These cards teach catalog product concepts; they do not assert that every current configurator option has every catalog feature.

## Implementation and review

- Task/content structure and correct-choice IDs: `src/data/sClassGameContent.ts`.
- Visible copy: organized `game_knowledge_*` keys plus phase/action labels in `src/i18n/translations.ts`, for Japanese, English and Myanmar.
- Presentation: stateless React learning card; scoring/progression stay in App. No new Three.js product behavior.
- Three fixed questions, four answers each, 100 points per correct question, no randomization or persistence.
- Review content and all translations together against the approved catalog when the catalog or specifications change. Original catalog conditions are not expanded or invented in this version.

## Customer Scenario / Layout Training

Mappings describe the geometry actually implemented in `KitchenViewport3D.tsx`. They are concept previews, not exact catalog installation plans or a room design service. Existing configurator names are reused; descriptive marketing text in the configurator is not evidence of geometry.

| Application ID | Actual arrangement | Catalog mapping and limits |
| --- | --- | --- |
| `type-i` | One straight 2550 × 650 mm counter along the rear wall; Sink and Cooktop share it and mirror with Sink side. | Clear wall I-Type (`壁付けI型`) concept: one row. |
| `type-l` | Main 2550 × 650 mm run plus a connected perpendicular 1150 × 650 mm return. Sink and Cooktop both remain on the main run. | L-Type (`壁付けL型`) counter footprint. Catalog examples place equipment on different legs; this application does not. No work-triangle or shorter walking-distance claim is taught. |
| `face-to-face` | One 2550 × 933 mm straight counter with rear finish; both products together. Studio rear wall and backsplash remain behind it. | Label suggests a peninsula/facing arrangement, but its modeled room does not establish the catalog's open facing/peninsula relationship. Excluded as a correct scenario. |
| `type-ii` | Two parallel 2550 × 650 mm counters; front Sink row and rear wall Cooktop/Hood row. | Broad II-Type (`II型`) concept: separate Sink and cooking rows. No named Sink-facing/Island subtype is claimed. |
| `island` | Same counter construction and room placement as `face-to-face`, including the nearby rear wall and backsplash. | Catalog island concept requires an independently accessible island; this geometry does not demonstrate it. Excluded. |

### Scenario 1 — One straight wall row

- **Catalog concept:** Wall I-Type; printed page 46.
- **Application layout ID:** `type-i`.
- **Learning objective:** Recognize that Sink and cooking equipment share one straight row.
- **Customer requirement:** Sink and cooking equipment together in one straight row along the wall.
- **Correct answer:** Existing configurator I-Type name.
- **Rationale:** Both products occupy one straight wall counter.
- **Points:** 100 once.

### Scenario 2 — Two parallel working rows

- **Catalog concept:** II-Type; printed page 46. Only the broad two-row concept is used.
- **Application layout ID:** `type-ii`.
- **Learning objective:** Distinguish separate parallel Sink and cooking rows from a single row.
- **Customer requirement:** Separate the Sink side and Cooktop side into two parallel working rows.
- **Correct answer:** Existing configurator II-Type name.
- **Rationale:** Sink and cooking zones occupy different parallel counters.
- **Points:** 100 once.

### Scenario 3 — Connected L-shaped worktop

- **Catalog concept:** L-Type footprint; printed pages 37 and 46.
- **Application layout ID:** `type-l`.
- **Learning objective:** Recognize a connected worktop with a perpendicular return.
- **Customer requirement:** One connected worktop that turns at a right angle, with preparation space on the return.
- **Correct answer:** Existing configurator L-Type name.
- **Rationale:** The counter forms an L. In this application, both products remain on the main run and the return provides extra worktop space. The catalog's exact equipment arrangement is not reproduced.
- **Points:** 100 once.

### Scenario implementation and review

- Readonly scenario data: `src/data/sClassLayoutScenarios.ts`, using existing `PlanLayoutId` and configurator name keys.
- Stateless card: `src/components/CustomerScenarioCard.tsx`; four choices each, no randomization.
- Localized requirements and rationales: `game_scenario_*` keys, with Japanese/English/Myanmar phase/action labels in `translations.ts`.
- Answers change only score/feedback. Only **View Recommended Layout** applies the layout through the existing App configuration setter. Wrong answers do not rebuild the kitchen.
- Explicit Next Customer follows the first two previews; the third preview completes training at 1200. Pre-scenario configuration is captured in full and restored on Return to Explore.
- Existing dimension inconsistencies are not taught: Type II's implementation uses two 2550 mm rows, despite the option's 2550 + 1800 mm text; its modeled aisle is 300 mm despite a 900 mm code comment. V0.7 makes no dimension, clearance, compatibility or installation suitability claims.
