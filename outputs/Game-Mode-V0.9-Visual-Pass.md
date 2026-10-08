# Game Mode V0.9 — Priority 1 Visual Pass

Date: 2026-10-08  
Status: implemented and validated; ready for review.

## Baseline verification

The accepted V0.8 gameplay and published V0.9 audit were verified locally against the GitHub Desktop clone before editing. All **39 tracked files matched by SHA-256**.

- Codex source: `C:\Users\OE-DKP-20-006\Documents\Codex\2026-10-01\read-codex-handoff-md-completely-then\work\Panasonic-Kitchen-S--CLASS`
- Desktop clone: `C:\Users\OE-DKP-20-006\Documents\GitHub\Panasonic-S-Class-Kitchen-Game-Mode`
- Desktop branch: `codex/game-mode-development`
- Desktop HEAD: `666dcfcb2b9d56d31f945ed16cda3403004d19d7` — published asset audit following V0.8.
- Desktop working tree: clean before and after this work.
- Existing accepted local changes were retained. No reset, checkout, merge, commit, push or deployment was performed.

Read: CODEX_HANDOFF.md, docs/S_CLASS_GAME_CONTENT.md, outputs/Game-Mode-V0.8.md and outputs/Game-Mode-V0.9-Asset-Audit.md.

## 1. Source files changed

Only **src/components/KitchenViewport3D.tsx** changed in the application. This report is the only new repository file from this pass.

The other 38 published baseline files remain byte-identical, including App.tsx, types.ts, task/content modules, translations, UI/audio components, configuration and dependencies. Validation scripts and browser evidence are outside the repository in the task workspace.

## 2. Materials changed

| Surface | Refinement |
| --- | --- |
| Oak cabinets | Remove the extra color tint over the colored grain map; strengthen fine grain, reduce pixel noise, roughness 0.60 → 0.50 and subtle 0.0006 m bump. |
| White cabinets | Slightly warm white, roughness 0.32 → 0.42, metalness 0.02 → 0. |
| Charcoal cabinets | Roughness 0.68 → 0.60; metalness 0.05 → 0. |
| Countertop | Warm white `#faf9f5`, roughness 0.18 → 0.30, metalness 0.03 → 0, envMapIntensity 0.95 → 0.85; subtle procedural bump at 0.00035 m. |
| White Sink body | Slightly cooler `#e9eceb`, roughness 0.25 → 0.34, metalness 0.02 → 0; cavity fill reduced 0.45 → 0.25. Geometry remains unchanged. |
| Chrome faucet | Roughness 0.10 → 0.16 and envMapIntensity 1.50 → 1.00, preserving metalness and geometry. |
| Shared stainless material | Roughness 0.18 → 0.26 and envMapIntensity 1.20 → 1.00. This also affects existing stainless Hood variants. |
| Cooktop glass/frame | Less mirror-like glass and a restrained gray metal perimeter; details in section 5. |
| Textured floor/backsplash | White base material under colored maps removes the previous double tint; lower tile/wood floor bump strength. |

## 3. Texture and color-space improvements

- Colored procedural maps use `THREE.SRGBColorSpace`.
- Bump maps use `THREE.NoColorSpace`.
- `replaceSurfaceTextures` creates a distinct bump texture object from the color map while sharing its canvas image. It disposes old map objects once, including the previous shared-map case, when finishes change.
- Existing pure-black contact-shadow alpha masks remain non-color data. Their pixels and behavior are unchanged.
- Reuse the existing 512 × 512 microcement generator for the countertop bump; no photography or image downloads.
- The only new canvas image is an original **128 × 32** Cooktop control graphic.
- Oak cabinet BoxGeometry UVs use physical face dimensions with a nominal **600 × 1200 mm** grain tile. Only UV attributes change; vertices, indices, hierarchy and bounds remain unchanged.
- The 24 m floor uses **600 mm porcelain tiles** (40 × 40 repeats) and **600 × 1200 mm oak grain tiles** (40 × 20).
- Subway backsplash repeats 9 × 1.75: its existing 4 × 8 tile canvas now represents **100 × 50 mm tiles** over the existing 3.6 × 0.7 m panel.
- All surface images remain 512 square or smaller. No external assets, dependencies or catalog photographs were added.

## 4. Lighting adjustments

The existing lighting and PMREM architecture are retained.

- Hemisphere intensity: 0.90 → 0.70.
- Primary directional intensity: 1.40 → 1.75.
- Existing PMREM backdrop and front/side/floor reflector colors provide darker, more varied metal reflections.
- The same three Cooktop point lights use restrained warm color `#ffd8b2` and intensity **0.06**, replacing strong red/orange/cyan spill.
- The existing IH toggle also restores 0.06 when switched on, and 0 when off.

No extra live lights, bloom, postprocessing, renderer or shadow pipeline was introduced. Existing shadow map size, shadow type, pixel ratio cap, render throttling and animation-loop structure remain unchanged.

## 5. Cooktop visual refinements

Reuse **cooktopGroup**, with `productId = 'cooktop'`, and its existing children.

- Preserve the three-zone horizontal arrangement and 900 × 350 × 5 mm glass plate.
- Outer zone indicators narrow from 15 mm to **3.5 mm** radial width; inner indicators narrow from 23 mm to **2 mm**.
- Retain the same 48/32 ring segment counts and outer radii.
- Replace saturated red/orange/cyan rings with subdued warm outer lines and neutral inner lines.
- Reduce the existing pulse to opacity 0.45 ± 0.08. No new animation was added.
- Glass roughness 0.05 → 0.16, metalness 0.20 → 0 and envMapIntensity 1.15 → 0.85.
- Existing frame receives a modest metal edge treatment through its material. It still has the original box geometry; this is not a new physical bevel.
- Existing three control planes share the original power/minus/plus graphic and one material. Align their Y position with the existing strip's top surface and use polygon offset to prevent depth fighting. The product's maximum Y bound is preserved.

Product clones share the same materials and textures as their originals through the existing installation mechanism. No new clone resource ownership rules were introduced.

## 6. Confirmed Type II light fix

The existing light placement used `cooktopZ + 0.005`, while cooktopGroup used `actualCooktopZ`.

Change only the burner light Z coordinate to:

`actualCooktopZ + 0.005`

In the tested Type II/right-Sink configuration:

- Cooktop group: `[-0.75, 0.85, -0.415]` m.
- Burner light row Z: **0.040 → -0.410 m**.
- X positions remain aligned to the three existing burner offsets.
- Product matrices, installation target coordinates and snapping code are unchanged.

## 7. Before/after visual findings

Thirteen captures use matching viewport sizes, configurations, camera positions and look-at targets. Procedural randomness was seeded for reproducible comparison. Two Type II captures explicitly pin the camera to the recorded baseline position to avoid comparing different points in the existing camera transition.

Observed improvements:

- Oak reads as a fine wood finish rather than flat yellow paint.
- Chrome has recognizable dark/light reflections instead of appearing almost uniformly white.
- The Sink is easier to distinguish from the white countertop.
- Charcoal cabinetry has clearer seams and depth.
- White finishes retain a clean appearance with more readable surface separation.
- The Cooktop has thin, understated zone markings and visible control graphics.
- Red/cyan spill on the cabinetry and backsplash is removed.
- Type II lights now follow the rear cooking row.
- The existing box-shaped Sink and Hood/cabinet overlap remain visible; those geometry changes were outside this approval.

### Screenshot evidence

Evidence stays in the task workspace. Links below resolve locally from this report; they are not additional application files.

| View | Before | After |
| --- | --- | --- |
| Default kitchen | [Before](../../../outputs/v09-visual-before/desktop-default.png) | [After](../../../outputs/v09-visual-after/desktop-default.png) |
| Oak cabinets | [Before](../../../outputs/v09-visual-before/desktop-finish-oak-wood.png) | [After](../../../outputs/v09-visual-after/desktop-finish-oak-wood.png) |
| White cabinets | [Before](../../../outputs/v09-visual-before/desktop-finish-white-w.png) | [After](../../../outputs/v09-visual-after/desktop-finish-white-w.png) |
| Sink close view | [Before](../../../outputs/v09-visual-before/desktop-sink.png) | [After](../../../outputs/v09-visual-after/desktop-sink.png) |
| Cooktop close view | [Before](../../../outputs/v09-visual-before/desktop-cooktop.png) | [After](../../../outputs/v09-visual-after/desktop-cooktop.png) |
| Type II/right-Sink | [Before](../../../outputs/v09-visual-before/desktop-type-ii.png) | [After](../../../outputs/v09-visual-after/desktop-type-ii.png) |
| Mobile Type II training | [Before](../../../outputs/v09-visual-before/mobile-type-ii-identification.png) | [After](../../../outputs/v09-visual-after/mobile-type-ii-identification.png) |

All other layout/Hood captures and raw measurements are in the same before/after directories.

## 8. Performance statistics

Chrome headless with software WebGL. These are renderer counters, not physical-device frame-rate benchmarks. Rendered triangle counts include existing shadow/transmission passes and can exceed the kitchen geometry count.

| Matching view/configuration | Kitchen triangles, before → after | Draw calls, before → after | Rendered triangles, before → after | Resident textures, before → after |
| --- | ---: | ---: | ---: | ---: |
| I-Type, charcoal | 6,306 → 6,306 | 369 → 369 | 13,842 → 13,842 | 8 → 12 |
| I-Type, oak | 6,306 → 6,306 | 369 → 369 | 13,842 → 13,842 | 9 → 14 |
| I-Type, white | 6,306 → 6,306 | 369 → 369 | 13,842 → 13,842 | 8 → 12 |
| Type II/right-Sink, oak | 6,676 → 6,676 | 434 → 434 | 14,820 → 14,820 | 9 → 14 |
| L-Type/right-Sink, oak | 6,526 → 6,526 | 408 → 408 | 14,310 → 14,310 | 9 → 14 |
| Face-to-face/right-Sink, oak | 6,318 → 6,318 | 372 → 372 | 13,878 → 13,878 | 9 → 14 |
| Island/right-Sink, oak | 6,318 → 6,318 | 372 → 372 | 13,878 → 13,878 | 9 → 14 |
| Cooktop close view | 6,306 → 6,306 | 131 → 131 | 2,780 → 2,780 | 8 → 12 |
| Mobile I-Type | 6,306 → 6,306 | 369 → 369 | 13,842 → 13,842 | 8 → 12 |
| Mobile Type II training | 6,676 → 6,676 | 434 → 434 | 14,820 → 14,820 | 9 → 14 |

All 13 matching captures retain the same mesh/triangle/light counts and draw calls. Kitchen material count falls **44 → 42**, because the three control planes share one material.

The texture increase is intentional: separate floor/wall bump objects, countertop bump, the small control graphic, and an additional cabinet bump for oak. Estimated additional RGBA8 storage with mipmaps is approximately **4.0 MiB**, or **5.3 MiB with oak**; this is a size estimate, not a measured GPU allocation. Shader texture sampling increases modestly. Repeated finish and layout changes return to the same resident count; no progressive growth was observed.

### Product bounds and placement tolerances

Full product descendants, including existing details, measured in the normal assembled scene:

| Product | Meshes / triangles, unchanged | World bound size X × Y × Z, unchanged | Placement tolerance, unchanged |
| --- | --- | --- | --- |
| Sink | 67 / 4,898 | 0.764000 × 0.645311 × 0.527000 m | 0.105400 m, horizontal plane |
| Cooktop | 36 / 750 | 0.908000 × 0.006300 × 0.401000 m | 0.080200 m, horizontal plane |
| Range Hood | 10 / 172 | 0.900000 × 0.830000 × 0.600000 m | 0.166000 m, vertical plane |

All 13 comparisons verify product world min/max bounds and root positions within 1e-8 m. The existing tolerance formula remains `20% × min(X, Z)` for horizontal placement and `20% × min(X, Y)` for Hood placement. Exact full-matrix snapping is unchanged.

Raw comparison: [v09-visual-comparison.json](../../../outputs/v09-visual-comparison.json).

## 9. Validation and gameplay regressions

### Commands

| Command | Result |
| --- | --- |
| `pnpm run lint` | PASS — existing `tsc --noEmit`. |
| `pnpm run build --configLoader runner` | PASS — documented validation preload/runner workaround; Vite 6.4.3, 1,694 modules. |
| `git diff --check` | PASS. |

The final viewport chunk is **642.26 kB / 162.24 kB gzip**; the V0.8 audit baseline was 641.11 kB. The existing >500 kB chunk warning remains. No Vite or package configuration was changed and no dependency was installed.

### Browser checks

Reuse the V0.8 browser validation fixtures, changing their evidence filenames only. Six suites pass **246 checks**:

| Suite | Passed checks |
| --- | ---: |
| All four phases, three desktop languages and touch flow | 169 |
| Scenario early exits / Explore regressions | 10 |
| Hood cancellation, tolerance and active-rebuild cleanup | 7 |
| Knowledge early exits via mouse/keyboard/touch | 37 |
| Audio fallback, mobile header and orbit regression | 13 |
| Final localized results/review/restoration | 10 |

An additional **8 focused material/light/resource checks** pass, plus the **13 before/after snapshot comparisons**.

Verified:

- Identification of Sink/Cooktop/Hood, wrong answers, ignored orbit gestures and per-task duplicate scoring locks.
- Sink/Cooktop horizontal placement and Hood vertical placement, wrong drops, staging reset and exact world-transform snaps.
- Original/clone visibility, shared materials/geometry, clone/helper cleanup, pointer cancellation and rebuild during a Hood session.
- Identification **300** → Installation **600** → Knowledge **900** → Customer Scenarios **1200**.
- Final result: all four categories **3 / 3**, each 300 points, total **1200 / 1200**.
- Explicit Next/Preview actions, repeated and stale callbacks, early Return and replay at Task 1 / Score 0.
- All five layouts, Type II/right-Sink, seven configurator steps, five camera presets and Focus Mode.
- Full configuration, upgrades, floor/wall finishes, wizard step, Focus, isolation and exploded-state restoration.
- One active canvas and animation loop, stable listeners and cleaned old listeners on reconstruction.
- Existing audio opt-in, silent default and unsupported/constructor/resume failure behavior.
- Zero application page or console errors in all suites and capture runs. Remote font requests were blocked in the local fixture.

Source comparison additionally confirms eight protected blocks are text-identical after normalizing line endings: product-ID traversal/visibility, installation helpers, resource disposal, camera presets, Raycaster/pointer/OrbitControls logic and the three product-ID assignments.

## 10. Desktop and mobile coverage

- Desktop: 1440 × 1000, complete Japanese, English and Myanmar training flows.
- Mobile emulation: 390 × 844 with touch events, complete four-phase training and exact placement; 430 px Myanmar final UI/header coverage.
- All three language headers checked at 390 and 430 px.
- Touch orbit cancellation and installation framing behavior preserved.
- Mobile render pixel ratio remains capped at 1.75.
- Screenshots were visually inspected for default/oak/white, product close views, Type II and mobile presentation.

**No physical phone or tablet was tested.** No FPS, battery, thermal or real mobile GPU performance claim is made.

## 11. Remaining issues and limits

- Procedural Sink basin/drain geometry and Hood/upper-cabinet overlap retain their existing limitations. Priority 2 and Priority 3 were not implemented.
- The oak pattern remains procedural and repeated; it is a visual approximation, not a product-specific finish scan.
- Strong point-light specular dots are reduced and neutral but can still be visible at close Cooktop angles.
- Texture memory/sampling rises modestly as documented above. A physical mobile check remains useful before release.
- Existing Vite chunk warning and native Windows validation-loader limitation remain.
- This pass does not establish exact Panasonic SKU fidelity or asset redistribution rights. No customer/catalog images or third-party models were incorporated.

## 12. Approximate diff size and delivery

Relative to the accepted V0.8 viewport snapshot:

- **1 application file: +149 / -91 lines**, net +58.
- **1 new report:** outputs/Game-Mode-V0.9-Visual-Pass.md.
- Existing source line endings are preserved where unchanged; newly edited lines pass the repository whitespace check.
- No UI/game/content/configuration files or dependencies were modified.
- The Desktop clone remains clean and unchanged at the published baseline.
- No commit, push, merge, reset or deployment was performed.

Priority 1 is complete. Further 3D geometry changes require the user's next approval.
