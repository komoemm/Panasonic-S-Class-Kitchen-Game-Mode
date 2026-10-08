# Game Mode V0.7 — Customer Scenario / Layout Training

Validated on 2026-10-05. Branch: `codex/game-mode-development`.

V0.7 adds three catalog-mapped customer scenarios after the accepted identification, installation and product knowledge phases. Final score: **1200**, with all four completion counts **3 / 3**. No commit, push, merge, reset, branch change or deployment was performed. The GitHub Desktop clone was read only.

## 1. V0.6 local/Desktop SHA-256 verification

Source: `C:\Users\OE-DKP-20-006\Documents\Codex\2026-10-01\read-codex-handoff-md-completely-then\work\Panasonic-Kitchen-S--CLASS`.

Verification source: `C:\Users\OE-DKP-20-006\Documents\GitHub\Panasonic-S-Class-Kitchen-Game-Mode`.

Desktop was clean on `codex/game-mode-development`, at published V0.6 commit `6e835be56258ed96a3a2db54c123c700adc83929` (`v0.6`). All six files matched byte for byte before implementation:

| File | Matching SHA-256 in both repositories |
| --- | --- |
| `src/App.tsx` | `062457797AC748C63507F3DE6A4E093101CFCF1973606D1F77897E4433474EC1` |
| `src/i18n/translations.ts` | `B0A0F5D8FB8A2F3B3F045AE51902C920E059BDD3446B68D2D1A28DB44A41FC01` |
| `src/data/sClassGameContent.ts` | `1D4929F97F511DFFFE845FC90CED25FF8D3A766D9DF691BB2EBF43AAB33C9BDA` |
| `src/components/ProductKnowledgeCard.tsx` | `8CF1020CDC6CDA94DAA6DEC481DE4F4E90317327E965D8900DD162033E33C524` |
| `docs/S_CLASS_GAME_CONTENT.md` | `A3581B1E25A1295DC5D18B3EC812BDDA3E58F9E250C0EACF16AE39CC398DEC40` |
| `outputs/Game-Mode-V0.6.md` | `6773DBEDE6DB1B8A6E1100F61291B0E0B6B45B93977F550B665490DA1BF1DC89` |

The accepted working V0.6 was retained as the development baseline. Local HEAD remains `8efc53aaad1ba852f41ed7046bcbeffee99a4aa5`; its uncommitted V0.6 additions were preserved, not reset to that older commit. A byte-for-byte baseline copy and SHA proof were saved outside the repository in `work/v07-baseline-v06` and `work/v07-v06-sha256-proof.json`. No network fetch was required.

## 2. All five existing application layouts

Inspection covered `PlanLayoutId`, `PLAN_LAYOUTS`, configurator names, `StepWizard.handleSelectLayout`, and `KitchenViewport3D.rebuildKitchenScene`. Findings were reported before implementation.

| ID | Configurator display name (English / Japanese) | Actual geometry and Sink/Cooktop relationship | Counter arrangement / orientation |
| --- | --- | --- | --- |
| `type-i` | Type I (2550mm Straight) / I型 (2550mm) | One 2.55 × 0.65 m straight counter; Sink and Cooktop together, mirrored with Sink side. | One wall-facing straight run. |
| `type-l` | L Type (Corner) / L型 (Corner) | Main 2.55 × 0.65 m run with a connected perpendicular 1.15 × 0.65 m return. Both products remain on the main run. Existing `lReturnTop` adds the return slab to `counterGroup`; `lReturnCarcass` adds its cabinet to `baseCabinetGroup`. | One connected L-shaped worktop, built from main and return slabs. Main run follows the rear wall; return extends into the room. No adjacent room wall is modeled at its corner. |
| `face-to-face` | Face to Face (Peninsula) / 対面型 (Peninsula) | One 2.55 × 0.933 m straight counter with rear finish; both products share it. | Intended facing label, but the modeled studio wall and backsplash remain close behind it. A peninsula wall connection/open dining relationship is not established. |
| `type-ii` | Type II (Parallel) / II型 (Parallel) | Two 2.55 × 0.65 m parallel rows. Sink counter center Z = +0.50 m; Cooktop counter center Z = -0.45 m. Products mirror in X with Sink side. | Separate front Sink row and rear wall-facing Cooktop/Hood row. |
| `island` | Island (Center) / アイランド型 (Center) | Uses the same `isPeninsula` construction path as `face-to-face`, including one 2.55 × 0.933 m counter, rear finish, wall and backsplash. Both products share the counter. | No distinct freestanding, walk-around island arrangement is implemented. |

Existing Type II discrepancies are documented, not changed: both rendered rows are 2550 mm despite the option's 2550 + 1800 mm text; the modeled counter gap is 300 mm despite a 900 mm comment. Scenarios do not teach dimensions or installation clearances.

## 3. Exact catalog-to-application mappings

Source catalog: **【価格改定】パナソニック キッチン Sクラス.pdf**, read from the customer's Downloads folder. The full layout overview was visually inspected on printed pages **46–47** (PDF pages 48–49), plus the L-shaped example on printed page **37** (PDF page 39).

- `type-i` → **壁付けI型**, one wall row containing Sink and cooking equipment.
- `type-ii` → the broad **II型** concept, separate Sink and cooking rows. No Sink-side Facing/Island subtype is claimed.
- `type-l` → the **L型** counter footprint illustrated under **壁付けL型**. This maps the connected right-angle shape only. Catalog equipment positions and two-wall room arrangement are not reproduced.
- `face-to-face` and `island` → no sufficiently complete geometry mapping for a correct scenario.

The catalog's named II-Type Sink-Side Facing concept does not become a new app layout or a claim about the current Type II model.

## 4. Selected scenarios

| Scenario ID | Existing layout | Customer requirement | Correct answer / rationale | Points |
| --- | --- | --- | --- | --- |
| `straight-wall` | `type-i` | Sink and cooking equipment together in one straight row along the wall. | Existing I-Type name; both products share the straight wall row. | 100 |
| `parallel-rows` | `type-ii` | Separate Sink and Cooktop sides into two parallel working rows. | Existing II-Type name; Sink and cooking zones occupy separate counters. | 100 |
| `connected-l` | `type-l` | One connected worktop turning at a right angle, with preparation space on the return. | Existing L-Type name; connected L footprint. Rationale explicitly says both products remain on the main run in this preview. | 100 |

## 5. Rejected mappings and claims

- **Facing/peninsula scenario:** excluded because a deeper straight counter and label alone do not demonstrate the catalog's open facing arrangement.
- **Island scenario:** excluded because the app shares its facing geometry and retains a nearby rear wall; it does not demonstrate independent access around an island.
- **Specific II-Type subtype:** excluded; the implementation has no separate subtype ID or corresponding catalog-specific geometry.
- **L-Type equipment on different legs / ergonomic work triangle:** excluded because both products actually remain on the main leg. Only the L-shaped worktop concept is taught.

## 6. V0.7 files changed

1. `src/App.tsx` — scenario phase, action locks, complete configuration capture/restore, HUD.
2. `src/data/sClassLayoutScenarios.ts` — new readonly scenario module.
3. `src/components/CustomerScenarioCard.tsx` — new stateless card.
4. `src/i18n/translations.ts` — Japanese/English/Myanmar copy.
5. `src/components/KitchenViewport3D.tsx` — four added lines solely to reapply selected floor/wall finishes when existing configuration rebuilds recreate materials.
6. `docs/S_CLASS_GAME_CONTENT.md` — corrected provenance, actual mappings/limits, scenario objectives and content.
7. `outputs/Game-Mode-V0.7.md` — this report.

`src/types.ts`, `sClassGameContent.ts`, `ProductKnowledgeCard.tsx`, and `Game-Mode-V0.6.md` remain byte-identical to the accepted V0.6 baseline. No TopBar, Vite configuration, dependencies, lockfiles, pricing code or other application files were edited.

## 7. Scenario data structure

`LayoutScenario` uses existing `PlanLayoutId`, with readonly `id`, `layoutId`, requirement translation keys, question key, four choices, rationale key and points. `layoutId` is also the correct choice ID. Choice names come directly from `PLAN_LAYOUTS`; no duplicate layout enum or translated names were introduced. There are exactly three scenarios and four choices per scenario. Data contains no Three.js objects or coordinates.

## 8. CustomerScenarioCard

Stateless React presentation following ProductKnowledgeCard's border, colors, width and button styling. It renders localized requirements, question, four choices, retry/correct feedback, rationale, Preview and Next Customer. Answers and new card actions have at least 48 px button height. The HUD owns the live feedback announcement. Scoring/configuration/progression remain in App.

## 9. Game phase/state changes

- Added `scenario` to the existing phase and `knowledge-complete` to existing status.
- Derive the current scenario from `currentScenarioIndex`; `scenarioPreviewed` controls the Preview/Next presentation.
- Product Knowledge stops at 900 with explicit Start Customer Scenario Training and Return actions.
- Start Scenario clears feedback and starts scenario 1 without changing configuration.
- Replay resets identification/task/install/knowledge/scenario indices and score to zero.
- No timers, parallel game state, managers, context or state libraries were added.

## 10. Answer/action locks

The existing synchronous `taskPhaseRef` gains `previewed`: `ready → answered → previewed → advancing`. The handler locks before changing React state. Wrong answers leave it ready. Correct answers lock scoring; later answer callbacks are ignored. Preview accepts only answered, and Next accepts only previewed. Active scenario ID guards reject previous-scenario closures. A session generation ref rejects closures from an earlier session even when the same scenario ID becomes active again. Return immediately invalidates active IDs/session. Existing touch gesture rejection and synthesized-click suppression are reused.

## 11. View Recommended Layout

`handleScenarioAnswer` changes only score and feedback. `handlePreviewLayout` alone calls the existing `setConfig`, replacing only `layout`. It returns the same config object if the layout already matches. The existing viewport construction handles the preview. Repeated Preview is rejected synchronously and never awards points. Explicit Next Customer follows the first two previews. The third correct answer shows its rationale at 1200; its explicit Preview then transitions to Training Complete.

## 12. Original configuration capture

`handleStartScenarios` captures the complete current `KitchenConfig`, including a copied nested `upgrades` record, plus wizard step and sidebar/Focus state in one ref. Current config includes layout, detail/cabinetry, plan type, floor unit/dishwasher, upgrades/faucet options, Sink side and cabinet finish. Dimensions are derived from existing layout options and therefore recover with configuration. There is no second configuration system.

## 13. Restoration behavior

Return restores the complete captured config/step/sidebar and clears the snapshot immediately. This works before answering, after a wrong answer, after correct but before Preview, after a preview, and after final completion. Viewport-owned wall/floor finish, isolation and exploded state remain in the mounted React component; existing Game Mode suspension/restoration continues.

A baseline browser check confirmed a real finish issue: configuration rebuilds recreated floor/backsplash materials at defaults while the selected finish state stayed unchanged. The minimal fix reuses `updateWallMaterials(wallFinish)` and `updateFloorMaterials(floorFinish)` after their new material refs exist, only for nondefault finishes. Browser tests now verify the actual material color, roughness, metalness, bump settings and texture presence across previews and Return, including slate/oak and tile/concrete settings.

## 14. Final score/result

`0 → 300 identification → 600 installation → 900 knowledge → 1000 → 1100 → 1200 scenarios`.

Final HUD: Training Complete; Products Identified **3 / 3**; Products Installed **3 / 3**; Knowledge **3 / 3**; Customer Scenarios **3 / 3**; Score **1200**; Return to Explore. The preview action awards zero points. Browser repeated/stale/touch actions could not exceed 1200.

## 15. Translations

Added 16 keys in each of Japanese, English and Myanmar:

- `game_knowledge_complete`, `game_customer_training`, `game_start_scenarios`, `game_customer_requirements`.
- `game_scenario`, `game_scenario_question`, `game_scenario_hint`, `game_view_layout`, `game_next_customer`, `game_customer_scenarios`.
- `game_scenario_i_requirement`, `game_scenario_i_rationale`, `game_scenario_ii_requirement`, `game_scenario_ii_rationale`, `game_scenario_l_requirement`, `game_scenario_l_rationale`.

Reused existing layout names, Correct, Try again, Score, Return and completion/count labels. No new English-only visible strings.

## 16. Three.js protection

The viewport change is exactly two existing finish-update calls plus a comment/blank line. Raycaster, product IDs, mesh collection, pointer listeners, horizontal/vertical drag, tolerances, placement helpers, product cloning, OrbitControls and scene/renderer lifecycle are unchanged. No geometry was added.

The React viewport remains mounted across all phases. Mode-only changes keep its canvas. Configuration previews use the existing lifecycle, which recreates the renderer/canvas when config changes; obsolete canvases/listeners are cleaned up. Tests confirm one connected canvas and one animation frame loop after transitions settle, with stable listener counts. This existing config-rebuild behavior was not refactored.

## 17. Validation commands and V0.6 regressions

| Validation | Result |
| --- | --- |
| `pnpm run lint` | PASS — `tsc --noEmit`, exit 0. |
| Normal `pnpm run build` | Known Windows native config-loader failure: ancestor directory Access Denied/config resolution. |
| Existing preload + `pnpm run build --configLoader runner` | PASS — Vite 6.4.3, 1691 modules, production output built. |
| `git diff --check` | PASS. |
| Full desktop flows (EN/JA/MM) | 105 named browser checks passed. |
| Full mobile touch flow | 36 named browser checks passed. |
| Scenario early exits / fresh-session locks / Explore controls | 10 named browser checks passed. |
| Existing Hood cancellation/rebuild regression suite | 7 checks passed. |
| Existing knowledge Q1/Q2/Q3 exit regression suite | 37 checks passed. |

**195 named browser checks passed**, with multiple assertions per check. Identification wrong/repeat handling, all three installations, measured tolerances, exact matrix snaps, clone/helper disposal, shared resources, independent Hood light target, fixed drag axes, cancel/lost capture, rebuild during Hood drag, keyboard camera pause, knowledge content/locks/exits and replay passed. The intentional knowledge endpoint change from whole-game completion to Knowledge Complete at 900 is reflected in validation.

Production preview used a scratch static server outside the repository. A Vite dev optimizer attempt also hit the sandbox's ancestor-read failure; project configuration was not changed. Initial harness issues (floating-point equality, L return geometry axis order, stale test-only React fiber reads, hidden mobile isolation control, and isolation camera fixture) were corrected in scratch tests, not production gameplay code.

## 18. Desktop/mobile results

Desktop Chrome (1440 × 1100): full 1200 flows, wrong answers, direct repeated correct callbacks, no config/scene change until Preview, repeated Preview, double/stale Next, final counts, exact config/finish restoration and replay passed.

Mobile Chrome emulation (390 × 844, native CDP/Playwright touch): full identification/installation/knowledge/scenario flow, synthesized duplicate action rejection, preview/Next, 1200 result, replay, orbit without answering and full Type II/right-Sink restoration passed. Starting fixture included dishwasher, oak cabinetry, premium plan, mixed upgrades, step 7, Focus Mode, isolation and exploded view. The desktop-only isolation control was configured through its existing UI callback; the existing perspective preset was selected before touch gameplay. No physical phone/tablet test is claimed.

Seven configurator steps, all five existing layouts/rebuilds, no-product availability guards, five camera presets, Focus Mode, isolation and exploded restoration passed. Screenshots were visually reviewed for desktop English, Myanmar and mobile card presentation, plus final completion.

## 19. Language and browser error results

English, Japanese and Myanmar desktop flows each completed all four phases at 1200. Requirements, existing layout labels, rationale, feedback, phase/action labels and final counts were checked. English mobile touch also completed all phases. All completed suites recorded **zero application console errors and zero JavaScript page errors**. External Google font requests were blocked by the test fixture and tracked separately from application errors.

Evidence JSON/screenshots and scratch scripts are outside the repository under the task's `outputs` and `work` folders: `game-mode-v0.7-desktop-results.json`, `game-mode-v0.7-browser-results.json` (final mobile run), `game-mode-v0.7-exit-results.json`, and `game-mode-v0.7-v06-regression-{hood-cleanup,exit}-results.json`.

## 20. Remaining issues / Git scope

- Existing 390 px header/language-control overlap remains; TopBar was not modified.
- Existing large viewport chunk warning remains (640.53 kB); no bundle optimization.
- Native Windows Vite loader/dev optimizer sandbox issue remains; the existing production runner/preload workaround succeeds.
- Existing geometry limits and dimension discrepancies are described above. Facing/island mappings remain excluded. No room-clearance or exact catalog equipment arrangement claim is made.
- Some existing close/upper-unit views crop geometry; users retain existing presets/orbit controls. No camera/framing redesign.
- Mobile validation is emulation, not physical hardware. Translation rendering/content consistency was checked; no external language reviewer is claimed.

Local branch/HEAD/history were left unchanged. Accepted V0.6 untracked files remain intentionally present alongside V0.7. The Desktop clone remains clean at its published V0.6 commit. No unrelated files changed; no commit/push/merge/deploy or Desktop copy occurred.

## 21. Approximate diff size against the accepted V0.6 baseline

Application source only: **+256 / -13 lines** across App (+106/-13), translations (+51), viewport (+4), scenario data (+34), and scenario card (+61).

Content documentation: **+54 / -3 lines**. This output report is additional new documentation. These figures compare against the saved accepted V0.6 file tree, not the older local Git HEAD that still predates the uncommitted V0.6 work.
