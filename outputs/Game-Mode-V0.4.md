# Game Mode V0.4 — Sink and Cooktop installation

Implemented on `codex/game-mode-development` from the published V0.3 commit `5a20817c0e09dc9f25c8c5d69d874aaf33f96630`. The handoff, all three earlier implementation reports, current App, procedural products, input handlers, and installed Three.js mesh cloning implementation were inspected before editing. The repository implementation governs this version.

Baseline synchronization found separate local/GitHub V0.3 commits with identical complete Git trees. With the user's approval, the original local commit `9ef37c7` was preserved on `codex/v0.3-local-checkpoint` and the existing local V0.3 tag. The development branch was aligned using `reset --keep` to the published commit and now tracks `game/codex/game-mode-development`. No merge or remote history change was made.

Completed flow: identify Sink → Cooktop → Range Hood, Score 300 → Start Installation Training → install Sink, Score 400 → explicit Next Installation → install Cooktop → Training Complete, Score 500, Products Identified 3 / 3, Products Installed 2 / 2 → Return to Explore. Replay starts at Find the Sink, identification Task 1 / 3, Score 0.

## 1. Files modified

| File | Change |
| --- | --- |
| `src/App.tsx` | Two installation tasks, derived current task, installation index, task-aware drop callback, guarded Next Installation, progress/completion HUD, shared training-button touch handling. |
| `src/components/KitchenViewport3D.tsx` | Generalized V0.3 session/lookup/cleanup and task props. Existing measured staging, transforms, Raycaster, drag handlers and scene lifecycle are reused. |
| `src/types.ts` | Small shared product/orientation contract for installation tasks. |
| `src/i18n/translations.ts` | Cooktop instruction and Next Installation in all three languages; generalized the existing drag hint. |
| `outputs/Game-Mode-V0.4.md` | This report. |

## 2. Sink-specific code generalized

Before editing, V0.3 used `SinkInstallation`, `sinkInstallationRef`, `createSinkInstallation`, `stopSinkDrag`, and `clearSinkInstallation`. The viewport's boolean `installationActive` selected that one session. `onInstallationDrop(correct)` was already shared in shape, but App awarded a fixed 100 and completed immediately; instruction/hint/progress/installed count assumed Sink and 1 / 1.

These become `ProductInstallation`, `installationRef`, `createProductInstallation(task)`, `stopProductDrag`, and `clearProductInstallation`. A nullable `installationTask` replaces the boolean. `onInstallationDrop(productId, correct)` identifies the emitting product. App rejects callbacks for an inactive phase, a locked task, or a product other than the derived current task.

The previously Sink-specific live lookup is parameterized. Its world target, measured bounds, staging, target helper, tolerance, grab offset, pointer capture, snap and cleanup follow the same path for both products. There is no second placement engine.

## 3. Cooktop hierarchy and cloning inspection

The exact owner is `cooktopGroup`, tagged `userData.productId = 'cooktop'`. In the final viewport source it is created at line 2014, positioned at 2018, added to `counterGroup` at 2168, and reaches the kitchen through `kitchen.add(counterGroup)` at 2174. Hierarchy: `scene → kitchen → counterGroup → cooktopGroup`. Both owner and parent are recreated during `rebuildKitchenScene`.

| Configuration | Cooktop root position | Sink root position |
| --- | --- | --- |
| Type I / left Sink | `(0.75, 0.85, 0.035)` | `(-0.75, 0.85, 0.01)` |
| Type I / right Sink | `(-0.75, 0.85, 0.035)` | `(0.75, 0.85, 0.01)` |
| Type II / left Sink | `(0.75, 0.85, -0.415)` | `(-0.75, 0.85, 0.51)` |
| Type II / right Sink | `(-0.75, 0.85, -0.415)` | `(0.75, 0.85, 0.51)` |

The procedural root quaternion is identity and scale is `(1, 1, 1)` for both products in all existing layouts. Mirroring changes X; Type II changes Z. Normal local and world positions match because the kitchen/counter transforms are neutral. Explore exploded mode translates the counter parent in Y; Game Mode preserves the existing suspension/restoration behavior and captures the live world matrix.

Cooktop has 21 direct children and 36 ordinary meshes: glass plate, frame, induction rings, crosshairs, control strip/icons, and three nested `grilleUnit` groups with frames/cavities/slats. Burner point lights are siblings in `counterGroup`, rather than Cooktop descendants. There are no skinned meshes, skeletons, or external models. `clone(true)` is safe; installed `Mesh.copy` and browser identity checks confirm shared geometry/materials and independent objects/transforms. Installation does not recolor or otherwise mutate shared product materials; existing scene animations remain in place.

Both products exist inside the `showFloorCabinet` construction branch. `type-i-wall-only` omits them; other current product upgrades do not remove Cooktop. The existing three-product availability check keeps incomplete configurations from starting training. No configuration rotates Cooktop relative to Sink.

The existing Sink owner remains `sinkGroup`, created at final line 1586, positioned at 1590, added to `counterGroup` at 2009, and reaching the kitchen at 2174. No procedural geometry or metadata was duplicated.

## 4. Installation task structure

The shared viewport contract is deliberately small:

```ts
type ProductInstallationTask = {
  productId: 'sink' | 'cooktop';
  placementOrientation: 'horizontal';
};
```

App adds `id`, a typed installation `instructionKey`, and `points`. Its readonly `INSTALLATION_TASKS` array contains `install-sink` / `sink` / `game_install_sink` / 100 and `install-cooktop` / `cooktop` / `game_install_cooktop` / 100, both horizontal. Task data contains no targets, dimensions, staging coordinates, or numeric tolerances. No state library or manager was added.

## 5. Generic live product lookup

`createProductInstallation(task)` traverses the current `kitchenGroupRef.current`, looking for the existing owning object whose `userData.productId` equals `task.productId`. It updates the live world matrices before capturing transforms and measuring. Lookup happens again after reconstruction; task data retains IDs rather than Three.js objects.

## 6. Generic installation session

`ProductInstallation` holds the active product ID, live original and saved visibility, temporary group/clone/mesh collection, helper, captured target matrix/position, measured staging/tolerance, horizontal plane, drag state and score lock.

One `product-installation-training` group owns either `training-sink` or `training-cooktop` plus the helper. Creation refuses a second simultaneous session. The original remains under its real counter parent; only visibility is suspended. Clone geometry/materials remain owned by the procedural kitchen.

The complete target comes from `original.matrixWorld`. Both staging and snap convert world coordinates through the temporary parent. Exact snap uses `inverse(trainingGroup.matrixWorld) × targetMatrix`, decomposed into the clone's local position/quaternion/scale. Tests compare all 16 final world-matrix values with the captured target before React removes the clone.

## 7–10. Measured bounds and tolerances

Default live world-space measurements, including the existing product details:

| Product | Width X | Height Y | Depth Z | Tolerance |
| --- | --- | --- | --- | --- |
| Sink | 0.764 m | 0.645311 m | 0.527 m | 0.1054 m / 105.4 mm |
| Cooktop | 0.908 m | 0.0063 m | 0.401 m | 0.0802 m / 80.2 mm |

Default Sink bounds run from approximately `(-1.132, 0.632, -0.285)` to `(-0.368, 1.277311, 0.242)`; center `(-0.75, 0.954655, -0.0215)`. Default Cooktop bounds run from `(0.296, 0.85, -0.187)` to `(1.204, 0.8563, 0.214)`; center `(0.75, 0.85315, 0.0135)`.

The placement anchor is each owning root's captured world position. The helper uses the bounds' X/Z center. The Cooktop assembly footprint includes its grilles/frame; the glass plate alone is smaller. Each lesson calculates its own `Box3` bounds and `min(width, depth) × 0.2` tolerance. The V0.3 factor was retained; desktop and touch Cooktop placement passed with it. The same footprint/tolerance measurements were confirmed in Type II/right-Sink.

## 11–12. Sink and Cooktop staging

The existing staging algorithm is parameterized by the active live product. It retains target Y; sets Z to `max(kitchenBounds.max.z, productBounds.max.z) + productDepth × 0.7`; and aligns X toward the current camera view, clamped to the kitchen width with half the active product width as margin.

| Tested scene | Sink staging | Cooktop staging |
| --- | --- | --- |
| Default perspective | `(0.629689, 0.85, 0.708400)` | `(0.551289, 0.85, 0.620200)` |
| Type II/right-Sink perspective | `(0.903000, 0.85, 1.208400)` | `(0.831000, 0.85, 1.120200)` |

These are measured examples, not task constants. X follows the current camera; each Z uses the independently measured depth. Both staging positions are outside their respective tolerances and visible/reachable in the tested desktop and narrow touch views.

## 13. Generic helper

The single `product-installation-target` uses the active product's measured X/Z footprint and an independently owned green translucent material. It stays horizontal, 8 mm above target root Y, with no depth writing. It is excluded from identification/drag raycasts, hidden immediately on success, removed during cleanup, and its own geometry/material are disposed. Shared product resources are never disposed when only the session is cleared.

## 14. Generic drag behavior

The same existing Raycaster and pointerdown/move/up/cancel/lostcapture listeners handle both products. Capture-phase pointerdown accepts only the active training clone, with current kitchen meshes retained for occlusion. It captures the pointer, records the plane grab offset and prior controls setting, disables OrbitControls, stops pending camera interpolation, and pauses controls updates/canvas keyboard camera movement.

Movement intersects the same horizontal world plane, applies the offset, converts through the temporary parent, and fixes Y to the captured target Y. Pointerup includes final coordinates, releases capture/restores controls, validates horizontal distance and snaps exactly when correct. Cancellation/lost capture clears the drag and resets that product to its own staging without scoring. Existing identification's greater-than-six-pixel gesture rejection remains intact.

Wrong drops only report Try again and reset staging. Tests confirm unchanged score and camera, with no reconstruction or configuration change. Correct drops set the session lock before the task-aware callback, hide the helper and award the current task once.

## 15–16. Installation progression and Next lock

App stores only `currentInstallationTaskIndex`; the current task is derived from the readonly array. Start Game, Start Installation and Return reset the installation index to zero.

Sink success locks the task and awards its 100 points while status remains playing. Correct feedback makes the viewport task null, so the Sink session is already fully cleared and the original visible while Next Installation is offered. Only that explicit action advances the index. Cooktop success awards its task points and sets complete. There are no advancement timers.

The existing synchronous `taskPhaseRef` blocks both repeated correct callbacks and repeated Next actions before React commits. Next requires `answered`, switches the ref to `advancing` before incrementing, and also bounds the index to the last task. The index effect unlocks the newly committed task. The viewport's session lock and App's active-product/phase/status/ref checks provide separate protections; score cannot exceed 500 through repeated answers/drops/Next events.

A real touch regression initially found omitted synthesized clicks on Next Installation after dragging. The proven V0.3 Start/Return touch handling is now shared through `trainingButtonEvents`. It accepts matching-button pointerup within six pixels, rejects cancelled/moved gestures and suppresses duplicate synthesized touch clicks. Mouse/keyboard click behavior is retained. Native touch Next and Return pass in the final default/Type II runs.

## 17. Cleanup between tasks

Before Cooktop starts, Sink is restored, its temporary group is detached/cleared, helper resources are disposed, drag/capture released, controls restored, and `installationRef` cleared. Changing to Cooktop also clears any prior session before creating the new one. Tests confirm at most one temporary training product/helper and no retained Sink session. Cooktop completion applies the same cleanup; all three real products remain visible and retain their original transforms.

## 18. Rebuild safety

The existing reconstruction path clears the active session before disposing the old kitchen. It then reconstructs the normal product metadata and mesh collection and creates a fresh session for the still-active task using the new hierarchy. Stable callbacks/task refs preserve the renderer/scene effect dependencies across ordinary game updates.

Captured-drag rebuild tests passed independently for Sink and Cooktop. The Cooktop test changes to Type II/right-Sink and confirms a new live owning object and target `(-0.75, 0.85, -0.415)`, with the old helper disposed, old original restored, old temporary group empty/detached, drag cleared, and one current canvas/animation loop/listener set. Finishing that rebuilt Cooktop yields exactly 500.

## 19. Translations

Added `game_install_cooktop` and `game_next_installation` in Japanese, English and Myanmar. Renamed the existing `game_drag_sink_hint` to `game_drag_product_hint` and generalized its text so both tasks reuse one concept. Existing installation heading, Sink instruction, Correct/Try again, progress, score, identified/installed counts, completion and Return labels are reused. No new user-visible English-only strings were added to App.

## 20. Validation commands/results

| Check | Result |
| --- | --- |
| `pnpm run lint` (`tsc --noEmit`) | Passed on final application source. |
| `pnpm run build` | Attempted; reproduced the documented Windows native config-loader AccessDenied failure. |
| `pnpm run build --configLoader runner` with existing Node preload | Passed on final source; final run 5.28 seconds. |
| Production preview, localhost port 3000 | Served the built application for browser validation. |
| `git diff --check` | Passed. |
| Protected repository files compared with baseline | No changes to `.gitignore`, `.env.example`, Vite/package configuration, deleted lockfiles/workspace file, or TopBar. |

No new dependency, test package, lockfile, or build configuration change was introduced. Scratch validation scripts/results/screenshots remain outside the source checkout in the task's sibling `work` and task-level `outputs` directories.

## 21–24. Desktop, mobile, Type II and regression results

Headless Chrome tested the production build at desktop 1440 × 1100 and native browser touch emulation 390 × 844. External font requests were intentionally aborted; those network errors were tracked separately from application console errors.

| Validation artifact | Passed checks | Page/application console errors |
| --- | --- | --- |
| `game-mode-v0.4-browser-results.json` | 46 | 0 / 0 |
| `game-mode-v0.4-sink-cleanup-results.json` | 7 | 0 / 0 |
| `game-mode-v0.4-cooktop-cleanup-results.json` | 6 | 0 / 0 |
| `game-mode-v0.4-mobile-ii-results.json` | 8 | 0 / 0 |

All 67 recorded browser checks passed. They verify:

- Exact 300 → Sink wrong +0 → Sink correct 400 → explicit Next → Cooktop wrong +0 → Cooktop correct 500; identified 3 / 3 and installed 2 / 2.
- Product-specific helpers/tolerances/staging, hidden active original, one visible shared-resource clone, grab offset, controlled Y, unchanged wrong-drop camera, exact world-matrix snap, repeat-drop/pointerup score protection, double/multiple Next protection.
- Original visibility/transforms preserved; helper-only disposal, no shared resource disposal at ordinary task cleanup, no temporary products/helpers/captures after success or Return.
- Pointer cancellation, unexpected lost capture, keyboard camera pause and Return during an active drag for both products; configuration rebuild during captured drag for both products.
- Desktop Type II/right-Sink setup through all seven configurator steps, including floor/detail, premium, dishwasher and faucet options; both lessons complete. Separate phone Type II/right-Sink preparation uses the existing App config setter to isolate gameplay from the known narrow configurator/header layout; identification and both installations then use native touch input.
- Japanese, English and Myanmar identification/installation instructions, shared hint, Next, completion, score/counts and Return. Native touch Next works after Sink dragging.
- Wrong/empty identification, repeated same-dispatch answers, double identification Next, OrbitControls gesture rejection, replay at Find Sink/Task 1/Score 0, five camera presets, Focus Mode, training isolation/exploded suspension/restoration and preserved configurator state.
- Same canvas/context across game transitions, one animation loop, stable canvas listener counts, and cleaned listeners on disconnected old canvases after configuration changes.
- No JavaScript page errors or application console errors. Desktop and phone staging/completion screenshots were visually inspected; Cooktop is visible and the helper fits its footprint.

## 25. Remaining issues

The existing narrow 390 px TopBar language overlap, approximately 640 kB viewport chunk warning and native Windows sandbox config-loader failure remain unchanged. Touch verification uses browser emulation rather than physical hardware. Range Hood installation and vertical placement remain outside V0.4.

## 26. Diff size and final repository state

Application source diff from published V0.3: approximately **+141 / −92 lines across four TypeScript files**: App +73/−36, viewport +54/−53, translations +9/−3, types +5/−0. Most viewport edits rename/parameterize the working session. This report is additional.

HEAD remains `5a20817c0e09dc9f25c8c5d69d874aaf33f96630`, tracking the published development branch. V0.4 changes are uncommitted. No V0.4 commit, push, tag, merge, deployment, or copy to the separate GitHub Desktop clone was performed.
