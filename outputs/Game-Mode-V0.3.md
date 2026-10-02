# Game Mode V0.3 — Install the Sink

Implemented on `codex/game-mode-development`, from the clean GitHub baseline `231752784843b2fdd8e51310cee6127a30bb9b31`. The existing handoff, V0.1/V0.2 reports, App, procedural construction, input handlers, and installed Three.js cloning implementation were inspected before editing. The current repository implementation governs this version.

The flow is identification of Sink → Cooktop → Range Hood, Score 300, Identification Complete → explicit Start Installation Training → drag a temporary sink → wrong drop +0 / correct drop +100 → Training Complete, Score 400, Products Identified 3 / 3, Products Installed 1 / 1 → Return to Explore. Replay starts at Find the Sink, Task 1 / 3, Score 0.

## 1. Files modified

| File | Change |
| --- | --- |
| `src/App.tsx` | Identification/installation phase, intermediate completion, installation callback and score guard, localized HUD extension, reliable touch activation of Start/Return. |
| `src/components/KitchenViewport3D.tsx` | Temporary live-sink clone, target helper, measured staging/tolerance, extension of existing pointer handlers, drag/scene cleanup. |
| `src/i18n/translations.ts` | Six installation concepts in Japanese, English, and Myanmar. |
| `.gitignore` | Minimal generated/secret-file exclusions. |
| `outputs/Game-Mode-V0.3.md` | This report. |

## 2. Sink hierarchy inspected

`scene → kitchen → counterGroup → sinkGroup` is the actual hierarchy. In the final viewport source, `sinkGroup` is constructed at line 1585, positioned at line 1589, added to `counterGroup` at line 2008, and that counter group is added to the kitchen at line 2173.

- Type I local position: `(-0.75, 0.85, 0.01)` for left, `(0.75, 0.85, 0.01)` for right.
- Type II local position: `(-0.75, 0.85, 0.51)` for left, `(0.75, 0.85, 0.51)` for right.
- Root rotation/quaternion is identity; scale is `(1, 1, 1)`.
- Descendants include basin edges/walls/floor, drain/strainer, nested faucet details, water stream, and ripple mesh. They are ordinary procedural groups/meshes.
- The kitchen, counter parent, and sink are recreated by `rebuildKitchenScene`. Exploded mode moves the counter parent in Y. Installation obtains the live hierarchy each time.

## 3. Clone strategy

`createSinkInstallation` finds the current kitchen owner with `userData.productId === 'sink'`, calls `sink.clone(true)`, and places it in a temporary scene-level `sink-installation-training` group. The real sink remains in its original parent and only its visibility is suspended.

Installed Three.js `Mesh.copy` shares geometry and materials. The clone therefore uses the original geometry/materials without recreating the sink or changing shared materials. Its transforms and object hierarchy are independent. Cleanup removes the clone without disposing its shared resources; the procedural kitchen retains resource ownership.

## 4. World-transform handling

After `kitchen.updateWorldMatrix(true, true)`, installation captures the real sink's complete `matrixWorld`, including world position, quaternion, and scale. The clone's local transform is decomposed from `inverse(trainingGroup.matrixWorld) × capturedSinkMatrixWorld`.

Movement positions are calculated in world space and converted through `trainingGroup.worldToLocal`. Correct placement decomposes the same captured matrix into the clone's parent space. No real sink transform or KitchenConfig value is changed for placement. Browser checks compare all 16 snapped world-matrix values with the captured target.

## 5. Staging-position strategy

Staging uses the measured live sink and kitchen bounds:

- Keep the captured installation Y.
- Set Z to `max(kitchenBounds.max.z, sinkBounds.max.z) + sinkDepth × 0.7`.
- Start X at the kitchen center. For a front-facing current camera, align X with its world-space view direction at the staging Z, clamped to the kitchen width with half a sink width of margin.

The camera-aware X adjustment keeps the temporary sink visible in the tested narrow Type II/right-sink view. No screen coordinates are stored. Default measured staging is approximately `(0.630, 0.85, 0.708)`; Type II staging Z is approximately `1.208`. Staging remains outside the placement tolerance.

## 6. Placement target

A temporary horizontal green `PlaneGeometry` uses the measured sink's X/Z footprint. Its independent `MeshBasicMaterial` has opacity 0.5, double-sided rendering, and no depth writing. It sits 8 mm above the installation height and communicates the destination over the configured sink cutout.

The helper participates in neither kitchen identification nor drag picking. Correct placement hides it immediately; scene cleanup removes it and disposes its own geometry/material.

## 7. Pointer dragging

The original local Raycaster is retained. `setPointerRay` factors the existing canvas-relative coordinate calculation for identification and dragging. The existing pointerdown/move/up/cancel handlers now branch into installation while it is active.

- Pointerdown accepts only a visible temporary-sink hit, with existing kitchen meshes included for occlusion.
- The pointer is captured; the grab offset is `cloneWorldPosition − horizontalPlaneIntersection`.
- Pointermove intersects the same horizontal plane, adds that offset, and changes world X/Z while keeping the captured Y.
- Pointerup includes the final coordinates, releases drag state/capture, then validates.
- Cancellation or unexpected lost capture restores controls and resets the active lesson's clone to staging without scoring.

Identification retains its six-pixel orbit-gesture rejection. A single `lostpointercapture` listener is added and explicitly removed during cleanup.

## 8. OrbitControls and HUD touch handling

Installation pointerdown runs in capture phase before OrbitControls. A sink drag saves `controls.enabled`, disables controls, stops pending camera interpolation, and pauses `controls.update()` and canvas keyboard camera navigation during the drag. Ending/cancelling restores the saved enabled value. Background gestures remain available for orbiting.

Testing found a browser sequence that delivered Return touch-down/up without synthesizing a click after installation. The shared Start/Return button now accepts touch pointer-up with a matching pointer ID and a six-pixel movement/cancellation guard. Mouse/keyboard retain native click activation. Synthesized touch clicks are ignored, preventing a duplicate action when the same button changes from Return to Start. The styling remains unchanged.

## 9. Placement tolerance

The actual default live assembly measures approximately **0.764 m wide × 0.527 m deep** in world space, including its existing details. Tolerance is `min(measuredWidth, measuredDepth) × 0.2`, approximately **0.1054 m**. It is recalculated from the current build rather than stored as an arbitrary constant.

Validation checks horizontal X/Z center distance. Y is controlled by the placement plane; rotation and scale are retained from the target and restored exactly on snap.

## 10. Wrong drops

A wrong drop reports Try again, leaves the score at 300, keeps installation active, and returns the clone to its stored staging position. It does not move the camera, rebuild the kitchen, or change configuration.

## 11. Score lock and state

App adds a small `gamePhase` (`identification` / `installation`) and `identification-complete` status. The existing task list, task index, score, feedback, status, and `taskPhaseRef` remain in use.

Identification still awards each of its three tasks once and requires explicit Next. The final identification answer stops at 300 with Start Installation Training and Return available. Start Installation switches phases explicitly and clears feedback; no timer advances gameplay.

On a correct installation drop, the viewport sets `training.locked` before its callback. App requires the installation phase, playing status, and synchronous `taskPhaseRef === 'ready'`; it sets the ref to answered before adding 100 and setting complete. Repeated pointer-up events cannot award again. The maximum is exactly 400.

## 12. Cleanup and restoration

`stopSinkDrag` clears drag state before releasing capture and restores the saved controls setting. `clearSinkInstallation` restores the original visibility, removes/clears the temporary group, disposes only the helper resources, and clears active installation references.

Full cleanup runs on completion, Return, phase exit/restart, scene cleanup, and before disposing/rebuilding the kitchen. Success snaps first, then completion restores the real sink and removes temporary objects. Pointer cancellation keeps the lesson active at staging with no retained drag offset or capture.

An interrupted configuration rebuild cleans the old training objects before disposing the old kitchen and constructs a new clone/target from the current live sink. No stale mesh is retained. The viewport/configurator stay mounted across game transitions, and existing isolation/exploded settings and configurator state restoration are retained.

## 13. Translations

Added in all three languages: `game_identification_complete`, `game_start_installation`, `game_installation_training`, `game_install_sink`, `game_drag_sink_hint`, `game_products_installed`.

Existing identification, Task, Score, Correct, Try again, Training Complete, Products Identified, and Return labels are reused. Browser checks assert the localized installation instruction, hint, heading, action, completion, and installed count. App contains no new English-only labels.

## 14. .gitignore

Added `node_modules/`, `dist/`, `.env`, `.env.local`, `*.log`, `.DS_Store`, and `Thumbs.db`. `.env.example` remains tracked and is not ignored. The deleted lockfiles/workspace file remain absent; the Google AI Studio Vite/dependency configuration is retained.

## 15. Validation commands

| Command | Result |
| --- | --- |
| `pnpm run lint` (`tsc --noEmit`) | Passed on the final source. |
| `pnpm run build` | Attempted; reproduced the documented native Windows sandbox config-loader AccessDenied failure. |
| `pnpm run build --configLoader runner` | Passed on the final source with the established Node preload. |
| Production preview, localhost port 3000 | Served the final build for browser validation. |
| `git diff --check` | Passed. |

No dependency installation, lockfile restoration, Vite configuration edit, commit, push, deployment, or merge of old local main was performed.

## 16. Desktop/mobile and regression results

Headless Chrome validates the production build at desktop 1440 × 1100 and touch emulation 390 × 844. External font requests are intentionally blocked; application errors are recorded separately from those aborted requests.

Passed:

- Complete three-product identification, wrong/empty hits, repeated answers, five same-dispatch answers, and double Next protection; intermediate score exactly 300.
- Start Installation, one temporary sink/helper, original visibility suspension, shared geometry/materials and preserved root transform.
- Sink-only drag start, no jump on grab, controlled Y, wrong drop +0, staging reset, correct world-matrix snap, repeated pointer-up protection, and final 400 / identified 3 of 3 / installed 1 of 1.
- Mouse, keyboard Start/Return, native touch Start/Return, replay reset, pointer cancellation, unexpected lost capture, and Return during an active drag.
- Orbit gestures rejected as identification answers; controls restored after drag; keyboard camera movement paused during drag.
- Seven configurator steps, configuration rebuilds, no-hood availability guard, all five camera presets, Focus Mode, three-language switching, and isolation/exploded suspension/restoration over repeated mode cycles.
- Same canvas/context across game transitions; one connected canvas and active animation loop; stable listeners. Disconnected canvases have their listeners removed after rebuild.
- No JavaScript page errors or application console errors in the final successful runs.

## 17. Type II/right-sink results

Desktop tests configure Type II and the right sink through the seven-step UI, including other existing options, then complete identification and installation at 400. A separate phone-sized test prepares Type II/right-sink through the existing App configuration setter and performs identification/drag/drop/Return/replay with native touch input. This isolates gameplay from the existing narrow configurator/header layout.

Both confirm the live target at `(0.75, 0.85, 0.51)`, the correct clone orientation/scale, visibility restoration, and replay at Task 1 / Score 0. An additional test changes configuration during an active drag: the old helper is disposed, old temporary objects/capture are cleared, and the rebuilt Type II/right-sink training completes correctly without duplicate scene resources.

Local browser scripts and evidence are outside the source checkout, in the sibling `work` directory and task-level `outputs` directory. Evidence includes `game-mode-v0.3-browser-results.json`, `game-mode-v0.3-cleanup-results.json`, `game-mode-v0.3-mobile-ii-results.json`, and desktop/mobile staging/completion screenshots.

## 18. Remaining issues

The documented 390 px TopBar language-control overlap, large viewport chunk warning (approximately 640 kB before gzip), and native sandbox Vite config-loader failure remain. Touch validation uses emulation rather than physical phone hardware. Cooktop/hood placement and later gameplay systems remain outside V0.3.

## 19. Diff size and Git state

The application source diff is approximately **+313 / −39 lines across three TypeScript files** (App +93/−21, viewport +202/−18, translations +18/−0). The seven-line `.gitignore` and this report are additional repository files.

HEAD remains the baseline `231752784843b2fdd8e51310cee6127a30bb9b31` on `codex/game-mode-development`. The working tree contains the intentional V0.3 changes listed above. No commit, push, deployment, or history rewrite was performed.
