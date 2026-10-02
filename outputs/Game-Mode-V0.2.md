# Game Mode V0.2

Implemented incrementally from the working V0.1 checkout and `Game-Mode-V0.1.md`. The repository implementation was used as the source of truth. The underlying Git baseline is `fa43ae7e4d40eefbcacbe50cb0932e96f05fbcc9`; V0.1 was already an uncommitted change when V0.2 began.

The completed flow is Sink → +100 → Next Task → Cooktop → +100 → Next Task → Range Hood → +100 → Training Complete, Score 300, Products Identified 3 / 3 → Return to Explore. Starting again resets to Task 1 / 3 and Score 0.

## 1. Files modified

| File | V0.2 change |
| --- | --- |
| `src/App.tsx` | Typed three-task array, task index, synchronous action lock, explicit Next handler, progress/completion HUD, and generic required-product availability check. |
| `src/components/KitchenViewport3D.tsx` | Two owning-group metadata assignments and a callback reporting product IDs from the current kitchen build. |
| `src/i18n/translations.ts` | Five new keys in all three languages; existing click hint generalized to the requested product. |
| `outputs/Game-Mode-V0.2.md` | This implementation and validation report. |

`src/types.ts` retains its existing V0.1 `AppMode` change and was not changed for V0.2. No dependencies, package scripts, TopBar, or Vite configuration changed.

## 2–3. Exact existing procedural objects and IDs

All line references below are to the final `src/components/KitchenViewport3D.tsx`. These objects are created inside `rebuildKitchenScene` (line 695).

| Product | Existing owner and creation | Hierarchy insertion | Existing descendants | Product ID |
| --- | --- | --- | --- | --- |
| Sink | `sinkGroup`, line 1470 | `counterGroup.add(sinkGroup)`, line 1893; `kitchen.add(counterGroup)`, line 2058 | Basin walls/floor/bevels, drain/basket, faucet and water details | `sink`, existing V0.1 tag retained |
| Cooktop | `cooktopGroup`, line 1898 | `counterGroup.add(cooktopGroup)`, line 2052 | Glass plate/frame, induction rings/crosshairs, touch controls, nested `grilleUnit` groups | `cooktop`, added at line 1899 |
| Range Hood | `hoodGroup`, line 2115 | `wallGroup.add(hoodGroup)`, line 2180; `kitchen.add(wallGroup)`, line 2183 | Chimney, intake, baffle, nested `fanGroup`, spotlights/target | `rangeHood`, added at line 2116 |

The owners and their parent kitchen groups are recreated on every kitchen rebuild. The sink/cooktop exist in the floor-cabinet construction branch; the hood exists only when `showRangeHood` is true. No geometry was duplicated and no individual child mesh was tagged.

## 4. Task data structure

The small task list remains in App:

```ts
type IdentifyProductId = 'sink' | 'cooktop' | 'rangeHood';
type IdentifyTask = {
  id: string;
  productId: IdentifyProductId;
  instructionKey: 'game_find_sink' | 'game_find_cooktop' | 'game_find_range_hood';
  points: number;
};
```

`IDENTIFY_TASKS` is a readonly array with `find-sink`, `find-cooktop`, and `find-range-hood`, each worth 100 points. Selection logic compares the selected ID with the derived task's ID; it has no product-specific scoring branches.

## 5–7. State, scoring lock, and Next Task

`currentTaskIndex` replaces the single task object state. `currentTask` is derived from `IDENTIFY_TASKS[currentTaskIndex]`. Existing `appMode`, `score`, `gameStatus`, and `feedback` are retained.

Start resets index 0, score 0, feedback null, and status playing. Return sets Explore/idle and clears feedback. A synchronous `taskPhaseRef` protects the interval before React commits state updates:

- `ready`: a selection can be evaluated. Wrong answers only change feedback.
- `answered`: a correct answer has already awarded its points; further selections are ignored.
- `advancing`: Next has been accepted; repeated Next actions and selections are ignored until the new index commits.
- `inactive`: no answers are accepted outside active training or after completion.

A correct answer sets the lock before adding points with a functional score update. Each task can therefore award 100 once, for a maximum of 300. Next is available only after a correct answer on Tasks 1 and 2. It increments the index once and clears feedback; the effect for the committed task index unlocks the next task. The final correct answer sets status complete and shows no Next button. There are no advancement timers.

The existing viewport and configurator stay mounted. The configurator remains hidden/inert during training. A hidden, aria-hidden copy of the localized hint reserves its measured feedback space, and the invisible disabled Next button reserves its action space before success. Feedback changes keep the mobile canvas steady.

## 8. Translations

Added in Japanese, English, and Myanmar:

- `game_find_cooktop`
- `game_find_range_hood`
- `game_next_task`
- `game_products_identified`
- `game_requires_products`

Reused `game_training`, `game_start`, `game_return`, `game_task`, `game_find_sink`, `game_score`, `game_correct`, `game_try_again`, `game_complete`, and `game_click_hint`. The existing hint now requests the current product rather than naming the sink. No new English-only UI text was introduced in App.

## 9. Rebuilds and selection reuse

The two new tags are applied where the procedural owning groups are constructed, so every rebuild recreates all available IDs. The existing kitchen mesh collection is cleared and repopulated from the current kitchen. The existing `findProductId` parent traversal, Raycaster, pointer listeners, six-pixel gesture rejection, visibility filtering, and cleanup are unchanged.

`onAvailableProductsChange` reports only strings found through that same parent lookup on the current collection. App checks every task's required ID against these strings. Floor-only and wall-only configurations disable Start with a localized explanation; selecting a kitchen containing all three products enables it again. This prevents an unwinnable hood task without modifying the user's chosen configuration or retaining stale mesh references.

Sink children resolve to `sink`, cooktop children to `cooktop`, and hood children to `rangeHood`. Untagged kitchen hits report `other`; empty/background hits are ignored. Studio walls, floor, and lights remain excluded.

## 10. Validation commands

| Command/check | Result |
| --- | --- |
| `pnpm run lint` (`tsc --noEmit`) | Passed, including after the final HUD change. |
| `pnpm run build` | Attempted; failed with the documented native esbuild/Vite config-loader directory-access error in the Windows sandbox. |
| `pnpm run build --configLoader runner` | Passed, including after the final HUD change, using the existing V0.1 preload. |
| `pnpm run preview --host 127.0.0.1 --port 3000 --strictPort --configLoader runner` | Served the production build successfully using the same preload. |
| `git diff --check` | Passed. |
| Incremental patch reverse-application check | Passed with `git apply --check --reverse`; no patch was applied. |

The scratch preload remains `work/vite-runner-preload.cjs`, supplying the existing config's `__dirname`. Generated pnpm verification files used for validation are kept outside the source checkout. No project configuration workaround was added.

## 11. Browser verification

Browser checks use headless Chrome against the production build, at desktop 1440 × 1100 and phone 390 × 844 with real touch events. External font requests are intentionally blocked for deterministic loading; fallback fonts are used. The validation script is outside the source checkout at `work/validate-v02.cjs`.

Verified:

- The requested complete desktop sequence, including wrong kitchen hits at each task, correct selections, repeated selections, explicit Next, 300 points, and 3 / 3 identified products.
- Empty/background hits ignored. Selections after success preserve correct feedback and score.
- Five answer events within one browser evaluation award only 100. Two synchronous Next clicks advance only once.
- Return/replay resets to Find the Sink, Task 1 / 3, Score 0.
- Complete task sequences and localized HUD labels in English, Japanese, and Myanmar.
- All seven configurator steps and configuration changes, including Type II, floor/hood detail, premium plan, dishwasher, faucet upgrade, and right sink orientation.
- All three product groups/IDs present after rebuild; all three selectable in the changed Type II/right-sink configuration, completing at 300.
- Floor-only and wall-only configurations disable training; a complete configuration enables it again.
- All five camera presets, OrbitControls, and Focus Mode. Orbit gestures change the camera without submitting an answer.
- Three Explore → Game → Explore cycles preserve the current configurator step and settings. Actual scene inspection confirms that training makes all products visible and suspends exploded offsets, then restores wall isolation and exploded offsets on exit.
- Mode changes keep the same canvas. Settled states have one canvas and one animation frame loop, with unchanged canvas listener counts. Rebuilds clean listeners from disconnected old canvases.
- The phone touch sequence includes wrong taps, correct taps for all three products, repeated taps, Next, completion, return, replay, and touch orbit rejection. Canvas bounds remain unchanged during feedback and Next transitions.
- No JavaScript page errors or application console errors in the final successful run. Intentionally aborted external font requests are recorded separately.

Machine-readable results are in `game-mode-v0.2-browser-results.json`. Screenshots include `game-mode-v0.2-complete.png`, `game-mode-v0.2-configured-complete.png`, `game-mode-v0.2-mobile.png`, `game-mode-v0.2-ja.png`, and `game-mode-v0.2-mm.png`.

## 12. Remaining issues

The three documented V0.1 issues remain: narrow 390px TopBar language-control overlap, the large Three.js viewport chunk warning (about 635 kB before gzip), and the native Windows sandbox Vite config-loader failure. They were kept outside this implementation's scope.

Touch checks use browser touch emulation, not physical phone hardware. The three-task sequence requires a configuration that contains all three products; this requirement is explained in the HUD when unavailable.

## 13. Source diff size and delivery

The incremental source diff from the captured V0.1 files is **+108 / −25 lines across three source files**: App +76/−21, viewport +14/−1, translations +18/−3. This excludes the output report and scratch validation script.

`game-mode-v0.2.patch` contains only the V0.2 increment and is intended for a checkout already containing V0.1. The Git working diff also includes the earlier uncommitted V0.1 work. No commit, push, or deployment was performed.

## Repository preparation — 2026-10-02

The sections above record the original implementation and validation session. The complete V0.1 + V0.2 source was subsequently committed as `1c88433` (`feat: complete S-Class Game Mode V0.2`). Repository preparation preserves that commit and adds the original handoff, both implementation reports, README, tested pnpm lockfile, and dependency install-script policy. Application source remains unchanged.

The README provides reproducible setup commands and the existing Windows sandbox workaround without requiring the local scratch directory. Screenshots, browser test scripts/results, and incremental patches referenced in the original session remain local validation artifacts and are excluded from the repository package.

Before the repository checkpoint, `pnpm run lint` passed again. The normal production build reproduced the documented sandbox config-loader error; the existing runner/preload build passed in 11.27 seconds with the unchanged viewport chunk warning. The project files and both prior history revisions were inspected for credential patterns; no credentials were found, and `.env.example` contains placeholders only.
