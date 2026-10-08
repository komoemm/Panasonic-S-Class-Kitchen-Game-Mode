# Game Mode V0.5 — Range Hood installation

Validated: 2026-10-02.

Baseline: published V0.4 commit `888804e48e4c632d5ad470fbfcd5857af24c4dd9` on `codex/game-mode-development`, tracking `game/codex/game-mode-development`.

Fetched the `game` repository and verified that the local V0.4 source/report matched the published commit before aligning the branch/index. All five V0.4 file hashes were preserved; the checkout was clean before V0.5 edits. Read `CODEX_HANDOFF.md` and the V0.3/V0.4 output reports completely. Existing implementation and this version's request govern the changes.

Result: one generic installation session now handles Sink/Cooktop horizontally and Range Hood vertically. Identification scores 300; installation progresses through 400, 500, and exactly 600. Completion shows Identified 3/3 and Installed 3/3.

## 1. Files modified

| File | Change |
| --- | --- |
| `src/types.ts` | Shared placement orientation union; Hood installation ID |
| `src/App.tsx` | Third installation task and its typed instruction key |
| `src/components/KitchenViewport3D.tsx` | Orientation-aware session, staging, helper, drag constraint and validation; cloned light-target remapping |
| `src/i18n/translations.ts` | Hood installation instruction in Japanese, English and Myanmar |
| `outputs/Game-Mode-V0.5.md` | This report |

No additional production files, assets, dependencies or lockfiles changed. Browser scripts and evidence are outside the repository, in the thread's `work` and `outputs` directories.

## 2. Existing Hood hierarchy and inspection

- Exact owner: `hoodGroup`; existing `userData.productId = 'rangeHood'` retained.
- Hierarchy: `scene → kitchen → wallGroup → hoodGroup`.
- Created inside `rebuildKitchenScene`, currently at viewport line 2266; metadata at 2267.
- Added with `wallGroup.add(hoodGroup)` at 2331; `kitchen.add(wallGroup)` at 2334. Owners/parents are reconstructed on each kitchen rebuild.
- Root local position `(0,0,0)`, quaternion `(0,0,0,1)`, scale `(1,1,1)`. Normal world transform is also identity. Child positions carry the actual kitchen location.
- Sink/Cooktop roots have identity rotation/scale too, but positioned roots at countertop height; Hood staging must account for its geometry-center offset.
- Six direct children: chimney, intake, baffle, `fanGroup`, `hoodSpot`, and `hoodSpot.target`.
- Ten meshes: chimney, intake, baffle, fan hub and six fan blades. No skinned meshes.
- `clone(true)` shares mesh geometry/materials; these are never disposed by training cleanup. It copies transforms/userData into independent objects.
- Three.js clones the spotlight target separately from the owner's sibling target. A generic original-to-copy map reconnects targets inside the cloned hierarchy. Original targets remain untouched; the temporary spotlight target moves with its cloned owner.
- Type II shifts child geometry backward by 0.45 m. Right-Sink mirrors side-Hood X; centered Hood uses X=0. Peninsula/island depth differs; Type L does not rotate this owner. No inspected variant changes the root orientation.
- Floor-only and wall-only omit the Hood. Its material follows the existing Auto Clean Hood upgrade.
- Exploded mode translates its `wallGroup` parent upward by up to 0.45 m; training suspends that state as before. Focus Mode adjusts camera/sidebar, without modifying the Hood transform.

## 3. Orientation abstraction

The shared contract is:

```ts
export type PlacementOrientation = 'horizontal' | 'vertical';
export type ProductInstallationTask = {
  productId: 'sink' | 'cooktop' | 'rangeHood';
  placementOrientation: PlacementOrientation;
};
```

`ProductInstallation` stores the task orientation alongside its existing plane, target matrix, staging position, tolerance and drag state. `createProductInstallation` still performs the same live product lookup, cloning and session ownership for every task. There are no product-specific creation or pointer handlers.

## 4. Horizontal behavior preservation

The existing horizontal staging calculations are retained in the horizontal branch: countertop-height root Y, stage Z beyond current kitchen bounds by depth × 0.7, camera-aligned X and existing kitchen-width clamp. Sink/Cooktop still move X/Z, hold captured Y, use X/Z footprint helpers, and validate planar distance against `min(width, depth) × 0.2`.

Measured helper sizes remain Sink 0.764 × 0.527 m and Cooktop 0.908 × 0.401 m. Tolerances remain 0.1054 m and 0.0802 m. Desktop, touch, Type II and active-drag cleanup/rebuild regressions pass for both products.

## 5. Vertical plane

Inspection confirms world X/Y are the relevant Hood axes. The session creates a plane with normal `(0,0,1)` at captured root Z. Drag movement adds the existing grab offset, then explicitly restores root Z. Geometry retains its own captured child depth, including Type II offsets; the Hood cannot move toward/away from the wall during dragging.

The root is normally at Z=0 even when its geometry is behind that root plane. This parallel plane supports root translation without assuming that the root sits at the front surface or wall. Quaternion and scale remain captured throughout the drag.

## 6. Measured live Hood bounds

Measurements use current world-space mesh bounds, equivalent here to `Box3.setFromObject(product)`. Rounded values in metres:

| Configuration | Minimum X/Y/Z | Maximum X/Y/Z | Width/height/depth |
| --- | --- | --- | --- |
| Type I, left Sink, side Hood | 0.300 / 1.870 / -0.325 | 1.200 / 2.700 / 0.275 | 0.900 / 0.830 / 0.600 |
| Type II, right Sink | -1.200 / 1.870 / -0.775 | -0.300 / 2.700 / -0.175 | 0.900 / 0.830 / 0.600 |
| Centered Hood | -0.450 / 1.870 / -0.325 | 0.450 / 2.700 / 0.275 | 0.900 / 0.830 / 0.600 |
| Peninsula, left Sink | 0.300 / 1.870 / -0.4665 | 1.200 / 2.700 / 0.1335 | 0.900 / 0.830 / 0.600 |
| Island, right Sink | -1.200 / 1.870 / -0.4665 | -0.300 / 2.700 / 0.1335 | 0.900 / 0.830 / 0.600 |
| Type L, left Sink | 0.300 / 1.870 / -0.325 | 1.200 / 2.700 / 0.275 | 0.900 / 0.830 / 0.600 |

Raw default size: `(0.8999999762, 0.8299999934, 0.6000000238)` due to geometry float precision. Every session recalculates bounds from its live owner.

## 7. Hood tolerance

Vertical tolerance is `min(world width, world height) × 0.2`: `min(0.90, 0.83) × 0.2 = 0.166 m`. Validation uses Euclidean root displacement in X/Y. Depth is constrained, rather than included in the tolerance.

A drop with vertical error `tolerance × 1.05` was rejected at score 500. An X/Y error of `(0.4 × tolerance, 0.3 × tolerance)` was accepted and snapped to the complete exact captured matrix.

## 8. Vertical staging strategy

Staging is derived from target bounds/center, kitchen bounds and current camera/OrbitControls target. No task contains coordinates.

- Desired footprint center Y is target minimum Y minus `height × 0.65`, bounded above the kitchen's measured floor extent. This places the full footprint below the installed target with a `height × 0.15` gap for the inspected Hood geometry.
- Center X follows the current viewing direction at the actual geometry-center depth, clamped to kitchen width. When that view calculation is unavailable, the measured kitchen center is used.
- Root X/Y are offset by the difference between desired and captured geometry centers. Root Z is unchanged.

Default measured root stage was approximately `(-0.77222, -0.95450, 0)`; its physical center is approximately `(-0.02222, 1.3305, -0.025)`. Its vertical bounds are 0.9155–1.7455 m, separated from the target minimum Y=1.870 m by 0.1245 m. Negative root Y is expected because the Hood geometry has positive local Y.

Staging was visible and draggable in default desktop/touch, Type II/right-Sink, centered, island and a zoomed Type L view. Wrong drops return to this session's own captured stage without changing camera, config or target.

## 9. Vertical target helper

The same temporary helper uses measured width × height for vertical tasks. Its plane lies in X/Y; center X/Y come from the live bounds. Z is the front bound plus the existing small 0.008 m display offset so the helper remains visible in front of kitchen surfaces. This visual offset does not change the drag plane or target matrix.

Horizontal helpers retain their X/Z orientation and height offset. Helper geometry/material are independently owned, excluded from selectable meshes, hidden on success and disposed during cleanup.

## 10. Generic pointer behavior

Reused `onSelectionPointerDown`, `onSelectionPointerMove`, `onSelectionPointerUp`, cancel/lost-capture handlers and the existing Raycaster. No listener or Raycaster was added.

Nearest visible kitchen/clone hit filtering, primary-pointer guard, pointer capture, natural grab offset, OrbitControls disable/restore, final-coordinate handling and keyboard camera pause remain intact. Identification's >6 px gesture rejection and listener removal remain intact. Native mouse and CDP-dispatched touch events were used for gameplay validation.

## 11. Progression and HUD

`INSTALLATION_TASKS` adds `install-range-hood`, product `rangeHood`, vertical orientation, localized instruction, 100 points. Existing derived task/index, array-length HUD and completion counts now show 1/3 → 2/3 → 3/3.

Sink success at 400 requires Next Installation. Cooktop success at 500 also requires Next Installation. Hood success completes at 600 without another Next. No timer or parallel game state was added; styling and mounted viewport/configurator behavior are preserved.

## 12. Score and Next locks

The viewport sets `training.locked` synchronously before calling React. App's existing `taskPhaseRef` changes ready → answered before adding points, checks the active task/product/phase/status, and accepts one success per task.

Next changes answered → advancing synchronously before incrementing the task index. Multiple calls in one event cannot skip tasks. Eight simultaneous Next calls and repeated identification/drop events were checked. Twelve additional Hood release events after success left score exactly 600.

## 13. Cleanup

Existing `stopProductDrag` and `clearProductInstallation` restore original visibility, release captured pointers, clear drag, restore controls, detach/empty the temporary group and dispose only helper resources. The old session is cleared before the next one is created.

At completion and Return: all three originals visible with original transforms, zero training groups/helpers and controls enabled. Shared product geometry/materials remain alive. Active-drag Return, pointercancel and unexpected lostpointercapture were tested for Sink, Cooktop and Hood.

## 14. Availability

The existing live-ID availability guard still requires Sink, Cooktop and Hood before Start Training. Floor-only and wall-only disable training and show the existing localized unavailable notice. No missing Hood is fabricated. Guard behavior was tested through the configurator.

## 15. Rebuild safety

`rebuildKitchenScene` retains cleanup-before-disposal and recreation using `installationTaskRef.current`. Product metadata is still assigned inside the existing construction path. The session searches the new current kitchen, captures its current matrix/bounds and collects its current clone meshes.

A Type I → Type II/right-Sink rebuild during active Hood drag restored the old original, released capture on the old canvas, cleared the old group/drag, disposed helper geometry/material, and found a different new live Hood owner. One new vertical helper/session was created, using the new child positions/depth. Score remained 500 until its successful exact snap to 600. Corresponding Sink/Cooktop rebuild tests pass too.

## 16. Translations

Added only `game_install_range_hood`:

- Japanese: `レンジフードを設置しよう`
- English: `Install the Range Hood`
- Myanmar: `မီးဖိုချောင် လေစုပ်ခေါင်းကို တပ်ဆင်ပါ`

The existing generic drag hint, task, Next Installation, correct/wrong feedback, score, counts, completion and Return labels are reused. All three languages completed the full flow in browser tests.

## 17. Desktop/mobile validation

Production preview tested with headless Chrome/Playwright: desktop 1440×1100; mobile 390×844 with touch/mobile emulation and CDP native touch events. Screenshots were visually inspected for desktop, phone, Type II phone, centered/island and final completion.

| Suite | Passed checks |
| --- | ---: |
| Main desktop/languages/Explore/Type II/mobile suite | 61 |
| Mobile Type II/right-Sink | 11 |
| Sink cleanup/rebuild/keyboard regression | 7 |
| Cooktop cleanup/rebuild regression | 6 |
| Hood cleanup/rebuild/tolerance boundary | 7 |
| Centered, island and Type L layouts | 3 |
| Total | 95 |

Exact flow passes: identification 300; Sink 400; explicit Next; Cooktop 500; explicit Next; Hood 600; Identified 3/3; Installed 3/3; Return; replay Find Sink/Score 0. Wrong drops, fixed-axis movement, exact 16-element world matrix snap and per-task scoring locks pass. No page errors or application console errors. External font requests were intentionally blocked and recorded separately.

Evidence is in the thread-level `outputs/game-mode-v0.5-*.json` and `.png` files outside the repository. Test-only React-ref inspection observes live scene/state; existing App setters prepare special configurations/rebuilds. Gameplay uses canvas pointer events and the normal HUD actions.

## 18. Type II results

Desktop and touch with right-Sink pass all three identifications and installations, including wrong drops/repeated events, score 600 and both final counts 3/3. Captured Hood root remains identity while its child geometry moves to the Type II rear depth and left X. Fixed root Z preserves that full captured depth. Return preserves the configured kitchen; replay resets training only.

## 19. Regression and command results

- `pnpm run lint`: PASS (`tsc --noEmit`).
- `pnpm run build`: attempted; known native Windows Vite config-loader sandbox Access Denied failure.
- Production workaround: PASS, 1687 transformed modules, Vite 6.4.3. Existing preload sets `__dirname`; no Vite configuration was edited.
- `git diff --check`: PASS.
- All seven configurator steps, product-ID recreation, no-Hood guard, five camera presets, OrbitControls, Focus Mode and language switching: PASS.
- Isolation/exploded settings suspend/restore, hidden/inert mounted configurator, repeated Explore/Game cycles: PASS.
- One mounted canvas across mode changes, one active animation loop, stable active listener counts and cleared listeners on replaced canvases: PASS.
- Keyboard Start/Return and camera pause while dragging: PASS.
- Source review confirms the horizontal staging calculation, helper dimensions, drag plane and scoring calculation are preserved.

Working runner command (PowerShell, with bundled Node/pnpm on PATH):

```powershell
$env:NODE_OPTIONS='--require C:\Users\OE-DKP-20-006\Documents\Codex\2026-10-01\read-codex-handoff-md-completely-then\work\vite-runner-preload.cjs'
pnpm run build --configLoader runner
```

## 20. Remaining issues and limits

- Existing 390 px header language-control overlap remains outside scope.
- Existing large viewport chunk warning remains (approximately 640.48 kB minified).
- Native Windows Vite config-loader failure remains; documented runner/preload works.
- Existing camera framing can crop the upper Hood/vertical helper or near-camera horizontal stages. The Type L full flow was tested after an OrbitControls zoom-out; its required unchanged horizontal algorithm was retained. Default/Type II desktop and phone flows passed without reframing.
- Mobile validation is browser touch emulation, not a physical-device test. Arbitrary orbit viewpoints were not exhaustively tested.

No known new gameplay errors in the tested flows. No commit, push, merge, deployment or GitHub Desktop copy performed for V0.5.

## 21. Source diff size and final Git state

Production source diff relative to published V0.4: approximately **+65 / -20 lines** across four TypeScript files. This report is the only new repository file.

Branch remains `codex/game-mode-development`, HEAD remains `888804e48e4c632d5ad470fbfcd5857af24c4dd9`. Expected working changes are the four source files and this new output report, with no unrelated changes. Final `git status --short` and `git diff --check` were checked after creating the report.
