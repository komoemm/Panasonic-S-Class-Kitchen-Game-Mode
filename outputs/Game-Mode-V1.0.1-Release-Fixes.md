# Game Mode V1.0.1 — Release Blocker Fixes

Date: 2026-10-08. Status: **implemented local review candidate; NO-GO for general public release until the gates below pass.** No commit, push, merge, reset, branch change, Desktop-clone copy or deployment was performed.

## 1. Verified development baseline

| Item | Evidence / result |
| --- | --- |
| Codex source | `C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/Panasonic-Kitchen-S--CLASS` |
| Local published verification source | `C:/Users/OE-DKP-20-006/Documents/GitHub/Panasonic-S-Class-Kitchen-Game-Mode` |
| Branch in both | `codex/game-mode-development` |
| Desktop published checkpoint | `42c2c8daf224e03e866ad437c53bcf3f3191acd0`, containing the V1.0 audit and accepted V0.9 source |
| Pre-change verification | All 41 Desktop-tracked files matched the Codex working files by SHA-256; Desktop working tree clean |
| Audit SHA-256 | `BDF4AE1415A0820D488439CF5E2EE06EEBA74EC1DC5C2FBE3EDE95BF78D62BB0` |
| Codex Git HEAD | `8efc53aaad1ba852f41ed7046bcbeffee99a4aa5`; older history is expected, and accepted working files were preserved |
| Final Desktop inspection | Same branch/checkpoint; `git status --short` empty; no files copied there |

The authorized Desktop clone verifies the published local checkpoint; this does not independently establish the current network GitHub tip. Baseline proof: `C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/v101-baseline-proof.json`.

Read completely: CODEX_HANDOFF.md, docs/S_CLASS_GAME_CONTENT.md, V0.7/V0.8 reports, V0.9 Asset Audit/Visual Pass reports, V1.0 Release Readiness Audit and the supplied full V1.0.1 specification. Historical handoff proposals were treated as context. Accepted V0.9 files and the V1.0 audit governed implementation.

## 2. P1 implementation summary

| Finding | Local technical result | Release status |
| --- | --- | --- |
| P1-01 WebGL unavailable | Localized fallback, guarded initialization, Retry, context interruption/restoration and synchronous graphics gating | PASS in injected Chrome production tests; hardware verification pending |
| P1-02 accessible training | Product choice buttons and incremental placement controls share existing task locks, measured validation and exact snap | PASS keyboard and emulated touch journeys; screen-reader/physical-device acceptance pending |
| P1-03 claims | Unsupported structured commercial assertions removed; proposed concept/layout/estimate wording qualified; approval matrix created | New public copy/pricing/brand acceptance **PENDING** |
| P1-04 blueprint | Existing schematic restricted to I-Type; other four layouts show unavailable explanation; no construction/scale precision claim | PASS five layouts in JA/EN/MM; proposed public wording **PENDING** |
| P1-05 reproducibility | Working direct versions pinned, Node/pnpm policy, valid lockfile, documented frozen install, advisory/dist review | Diagnostic fresh frozen installation/build PASS; independent unrestricted clean build **NOT TESTED** |

### P1-01: graphics failures and recovery

`KitchenViewport3D.tsx` probes WebGL2 using the same canvas/context supplied to the existing single `WebGLRenderer`. Initialization failure clears unused scene/camera references, reports no available products, and renders a localized readable overlay with Retry. The application root, configurator and React game/configuration state remain available. Training start and graphics-dependent identification/installation actions are blocked while graphics are unavailable.

Context-loss listeners prevent default permanent loss, cancel an active drag safely and discard a pending selection gesture. Rendering pauses while interrupted. Restoration resumes the existing renderer, canvas and scheduled animation loop. Retry requests restoration of a lost context; when that is unsupported, the unavailable path permits a fresh setup through the existing setup/cleanup effect. The two context listeners are removed before renderer disposal/forced loss. Startup failure has no live canvas/renderer RAF; recovery has one connected canvas and one pending renderer RAF.

`App.tsx` keeps a synchronous graphics-ready ref so an old callback cannot score between a context event and React's render. No separate game scene, renderer or Raycaster was added. A recovered in-place context preserves the same installation clone/position; a failed context requiring setup follows existing lifecycle reconstruction while retaining React task/score/configuration state.

### P1-02: accessible identification and measured installation

New `AccessibleTrainingControls.tsx` provides three keyboard/tap product choices without preselecting an answer. They call the existing identification handler; incorrect choices retain task/score, correct choices award the existing 100 points once, and progression remains explicit.

Installation controls move the **existing staged clone** in 10 cm world-axis increments: X/Z for Sink/Cooktop and X/Y for Range Hood. Reset returns to the same staging position. Localized instructions, signed target offsets and tolerance are announced through a polite live status. Controls have visible focus and at least 48 px height. Keyboard focus follows accepted success/Next actions; the canvas does not trap Tab. Offset state refreshes when controls receive focus after a pointer drag.

`confirmProductInstallation` is the shared path extracted from the former pointer-release validation. Both drag release and accessible Confirm use the same measured planar `Math.hypot` distance, existing tolerance (20% of the live product's smaller placement-plane dimension), wrong-position reset, exact inverse-group × target-world matrix decomposition, helper hiding and existing `onInstallationDrop` callback. Pressing Confirm at staging fails and awards nothing. Movement/reset/preview never award points.

Controllers require the current installation owner, product/task, game mode, ready graphics, no active drag and unlocked state. App task-phase locks are synchronous; active task IDs and a session epoch reject repeated/stale callbacks, including obsolete Start/Return actions across replay. No second scoring engine or automatic progression was introduced.

### P1-03: content accuracy and approval

See [V1.0.1_CONTENT_APPROVAL_MATRIX.md](../docs/V1.0.1_CONTENT_APPROVAL_MATRIX.md). Every grouped claim records existing wording/value, source location, concern, proposed action, evidence, approval requirement and APPROVED/PENDING/NOT APPLICABLE status.

The local review candidate:

- Replaces unqualified Hood “10 years maintenance-free” and inconsistent upgrade naming with generic conceptual wording pointing to the accepted qualified Hood 15 knowledge explanation.
- Describes actual L main-run/preparation-return geometry; qualifies Facing/Island access and Type II parallel rows rather than claiming a verified work triangle, dual island or 360-degree access.
- Aligns Type II model dimensions to two 2550 × 650 rows, explicitly as model values; removes the unsupported numerical Hood top-height and universal I-Type dimension badge/summary.
- Labels wizard/entry points, quotation totals and the example 10% tax as illustrative, unverified samples; localizes auxiliary quotation labels. Pricing arithmetic and sample amounts remain unchanged.
- Removes Product/Offer/WebApplication commercial JSON-LD containing unverified SKU, stock, offer amounts, validity date and old preview identifiers. Removes the old static canonical fallback while retaining the existing serving-origin canonical script; no domain/hosting configuration changed.

These proposed public-facing translations are **PENDING customer and native-language review**, not newly approved product specifications. No warranties, prices, stock or maintenance intervals were invented. Both accepted content data modules and all **120 existing knowledge/scenario translation entries** are unchanged. Existing acceptance of those training summaries does not establish manufacturer endorsement or brand/redistribution rights. No reference catalog images or new models were added.

### P1-04: drawing scope

The existing SVG appears only for `type-i`. `type-l`, `face-to-face`, `type-ii` and `island` receive a localized unavailable message. Displayed content is labeled “Concept Illustration — Not a Construction Drawing” and not to scale. Precision badges, scale notation and dimension/coordinate callouts were removed. Generic product, preparation and handedness labels remain. The schematic is not an exact configured bill of units or validated access-clearance plan. No drawing engine or 3D geometry changed.

## 3. P1-05: runtime, lockfile and installation evidence

Policy: **Node.js `>=24.19.0 <25`**, tested 24.19.0 recorded in `.nvmrc`; **pnpm 11.25.0** pinned in `packageManager` and engines. `pnpm-workspace.yaml` applies strict engine checks and disables dependency lifecycle scripts. No application dependency was added/upgraded blindly. The duplicated Vite manifest entry was reduced to its devDependency entry.

All 21 pinned direct package versions matched both the previously working installation and the fresh diagnostic installation:

| Runtime packages | Versions |
| --- | --- |
| @google/genai, @tailwindcss/vite, @vitejs/plugin-react | 2.24.0, 4.3.3, 5.2.0 |
| canvas-confetti, dotenv, express, lucide-react | 1.9.4, 17.4.2, 4.22.3, 0.546.0 |
| motion, react, react-dom, three | 12.43.0, 19.3.0, 19.3.0, 0.186.1 |
| @types/canvas-confetti, @types/express, @types/node, @types/three | 1.9.0, 4.17.25, 22.20.4, 0.186.0 |
| autoprefixer, esbuild, tailwindcss, tsx, typescript, vite | 10.6.1, 0.25.12, 4.3.3, 4.23.15, 5.8.3, 6.4.3 |

`pnpm-lock.yaml`: version 9, 2870 lines, SHA-256 **`30DE323A67CA2F7B1BA89BE8F21664D7A6466451A2E29CA4AB1A2D8B05588BC3`**. This hash was checked against the actual generated file; resolved transitive versions are recorded by this lock, not claimed byte-identical to every former transitive installation.

| Validation | Result / qualification |
| --- | --- |
| Raw lockfile installation attempt | FAIL: sandbox `EPERM` native realpath |
| Preload plus external writable store attempt | FAIL: pnpm store-registration symlink denied |
| Lockfile-only generation with preload and store inside isolated project | PASS: valid root importer, resolved graph and integrity hashes |
| Default frozen install with preload | FAIL: dependency symlinks denied after packages were fetched |
| Fresh supported hoisted/frozen-store install with preload | PASS: new `node_modules`, 220 packages added, 218 reused, zero downloaded in this run; manifest/lock frozen |
| Normal build without diagnostic overrides | FAIL in this sandbox: realpath/dependency verification filesystem restrictions before application build |
| Fresh diagnostic lint + production build | PASS in isolated hoisted directory; English production journey also passed |
| Final source diagnostic lint + build | PASS, `tsc --noEmit`, Vite 6.4.3, 1696 modules; final build 30.35 seconds |
| Independent unrestricted clean install/build | **NOT TESTED**; mandatory release gate |
| `pnpm audit --json` | PASS exit 0; 0 info/low/moderate/high/critical findings for reported 314 dependency entries at validation time |
| Production asset references | PASS: 7 generated files; checked local JS/CSS references exist |
| Public dist credential-signature scan | PASS: no matches for tested API-token/private-key signatures; not an exhaustive security certification |
| Commercial metadata check | PASS: removed SKU/stock/price-date/offer/old preview assertions absent from final HTML |
| `git diff --check` | PASS after whitespace cleanup and on final rerun, exit 0; only existing line-ending policy warnings |

Evidence and isolated installs are **outside the application repository** in the parent `work` directory: `v101-clean-install`, `v101-clean-hoisted`, `v101-pnpm-cache`, `v101-advisories.json`. The successful frozen hoisted command was:

```powershell
pnpm install --frozen-lockfile --frozen-store --node-linker=hoisted --ignore-scripts --store-dir ../v101-clean-install/.pnpm-store --cache-dir ../v101-pnpm-cache --fetch-retries 0 --fetch-timeout 10000
```

Diagnostic lint/build used the bundled Node/pnpm on PATH and these environment settings, followed by normal `pnpm run lint` and `pnpm run build`:

```powershell
$env:NODE_OPTIONS='--require=C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/v08-validation-preload.cjs'
$env:pnpm_config_verify_deps_before_run='false'
```

The external preload handles denied realpath calls beneath the authorized workspace and the existing Vite runner condition. It does not bypass dependency symlink permission checks, is not imported by application source, and is not a production dependency. The pnpm override prevents pnpm 11 from implicitly reinstalling the pre-existing diagnostic dependencies. Normal README instructions use `pnpm install --frozen-lockfile` without these overrides. A diagnostic clean install is not an independent unrestricted clean production build.

The unchanged large viewport chunk warning remains: 645.28 kB minified / 163.30 kB gzip. `vite.config.ts` is unchanged. Source and isolated builds were not asserted byte-identical.

## 4. Small P2 fixes

- Document language follows JA `ja`, EN `en`, and internal MM `my`.
- Blueprint/Quotation use a shared `useModalFocus`: named dialog semantics, entry focus, Tab/Shift-Tab containment, Escape close, listener cleanup and return focus to the opener.
- Clipboard denial or absent Clipboard API is caught; localized explanation and a selectable read-only manual-copy textarea are provided. Decorative confetti failure does not turn successful clipboard writing into a false copy-error report.
- Shared ignore rules protect `.env*`, explicitly allowing `.env.example`; production/staging/secret variant checks pass. No credentials were introduced.
- Reduced motion disables decorative fan/water/burner motion, uses immediate existing camera/explode/door transitions, and avoids quotation confetti. CSS suppresses motion transitions. Placement axes, timing rules, tolerance and scoring are unchanged. Browser preference changes do not recreate the renderer.

These improvements are not a full WCAG certification; physical screen-reader and motor-access testing remains required.

## 5. Production-browser validation

Tests use installed Chrome headless with Playwright/CDP, software WebGL (`--enable-unsafe-swiftshader`), and exact generated production bytes routed to a local fixture origin. Existing React refs/callbacks are inspected only by external harnesses; there are no production test hooks. Real mouse/CDP touch input exercises raycasting and drag; direct repeated/stale callbacks exercise synchronous locks. Google Fonts requests are deliberately blocked separately from application errors. This validates fallback-font/browser emulation, not actual CDN/HTTPS hosting, a physical mobile GPU, Safari or assistive technology.

Evidence root:
`C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs`

| Suite / evidence filename | Reported checks | Result / scope |
| --- | ---: | --- |
| game-mode-v1.0.1-initial-full-browser-results.json | 169 | PASS; raycast/drag full journey, JA/EN/MM 1440×900 and EN touch 390×844 |
| game-mode-v1.0.1-exit-results.json | 10 | PASS; scenario exits, all seven steps/five layouts, configured finishes/upgrades/restoration |
| game-mode-v1.0.1-v06-regression-hood-cleanup-results.json | 7 | PASS; cancel/capture loss/rebuild/Return during drag, world snap, tolerance and stale drop locks |
| game-mode-v1.0.1-v06-regression-exit-results.json | 37 | PASS; knowledge Q1/Q2/Q3 exits by mouse/keyboard/touch |
| game-mode-v1.0.1-extra-results.json | 13 | PASS; unsupported/failed AudioContext, opt-in/off, orbit and phone headers in all languages |
| game-mode-v1.0.1-final-ui-results.json | 10 | PASS; final UI/review/restoration, JA/EN/MM desktop, EN 390 and MM 430; rerun after final label changes |
| game-mode-v1.0.1-touch-430-browser-results.json | 43 | PASS; English full native-touch emulation, 430×844, fresh locked diagnostic build |
| game-mode-v1.0.1-tablet-browser-results.json | 43 | PASS; English full native-touch tablet emulation, 768×1024, fresh locked diagnostic build |
| v101-accessible-results.json | 20 | PASS; JA/EN/MM keyboard desktop and EN 390 tap controls; full 1200 flow, wrong placement, measured snap, duplicate/stale locks and replay |
| v101-failure-results.json | 27 | PASS; unavailable/injected renderer failure in 3 languages, Retry/context interruption, five-layout dialogs/clipboard/focus; rerun on final build |
| v101-motion-results.json | 1 | PASS; preference changes stop/resume decorative frames without renderer recreation |
| game-mode-v1.0.1-browser-results.json | 43 | PASS; final interaction-guard build, English desktop full journey from the fresh locked diagnostic build |

These are grouped checks containing multiple assertions, not unit-test or coverage counts. The accepted eight regression suites account for 332 checks; additional targeted suites cover the new fixes. Validation was incremental: after the final wording-only changes, lint/build and targeted failure/dialog/final-UI suites were rerun; all earlier suites were not repeated needlessly.

### Verified preserved gameplay and Explore behavior

Identification reaches 300; installation 600; knowledge 900; scenarios 1200. Wrong selections/answers/drops never score or advance. Correct tasks score once; double Next and obsolete callbacks cannot skip. Sink/Cooktop retain horizontal drag, Hood vertical drag, exact world-matrix snapping, independent Hood light target, clone/shared-resource ownership and helper cleanup. Orbit movement does not submit identification.

Scenario answers leave configuration unchanged until explicit preview; preview uses the existing config setter and never scores. Original nested upgrades, Type II/right-Sink configuration, finishes, dishwasher, wizard step, Focus Mode and suspended isolation/exploded settings restore on Return. Camera presets and configuration rebuilds remain usable. Replay returns to Find Sink, Task 1/3, score 0.

Final results show all four categories 3/3, each 300/300, total **1200/1200**; the twelve-item review does not change score/configuration. Default audio is silent; sound on/off and unavailable/constructor/resume failures remain safe. Desktop, 390/430 phone and 768 tablet emulations show no page horizontal overflow, one connected canvas, one settled pending renderer RAF and stable listener cleanup.

Normal and final accessibility/UI runs record no unexpected page/console errors. Failure injection deliberately produces exactly three `THREE.WebGLRenderer: Injected renderer initialization failure` console messages, classified by their exact injected text; they are recorded separately, not globally suppressed. No unhandled application rejection occurred in final clipboard/graphics tests.

### Failed attempts and harness corrections

Earlier harness runs failed on an old installation hint expectation, a desktop-only focus expectation after native touch, unsettled entry-animation RAF accounting, injected renderer console-error accounting, an obscured static Cooktop test point and a drag starting outside the scrolled viewport. Fixtures were corrected to use current localized text, keyboard-only focus expectations, settled measurements, exact injected-error classification, a visible static cabinet point and scrolling before projection. The later Hood and knowledge-exit suites passed without changing drag geometry/raycast behavior to satisfy the fixture.

A stale-Start check initially ran the preceding bundle before its concurrent replacement build finished; it passed on the completed build. One failure-suite navigation timed out at 10 seconds during concurrent software-rendered runs; sequential rerun with a 45-second navigation limit passed, while state assertions retained their bounds. These failed attempts are not counted as successful checks. Raw install/build failures remain explicitly unresolved environmental limitations above.

## 6. Three.js lifecycle measurements — no refactor

Evidence: `v101-performance/performance-results.json` and `v101-memory/memory-results.json` beneath the evidence root.

- 25 configuration updates: 26 renderer contexts created, 25 disposals/forced losses, 150 tagged root additions, equivalent to **50 kitchen constructions after initialization (two per update)**. Settled canvas/renderer RAF count remains one.
- Default I-Type: 156 renderer geometries, 12 textures, approximately 369 draw calls / 13,842 rendered triangles. Island/oak sample: 157 geometries, 14 textures, 372 calls / 13,878 triangles. Repeated equivalent I/oak settings settle at 156 geometries/14 textures.
- With decorative effects active: 65 rendered frames per 2.5 seconds in software WebGL. Effects off and settled: zero; simulated hidden document: zero. Reduced-motion targeted test also settles at zero decorative frames, resumes on preference removal and stops again without creating another renderer.
- Forty repeated same-config updates with two forced-GC/settling passes per sample:

| Updates | Used JS heap bytes | Contexts / disposals | Live geometries / textures |
| ---: | ---: | ---: | ---: |
| 0 | 7,882,608 | 1 / 0 | 156 / 12 |
| 10 | 10,182,980 | 11 / 10 | 156 / 12 |
| 20 | 10,468,476 | 21 / 20 | 156 / 12 |
| 30 | 11,532,216 | 31 / 30 | 156 / 12 |
| 40 | 12,498,840 | 41 / 40 | 156 / 12 |

The 40-update run has 240 root additions, equivalent to 80 reconstructions after initialization, one settled renderer RAF and no application errors. Heap growth/context churn are reproduced; stable live renderer resource counts do not prove zero retention, and this run does not establish an unbounded leak or release-blocking crash. No scene-lifecycle optimization was attempted. Long physical-device sessions and retainer analysis remain separate work/gates.

## 7. Changed files and eventual Desktop publication list

Compare against the verified 41-file Desktop baseline, **not** the older Codex HEAD. Thirteen existing files changed and seven files are new:

| Path | Change |
| --- | --- |
| .gitignore | Shared env-variant protection/example exception |
| .nvmrc | New tested Node runtime pin |
| README.md | Runtime/frozen-install/diagnostic/release instructions |
| index.html | Remove unverified commercial structured metadata and qualify concept description |
| package.json | Pin working direct versions, Node/pnpm engines and packageManager |
| pnpm-workspace.yaml | New engine/script policy |
| pnpm-lock.yaml | New resolved dependency lock |
| src/App.tsx | Graphics state, accessible controls, synchronous guards/epochs, lang/focus/concept copy |
| src/components/AccessibleTrainingControls.tsx | New identification/movement/confirmation UI |
| src/components/BlueprintModal.tsx | I-Type scope, conceptual labels, modal focus |
| src/components/KitchenViewport3D.tsx | Graphics recovery, shared confirmation/controllers, reduced motion, layout badge |
| src/components/KitchenViewportSkeleton.tsx | Localized graphics startup message |
| src/components/QuotationModal.tsx | Illustrative/localized presentation, clipboard fallback, modal focus |
| src/data/configOptions.ts | Type II model-dimension text correction |
| src/i18n/translations.ts | JA/EN/MM fixes/new labels; accepted knowledge/scenario entries preserved |
| src/index.css | Reduced-motion rules |
| src/types.ts | Shared graphics status/installation controller types |
| src/utils/useModalFocus.ts | New reusable modal focus hook |
| docs/V1.0.1_CONTENT_APPROVAL_MATRIX.md | New customer approval matrix |
| outputs/Game-Mode-V1.0.1-Release-Fixes.md | This report |

Do not copy the validation harnesses, screenshots, isolated installs/stores, preload or dist as source changes. **No files have been copied to GitHub Desktop by this task.** An eventual copy/publication requires the user's review and instruction.

All other 28 previously published files remain byte-identical, including TopBar, StepWizard, TrainingJourney/TrainingResults, knowledge/scenario data/cards, trainingAudio, pricing, vite.config.ts, .env.example, accepted content documentation and previous reports. V0.9 procedural geometry/materials/lighting remain unchanged within the viewport file.

Approximate normalized source diff against the published baseline: application/HTML **+553 / −312 lines**; all changed/new files excluding lockfile and this report **+660 / −370**. The generated lock adds 2870 lines. Counts normalize line endings/trailing whitespace and use difflib; they are not raw older-HEAD Git statistics.

## 8. Unresolved release gates and recommendation

| Gate | Current status / required action |
| --- | --- |
| Independent production build | NOT TESTED: run normal clean `pnpm install --frozen-lockfile`, lint/build/audit and production smoke tests on unrestricted workstation/CI without the validation preload |
| Customer content | PENDING: approve proposed Hood/layout/dimension/concept/quotation/metadata presentation in the matrix |
| Pricing and commercial use | PENDING: approve sample-only purpose or provide authorized current supplier/market/tax data; estimates are not ordering documents |
| Languages | PENDING native JA/MM/customer review; functional localized flows pass, linguistic approval is separate |
| Branding/rights | PENDING final customer/manufacturer/asset-distribution acceptance; no new catalog assets were redistributed |
| Accessibility | NOT TESTED on actual screen readers/assistive technology; complete keyboard/motor-access acceptance on target platforms |
| Hardware/browser | NOT TESTED on physical phones/tablets or Safari/target GPUs; verify graphics recovery, long-session context/heap behavior, layout, drag and non-drag controls |
| Hosting | NOT TESTED real selected HTTPS origin, headers/CSP, font access, cache/security configuration or deployment smoke tests; no hosting change made |
| Lifecycle/bundle | Known context churn, two rebuilds per config and observed heap growth remain; chunk warning remains. Schedule separately if hardware findings require it |

**Recommendation: GO for customer review of this local V1.0.1 candidate; NO-GO for general public deployment today.** Safely implementable technical fixes are complete in the tested environment and the 1200-point journey is preserved. Content approvals, unrestricted reproducibility, physical/assistive-device tests and hosting acceptance are not replaced by passing diagnostic browser tests.

No V1.0.1 commit, push, merge, reset, branch change, `.git` modification, Desktop-clone copy or deployment was performed. Await the user's review before publication.
