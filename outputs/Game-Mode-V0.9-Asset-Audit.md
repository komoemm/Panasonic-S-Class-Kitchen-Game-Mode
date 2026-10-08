# Game Mode V0.9 — 3D Asset Quality Audit

Audit date: **2026-10-08**. Status: **planning only; approval required before asset changes**.

## 1. Verified V0.8 baseline and scope

- Codex source: `C:\Users\OE-DKP-20-006\Documents\Codex\2026-10-01\read-codex-handoff-md-completely-then\work\Panasonic-Kitchen-S--CLASS`.
- Published verification clone: `C:\Users\OE-DKP-20-006\Documents\GitHub\Panasonic-S-Class-Kitchen-Game-Mode`.
- Desktop branch: **`codex/game-mode-development`**; working tree **clean**.
- Desktop commit: **`ac08cdf402dc591eaf9f933136bd9d95571a0aa7`**, `feat: add training results and UX polish V0.8`.
- **All 38 tracked Desktop files match the current Codex files byte for byte by SHA-256**, including all nine accepted V0.8 files. This is the development file-tree baseline. Publication is confirmed by the user; no network fetch was necessary or attempted to establish it.
- Codex retains its earlier Git history and the existing accepted, uncommitted V0.6–V0.8 files. These were preserved. A dirty status against that older HEAD does not contradict the verified V0.8 file-tree match.

Read completely: repository `CODEX_HANDOFF.md`, `docs/S_CLASS_GAME_CONTENT.md`, and the V0.7/V0.8 reports. The handoff's proposed managers/GLB roadmap is historical context. The working V0.8 implementation and this read-only request govern this audit; no architecture from the handoff was implemented.

The only new repository file from this task is **this report**. Application source, dependencies, project configuration and the Desktop clone were left unchanged. No dependency installation, commit, push, merge, reset, branch change or deployment occurred.

## 2. Evidence and comparison limits

Customer reference: [【価格改定】パナソニック キッチン Sクラス.pdf](<C:/Users/OE-DKP-20-006/Downloads/【価格改定】パナソニック キッチン Sクラス.pdf>). No edition/date is inferred from its filename.

Full pages visually inspected for this audit:

| Printed page | PDF page | Use |
| --- | --- | --- |
| 32 | 34 | Complete wall kitchen, cabinetry, room lighting and material relationships |
| 50 | 52 | Door finishes and handle profiles |
| 54 | 56 | Counter materials and 17 mm / 40 mm counter concepts |
| 56 | 58 | Raku-Suru Sink, basin shape, rack, rectangular drain cover; separately labeled Round Access Sink |
| 78 | 80 | Flat Wide series, horizontal zones, three rear vents and front preparation space |
| 98 | 100 | Hottoku Clean Hood 15, fascia, underside and concealed maintenance components |

The comparison is to these catalog concepts, not a claim that the app reproduces an approved manufacturing model or a particular SKU. Catalog photos cannot establish hidden construction, exact radii or every material parameter. Printed colors also cannot certify real sample colors. Dimensions below are explicitly app dimensions unless described as catalog annotations.

Browser inspection used the existing V0.8 production build, served from disk through Playwright request fulfillment without a server or deployment. Chrome rendered desktop **1440 × 1000** and mobile touch emulation **390 × 844**, including Type II/right-Sink/oak. All five existing layouts were viewed; product close-ups used temporary diagnostic camera positions. Cropping in those close-ups is not evidence that the standard presets fail. No source instrumentation was added: scratch code read existing React/Three.js refs.

There were **11 visual/statistics snapshots**, **one connected canvas in each**, **zero application console errors**, and **zero JavaScript page errors**. External font requests were blocked separately. This was a visual audit, not a fresh full gameplay regression or a physical-device FPS benchmark. The accepted V0.8 report records 247 named browser checks and passing lint/build/diff validation; those command/gameplay results were read, not rerun or relabeled as new audit tests.

## 3. Existing implementation locations and protected contract

Primary source: [KitchenViewport3D.tsx](C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/Panasonic-Kitchen-S--CLASS/src/components/KitchenViewport3D.tsx).

| Existing location | Responsibility to reuse |
| --- | --- |
| `rebuildKitchenScene`, line 862 | Owns procedural construction, material creation, layout mirroring, mesh recollection and product availability |
| `sinkGroup`, lines 1638–2061 | `productId: 'sink'`; local root at `(sinkX, 0.85, actualSinkZ)`; added to `counterGroup` |
| `cooktopGroup`, lines 2066–2220 | `productId: 'cooktop'`; root at `(cooktopX, 0.85, actualCooktopZ)`; added to `counterGroup` |
| `hoodGroup`, lines 2283–2348 | `productId: 'rangeHood'`; root remains `(0,0,0)`, with placement in its descendants; added to `wallGroup` |
| `findProductId`, line 29 | Resolves a hit by parent traversal; new product details must stay under their owning group |
| `createProductInstallation`, line 229 | Finds the current tagged group, captures its world matrix/bounds, stages `clone(true)`, builds its existing placement plane/helper |
| `frameInstallation`, line 188 | Frames measured target plus staged clone once through the current camera interpolation |
| `onSelectionPointerDown/Move/Up`, lines 2490–2566 | Existing Raycaster, clone drag, fixed axes, distance validation and world-matrix snap |
| `clearProductInstallation`, line 215 | Restores the original; removes the temporary clone without disposing shared product geometry/materials |
| `disposeMaterial` / `disposeHierarchy`, lines 706 / 717 | Existing geometry, texture, material and shadow cleanup |
| Scene setup effect, line 2371; cleanup around line 2850 | Renderer, PMREM, OrbitControls, pointer listeners and animation lifecycle |

Asset changes must preserve these invariants:

1. Exactly the same three stable IDs and sensible owning groups. No metadata on every detail and no second selection system.
2. Existing live kitchen mesh collection; studio floor/walls remain excluded. Child meshes resolve through `findProductId`. Respect visibility and face orientation.
3. Existing pointer capture/cancel/cleanup, **greater than 6 px orbit rejection**, OrbitControls suspension during drag, and horizontal Sink/Cooktop versus vertical Hood movement.
4. Temporary clones share rigid geometry/materials; originals restore; clone/helper cleanup does not dispose the original's shared resources. Hood light targets must remain independent in the clone.
5. Exact world-transform snapping through the inverse temporary-parent matrix. Do not recenter `hoodGroup` or change root pivots to make a prettier model convenient.
6. Bounds drive staging, helper size, framing and tolerance: **20% of the smaller placement-plane dimension**. A decorative part outside the old envelope can silently change all four. Prefer the current outer envelope; any deliberate envelope change requires explicit review and regression evidence.
7. Preserve mounted viewport behavior across game phases and the existing configuration-rebuild lifecycle. Rebuild clears training before old kitchen disposal and recollects current meshes/IDs. No second renderer, scene, loader-managed game world or animation loop.

## 4. Sink audit

**Current geometry/details.** `sinkGroup` contains a 740 × 440 × 180 mm cavity assembled from a floor plate, four box walls, four thin top strips and four box-shaped bottom “fillets.” These strips are square sections, not curved fillets. There are transparent rim-shadow planes, a cavity fill light, a thin-wire sponge/soap rack, sponge and soap boxes, a circular chrome drain/strainer, and a substantial curved faucet built with cylinders and a 48 × 20 segment tube. Water is a transmissive cylinder with an animated blue ripple. The faucet, rack, water and light belong to the Sink product and therefore participate in its installation clone and bounds.

**Reference gap.** Printed page 56 shows the Raku-Suru basin with softened corners/transitions, a shaped rear deck and a rectangular drain cover. Its diagram annotates approximately 799 × 510 × 194 mm, with a narrower 402 mm region; this is not the app's simple rectangular cavity. The round drain shown elsewhere on the page belongs to the separately named Round Access Sink. The app's circular strainer should not be presented as an exact Raku-Suru reproduction. “Quartz” in source comments is also not evidence of the catalog's Sugo-Pika organic-glass material. Visually, the app basin has hard internal steps and weak white-on-white shading, while chrome often reads as pale plastic. Water and accessory detail are already more elaborate than needed to recognize the Sink.

**Best route.** Improved procedural geometry is sufficient for training: rounded basin corners, genuinely curved lower transitions, a cleaner gapless rim impression, and an original rectangular drain-cover representation. Keep the current overall opening/installation envelope initially. Changing to catalog dimensions would also require the counterpart counter cutout and fitting clearance to change; do not silently scale just the product.

**Blender GLB.** Better only if the customer requests close-up, model-specific shape fidelity and supplies approved references/dimensions. A manually authored rigid mesh can give more controlled continuous curvature and normals. It adds loading, ownership, integration and cutout-fit work that the current game does not need.

**AI image-to-3D.** Low expected benefit. A product photo leaves the cavity, drain, underside and true dimensions incompletely constrained. Any result would need manual inspection, topology/normal correction and fitting. No AI reconstruction was generated or benchmarked in this audit.

**Effort/risk.** Procedural basin/drain pass: **2–3 working days**, including fit checks; medium risk because the cutout, normals and measured bounds interact with placement. Blender authoring: **3–5 days**, plus the first shared GLB integration allowance described in section 10. AI generation may be quick but cleanup/verification makes completion less predictable than either route.

**Performance/gameplay.** Current group: **67 meshes / 4,898 triangles / 15 materials**. It represents about 78% of default kitchen geometry triangles; the faucet tube alone contributes 1,920 triangles. Do not increase wire/faucet detail as a first improvement. Curvature should replace the box-strip construction with a modest tessellation budget. Keep a broad, reliable basin surface for touch hits and preserve faucet/accessory ownership; making Faucet a separate product would change existing behavior and is outside this plan.

## 5. Cooktop audit

**Current geometry/details.** `cooktopGroup` is a 900 × 350 × 5 mm ceramic-glass box with a slightly larger frame, three horizontal burner positions, outer/inner rings and crosshairs, a front touch bar with simple button rectangles, and three rear grille groups containing frames, dark cavities and four slats each. Six animated transparent rings use red/orange/cyan colors. Three matching PointLights are attached to `counterGroup`, not the tagged product.

**Reference gap.** The horizontal arrangement, rear vents, low plate and front work space convey the Flat Wide concept well. The catalog offers different IH/gas and finish variants, so a black top is not inherently wrong. However, the app's thick concentric rings, blue zone, colored cabinet spill and simplified controls have a stylized appearance not supported as an exact state of the pictured product. Edge comments describe a bevel, but the frame is another box. Do not claim the rendered model has all possible series features or controls.

**Best route.** Procedural is fully sufficient. Thin, restrained zone graphics, subtle active-state indication, clearer original control marks and modest edge rounding offer high value. Retain the three-zone geometry and installation group. Do not introduce pot models, gas variants or copied Panasonic panel artwork in this pass.

**Blender GLB.** Little advantage for this predominantly flat asset. Consider one only with an approved exact product model and a close-up requirement; procedural geometry remains easier to fit to mirrored layouts.

**AI image-to-3D.** No material advantage anticipated. This is precise, thin hard-surface geometry whose important visual details can be authored directly; generated thickness and vents would still need checking.

**Effort/risk.** Procedural graphics/material/edge pass: **0.5–1 day**; low risk if roots, bounds and toggle/animation refs remain intact. Blender authoring: **1–2 days**, plus shared integration. Avoid changing geometry just to replace it with an imported file.

**Performance/gameplay.** Current group: **36 meshes / 750 triangles / 18 materials**; no lights inside it. Its full footprint includes rear vents: about **908 × 401 mm**, larger than the glass alone. Preserve that footprint for helpers/tolerance. The current three burner lights use `cooktopZ + 0.005` even in Type II, while the product uses `actualCooktopZ`; lighting stays about 450 mm ahead of the rear product. This is a visual placement discrepancy, not a score or drag defect. A future approved light pass should align light positions with the live cooking row without changing product transforms or clone logic. Avoid adding further transparent layers or real-time lights.

## 6. Range Hood audit

**Current geometry/details.** `hoodGroup` has a 340 × 700 × 320 mm rectangular chimney, a 900 × 60 × 600 mm solid intake slab, a smaller solid baffle, six box fan blades and a green cylindrical hub, plus a Spotlight and its target. Auto-clean upgrade changes the material from stainless to dark metal; it does not create a different cleaning mechanism. Although comments mention a slanted canopy/cavity, the constructed intake is a box with no modeled opening. The baffle lies within that slab's volume. Fan animation affects the original referenced fan group.

**Reference gap.** Printed page 98 shows a complete front fascia/control strip, a finished underside/rectifier assembly and normally concealed fan/plate/ring components. The app's generic chimney and flat slab do not explain that exterior well; an emerald hub is not a demonstrated Panasonic product feature. Its continuous full-width upper cabinet also occupies volume behind/around the hood. In default and close views the hood competes with dark cabinet faces, reducing its independent silhouette. A detailed imported hood would retain this presentation problem unless cabinetry integration were addressed.

**Best route.** A modest procedural enclosure/fascia and readable underside are sufficient. Preserve the existing tagged root, light/target ownership, outer bounds and vertical placement. Resolve the cabinet/hood overlap by reserving the appropriate existing cabinet span around the hood, under the existing detail/layout rules. This needs explicit approval because it changes cabinet geometry as well as Hood detail. No exploded maintenance simulation or new fan gameplay is needed.

**Blender GLB.** Potentially the strongest candidate of the three if exact fascia/underside fidelity later becomes a requirement. It is still unnecessary for a basic recognizable hood. A customer-approved rigid, low-detail exterior model could be useful; no catalog-derived mechanism accuracy should be promised without appropriate reference data.

**AI image-to-3D.** Low expected benefit. Hidden fan/filters, flat panels and accurate front/underside assembly would need manual reconstruction anyway. It does not resolve the current cabinet intersection.

**Effort/risk.** Procedural enclosure plus cabinet integration: **1.5–3 days**, medium risk. Blender authoring: **2–4 days**, plus shared integration and cabinet fitting. A material-only change is safer but cannot solve silhouette/occlusion.

**Performance/gameplay.** Current group: **10 meshes / 172 triangles / 4 materials / one Spotlight**. Small exterior geometry additions can be inexpensive; more shadow lights or a fully modeled internal turbine offer poor training value. Keep the unusual zero-position root and descendant offsets. Preserve independent clone light targets, fixed-Z vertical drag, measured height and exact original world matrix. A taller chimney would enlarge staging/framing/tolerance and is excluded from the minimal pass.

## 7. Cabinets and countertop audit

**Current geometry/details.** `baseCabinetGroup`, `drawerFrontsGroup`, `plinthGroup` and `counterGroup` use box carcasses/panels, dark rectangular handles, thin gaps and a recessed 140 mm metallic plinth. The main run is 2550 mm wide and 850 mm high. There are three drawer columns (three tiers normally; Type II's front uses two tiers), a simplified opening dishwasher/rack option, and four full-width upper doors. Countertop is a constant white, 40 mm slab assembled from rectangular pieces around the Sink opening. Its front “chamfer” is an 8 mm-radius cylinder rather than a slab bevel. L Type has a 1150 × 650 mm return; Type II has two runs; facing/island share the deeper straight-counter construction.

**Reference gap.** The catalog demonstrates varied, deliberately composed cabinet divisions, handle/line-handle profiles, end panels and stone/wood finishes. The generic boxes and repetitive handles read adequately at a distance but have hard edges and inconsistent end-panel finish in some views. Constant white “quartz” does not reproduce all listed artificial-marble/Sugo-Pika/stainless counters. A 40 mm slab is a valid catalog concept, so changing every counter to the 17 mm slim option would not be an accuracy fix. The modeled studio lacks the room proportions, windows and furnished context of the catalog photographs.

**Best route.** Keep parameterized procedural cabinets/counters. Small edge bevels, deliberate seams/end panels, consistent grain scale and a clean sink opening offer sufficient quality. Cabinet-span clearance for the Hood belongs in the Hood improvement. Avoid cataloging every door/handle/counter variant in V0.9.

**Blender GLB.** Useful for a fixed presentation kitchen, but worse for this application's mirrored products, two counters, L return, visibility, dishwasher and exploded groups unless many variants or additional fitting code are introduced. A whole-kitchen GLB replacement has poor compatibility/value here.

**AI image-to-3D.** No meaningful advantage for exact modular cabinetry. A generated whole kitchen would not arrive with the required semantic groups, dimensions, editable seams or compatible installation parts.

**Effort/risk.** Targeted procedural edge/end-panel work: **1–2 days**, medium risk at sink opening/hood span and low risk for surface finishing. Manually authored cabinet/whole-kitchen variants: approximately **4–8 days** before shared integration/variant validation; high integration risk. These are optional estimates, not recommended scope.

**Performance/gameplay.** Keep large flat panels simple; a few edge segments are enough at training distance. Cabinets remain untagged “other” hits. Retain exploded/isolation owning groups and the dishwasher pivot. Changes must not block the three product touch surfaces or disturb the sink cutout. More detailed geometry cannot repair the existing layout semantics: Type II has a 300 mm modeled gap and two 2550 mm runs, and facing/island do not demonstrate an independent island. Preserve the V0.7 documented mapping limits; a dimension/layout correction is separate work.

## 8. Materials, lighting and textures audit

**Current setup.** Most surfaces use `MeshStandardMaterial`. Chrome/stainless use high metalness; cabinet options are charcoal, warm oak and white. The countertop is roughness 0.18, metalness 0.03; Sink is roughness 0.25, metalness 0.02. Glass is almost black, roughness 0.05, metalness 0.2. Only water uses `MeshPhysicalMaterial` transmission. Lighting combines a generated neutral PMREM studio environment, HemisphereLight, one shadow-casting DirectionalLight, product lights and under-cabinet fill. Directional shadows are 2048² PCF soft shadows. ACES tone mapping exposure is 1.05; renderer output is sRGB; pixel ratio is capped at 1.75.

Procedural 512² canvas textures generate oak grain, microcement, subway tile, porcelain and concrete; a smaller canvas makes contact shadow. There are no imported product models or catalog image textures in the tracked tree. Colors/maps are reused with bump maps in wall/floor materials. The texture creators do not assign a color space. Runtime observations confirm the oak color map remains `NoColorSpace`. Random noise changes on recreation; repeating texture scale is generic rather than consistently tied to real panel dimensions. For example, one tile pattern repeated eight times across the 24 m floor gives roughly 3 m cells, despite the 600 mm comment.

**Reference gap.** Current whites and chrome have weak tonal separation; oak is a fairly uniform warm color at normal distance. Sharp edges lack the small highlights seen in product photos. Colored cooktop lights tint otherwise neutral cabinetry. These gaps affect the entire view more than additional polygon detail would. Catalog photos include controlled exposure, microtexture and room bounce; photoreal parity is not expected from the current simplified studio.

**Best route.** Improve the existing procedural materials and studio light balance: correct color-map handling, separate non-color bump data where necessary, reduce duplicated wood tint, set sensible world-scale repeats, give cabinet/counter finishes restrained microtexture, and restore readable metal highlights. Tune existing lights/environment rather than add postprocessing or lights. Keep toggle functionality and original selected finishes/restoration.

Color maps should use sRGB while bump/roughness/normal data remain non-color. Because some current color and bump slots share the same texture object, simply changing that object's color space is insufficient; their data roles must be separated deliberately. Material base color also multiplies a color map. These are established Three.js material rules, not an instruction to change renderer architecture. [Three.js color management](https://threejs.org/manual/pages/color-management.html), [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html).

**Blender GLB.** Does not by itself improve scene lighting, exposure or texture scale. Authored textures could be useful independently of a mesh replacement, provided licensing is clear. Keep the current in-code world/material path.

**AI image-to-3D.** Does not solve this scene-wide issue. Do not bake photographic highlights/shadows or Panasonic imagery into textures as a shortcut; they would conflict with moving clones and runtime lights.

**Effort/risk.** Coordinated existing-material/light pass: **1–2 days**, low gameplay risk when it changes only appearance. Shared clone materials mean appearance changes affect originals and training clones together. Do not mutate clone-only material values without clear ownership or change disposal/animation assumptions.

**Performance.** Keep 512² maps by default, test one 1024² map only if close-up evidence justifies it, and avoid 4K product textures. Uncompressed RGBA mipmapped textures cost about **1.33 MiB at 512²**, **5.33 MiB at 1024²**, and **85.33 MiB at 4096²** each, before other resources; download size is not GPU memory size. [Three.js texture memory guidance](https://threejs.org/manual/pages/textures.html#memory-usage). Wider use of transmission/clearcoat or other physical-material effects can increase per-pixel cost, so keep them selective. [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html).

## 9. Overall quality and measured performance

**Assessment:** recognizable, coherent training prototype with sufficient product separation for the accepted gameplay, but below a catalog-like customer presentation. Its principal weaknesses are surface response, squared Sink transitions and Hood/cabinet composition. More models or higher polygon counts alone would not fix these.

| Observed view | Kitchen meshes | Kitchen triangles | Materials | Renderer calls / rendered triangles |
| --- | ---: | ---: | ---: | ---: |
| Default I Type / charcoal | 150 | 6,306 | 44 | 369 / 13,842 |
| Type II / right Sink / oak | 173 | 6,676 | 44 | 434 / 14,820 |
| L Type / right Sink / oak | 164 | 6,526 | 44 | 408 / 14,310 |

Kitchen triangle counts sum mesh geometry once, including descendants. Renderer counters include the current view's multiple passes and differ with visibility; they are not equivalent to kitchen polygon counts. GPU-resident geometry/texture counters were 156/8 for default and 173/9 for Type II in these observations, not byte measurements. The kitchen has six local lights in the default configuration. Shader lighting, transparency/transmission, shadow rendering and numerous small meshes matter alongside triangle count.

The current RAF skips hidden-tab rendering and throttles idle animation rendering to 30 FPS; active interactions can render at the browser rate. Default water/burner/fan animations keep background rendering active. Clones share geometry/materials but still render an additional object hierarchy; hiding the original does not mean all sibling product lights move with the clone. Keep existing behavior rather than add asset-specific animation infrastructure.

For an approved small procedural pass, suggested **planning budgets**, not proven hardware limits: keep worst-case kitchen geometry under about **10,000 triangles**, avoid increasing current visible draw calls, add no real-time lights/postprocessing, and minimize new material/texture allocations. Real phone testing must determine whether these budgets are sufficient. Headless Chrome uses software WebGL here and cannot certify real mobile frame time, heat or battery life.

## 10. Procedural vs Blender vs AI decision

| Route | Fit for this project | Decision |
| --- | --- | --- |
| Targeted procedural edits | Exact control of roots, bounds, grouping and variable layouts; no network model loading | **Recommended** for all three products and cabinets |
| Original Blender-authored rigid GLB | Useful for approved, exact close-up product shapes, particularly Sink/Hood; not inherently faster or more performant | **Optional later**, only after a procedural pass proves insufficient |
| Approved manufacturer GLB | Can improve fidelity if model, rights, dimensions and mobile budget are suitable | Assess the specific file; availability alone is insufficient |
| AI image-to-3D | Potential concept draft; cannot be assumed to supply measured dimensions, clean thin surfaces, hidden parts or current semantic groups | **Not recommended for V0.9/V1.0 core assets** |
| Whole-kitchen GLB replacement | Makes current layout mirroring, rebuilds and product isolation harder to preserve | **Reject for this scope** |

AI shape/texture generation exists, including systems with separate generation stages; this audit's low-benefit judgment is an inference from the precise, modular assets needed here, not a claim that every tool fails. No vendor quality/speed comparison was run. [Hunyuan3D 2.1 primary paper](https://arxiv.org/abs/2506.15442).

If GLB is later approved, budget **2–3 additional working days for the first shared loading/integration path and lifecycle tests**, beyond the asset authoring estimates. Keep the current tagged procedural owner as a wrapper, fit static imported descendants in its coordinate system, and preserve its pivot/envelope. Imported geometry still needs shadow flags, selectable mesh recollection and correct material response. Loading must ignore stale completions after rebuild/exit; disposal/cache ownership must account for shared clones. These are design requirements for later review, not changes made here. Three.js also documents special disposal handling for image bitmaps loaded with GLTFLoader. [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html).

Use original authored geometry/procedural textures or specifically approved/licensed assets. Customer provision of a catalog is permission to inspect this reference in context, not proof of permission to redistribute its photography or upload images to an external generation service. Do not package the catalog renders or copied panel artwork with the application. For any later external asset/AI workflow, verify both input rights and the relevant output/tool license for the intended use. No commercial assets were downloaded, generated or adopted in this audit.

## 11. Top three improvements and prioritized implementation plan

Estimates assume one developer comfortable with the existing Three.js code, roughly 6–8 focused hours per working day. They are planning ranges, not commitments; approved reference selection and device availability can extend them. The first pass combines related appearance work to avoid paying for separate lighting reviews per asset.

| Priority | Proposed change | Customer value | Time | V0.8 compatibility / risk | Mobile impact |
| --- | --- | --- | --- | --- | --- |
| **1** | **Materials/light balance and restrained Cooktop graphics:** texture color-space/data roles, oak/counter finish response, correct texture scale, chrome contrast, thinner zone indicators and Type II light alignment | Very high: improves the complete kitchen and every phase | **1.5–2.5 days** combined | High compatibility; low risk with roots, mesh sets, toggles and lifecycle retained | Neutral or favorable if existing lights/layers are reused; no extra physical effects |
| **2** | **Sink basin/rim/drain refinement:** rounded transitions and original rectangular drain cover fitting the existing opening/envelope | High: first identified/installed product; better matches the knowledge concept | **2–3 days** | Medium: counter fit, normals and measured bounds must be checked | Small geometry increase can be offset by replacing redundant strip meshes; retain current faucet/rack detail |
| **3** | **Hood silhouette/underside and cabinet fit:** readable fascia, enclosed mechanism, visible underside and reserved cabinet span | High: clearer third product and more credible customer view | **1.5–3 days** | Medium: cabinet overlap, zero root, light target and vertical staging are sensitive | A few opaque faces are inexpensive; no extra lights or turbine detail |

### Execution order, only after approval

1. Retain verified V0.8 and the present SHA proof. Agree whether the goal is concept recognition or an exact named-product exterior. For the minimal plan, approve visual approximations within existing dimensions.
2. Implement priority 1 solely in existing texture/material/light and Cooktop construction blocks. Compare fixed desktop/phone views in charcoal/oak/white. Preserve the existing active/off controls, selected finishes and clone sharing.
3. Implement priority 2 inside `sinkGroup` and the existing matching cutout construction only where necessary. Keep product roots/outer envelope; replace the rectangular inner transitions, not the game logic. Check cutout corners do not leave gaps or block touch hits.
4. Implement priority 3 inside `hoodGroup` and the affected upper cabinet construction. Keep the Hood root, world transform, overall envelope, light target and existing detail visibility rules. Review all mirrored layouts and center/side Hood options; do not redesign layouts.
5. Reserve **1–2 days of shared integration validation** after the selected changes. Full three-improvement plan is approximately **6–10.5 working days** including that validation. Priority 1 alone is the lower-risk short option.
6. Stop once the agreed visual acceptance is met. General cabinet bevels/end-panel polish can follow later; GLB loading, AI generation, new scenes, layout dimension repairs and full room furnishing are deferred.

Expected application change scope, if approved: primarily the existing viewport file's procedural construction/material blocks. Do not change App scoring/tasks, shared product IDs, installation/Raycaster handlers, content questions, or dependencies to perform these visual passes. Do not turn this into a large helper/module refactor.

### Required validation for future asset edits

- Product child hits resolve to the same IDs; untagged kitchen stays `other`; background/studio is ignored. Wrong/repeated/stale answers and orbit rejection remain unchanged.
- Sink/Cooktop horizontal and Hood vertical installations; inside/outside tolerance drops; exact world matrix after snap; clone light target; repeated Return/replay and pointer cancellation.
- Compare old/new product envelopes and derived tolerances, stage positions and one-time framing at desktop/390 px. Explain any changed numeric bounds before accepting them.
- All five layouts, left/right Sink, side/center Hood, missing-product configurations, dishwasher pivot, finish changes, isolation/exploded settings and configuration restoration.
- Full **300 → 600 → 900 → 1200** journey, results/review, all languages, sound on/off and replay; one canvas/RAF/listener set after transitions and no errors.
- Run existing lint, production build (documented Windows preload if needed) and `git diff --check`. Compare draw calls, triangles, textures and memory across repeated rebuilds; verify shared product resources survive clone removal.
- At least one representative real phone: orbit/drag responsiveness, readability, texture shimmer, heat and several complete sessions. No performance guarantee based solely on emulation.

## 12. Can V0.9 be skipped for V1.0?

**Yes, the asset implementation milestone can be skipped.** The accepted V0.8 already supplies the complete four-phase 1200-point training journey, results/review and the verified product/placement systems. No new model format or higher fidelity asset is technically required for V1.0.

Recommendation: proceed directly to **V1.0 release planning/acceptance** if the customer approves a schematic concept-training experience and the documented layout limits. Finish actual target-device/content/translation acceptance and release checks in that plan. This audit is not deployment authorization or a claim that those release checks are complete.

If V1.0 will be sold or reviewed as a faithful Panasonic showroom/product visualization, do not skip the visual review: approve at least priority 1 and preferably the Sink/Hood corrections, using approved reference scope. A GLB/AI asset pipeline still need not be part of V1.0. Current Type II dimensions and facing/island limitations must not be presented as validated planning or installation dimensions.

## 13. Audit evidence and final safeguards

- Baseline 38-file SHA proof: [v09-audit-baseline-proof.json](C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/v09-audit-baseline-proof.json).
- Browser observations: [observations.json](C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs/v09-asset-audit/observations.json).
- Application screenshots: task-level `outputs/v09-asset-audit`, outside the application repository. Catalog renders are private scratch reference files under task-level `work/tmp/pdfs/v09-audit`, also outside the repository; they were not copied into application assets.

Post-report verification confirms all 38 baseline source files remain SHA-identical to the clean Desktop clone. The only additional Codex repository status entry from this task is `?? outputs/Game-Mode-V0.9-Asset-Audit.md`; the previously accepted changes remain intact. No actual asset/source changes have started. Awaiting the user's choice/approval of implementation scope.
