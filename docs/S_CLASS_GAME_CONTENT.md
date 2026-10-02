# Panasonic S-CLASS — Game training content V0.6

This content is derived from the customer-provided Panasonic S-CLASS catalog and should be reviewed when catalog/product specifications change.

The source for this version is the customer's approved catalog-derived summaries supplied with the V0.6 request. No catalog edition or page numbers were provided. The text below summarizes those points; it adds no product performance claims. Incorrect choices are question distractors, not product claims.

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
- **Game use:** Third learning card/question; 100 points once; success completes training at 900.

The 15-year statement belongs specifically to the catalog's **Hottoku Clean Hood 15** concept and its stated conditions. It must not be applied to every range hood model or presented as a no-cleaning claim. These cards teach catalog product concepts; they do not assert that every current configurator option has every catalog feature.

## Implementation and review

- Task/content structure and correct-choice IDs: `src/data/sClassGameContent.ts`.
- Visible copy: organized `game_knowledge_*` keys plus phase/action labels in `src/i18n/translations.ts`, for Japanese, English and Myanmar.
- Presentation: stateless React learning card; scoring/progression stay in App. No new Three.js product behavior.
- Three fixed questions, four answers each, 100 points per correct question, no randomization or persistence.
- Review content and all translations together against the approved catalog when the catalog or specifications change. Original catalog conditions are not expanded or invented in this version.
