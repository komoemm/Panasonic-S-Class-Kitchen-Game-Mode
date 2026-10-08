# Game Mode V1.0 Release Readiness Audit

Audit date: 2026-10-08. Baseline: accepted V0.9 Priority 1 Visual Pass. Scope: read-only audit of application code, plus this report. No application fixes, dependency installation, Git history changes, commits, pushes or deployment were performed.

## Recommendation

**NO-GO for general customer deployment in the current form.** The complete training journey works, and the accepted V0.9 implementation is preserved. Before public release, address the P1 findings below and complete the release verification gates. A supervised concept demonstration on an already tested browser is a narrower use case; it does not establish production readiness.

No P0 security/data-loss defect was demonstrated. This is not a security certification: fresh dependency installation, registry vulnerability auditing, real hosting headers, Safari and physical-device performance remain unverified.

## 1. Baseline verification

| Check | Result |
| --- | --- |
| Codex working repository | C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/Panasonic-Kitchen-S--CLASS |
| GitHub Desktop verification source | C:/Users/OE-DKP-20-006/Documents/GitHub/Panasonic-S-Class-Kitchen-Game-Mode |
| Branch in both repositories | codex/game-mode-development |
| Published Desktop checkpoint | d5fe53d45d22258584177bd61b234e48cfb42a46 |
| Desktop working tree | Clean before and after the audit |
| Exact content verification | All 40 Desktop-tracked files matched the Codex working files by SHA-256; zero mismatches |
| Codex Git HEAD | 8efc53aaad1ba852f41ed7046bcbeffee99a4aa5; accepted V0.6–V0.9 changes remain in its existing working tree |
| Baseline decision | The matching V0.9 file tree is the development baseline. Differing local commit ancestry was preserved |

The Desktop clone was used as the local published checkpoint, as authorized. This audit does not independently prove the current remote GitHub tip. No fetch, reset or unrelated-history merge was required. The 40 existing file hashes remained unchanged after validation.

Read completely: CODEX_HANDOFF.md, docs/S_CLASS_GAME_CONTENT.md, outputs/Game-Mode-V0.7.md, outputs/Game-Mode-V0.8.md, outputs/Game-Mode-V0.9-Asset-Audit.md and outputs/Game-Mode-V0.9-Visual-Pass.md. Historical roadmap suggestions in the handoff were treated as context, not instructions to add systems.

Baseline hash evidence is outside the application repository:

- C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/v10-baseline-proof.json
- C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs/v10-file-audit/file-audit-results.json

## 2. Feature completeness

| Feature | Audit result |
| --- | --- |
| Identification | Sink, Cooktop and Range Hood; generic product IDs and parent traversal; 3 × 100 points |
| Installation | Shared generic session; temporary clone; horizontal Sink/Cooktop and vertical Hood drag; measured tolerance; complete world-matrix snap; 3 × 100 |
| Product Knowledge | Three catalog summaries and questions, wrong-answer retry, explicit progression; 3 × 100 |
| Customer Scenarios | I-Type, II-Type and L-Type; answer does not change layout; explicit preview via existing configuration setter; 3 × 100 |
| Results | Four categories at 300/300 each; total 1200/1200; completion 100%; localized twelve-item review |
| Explore preservation | Seven steps, five layouts, camera presets, Focus Mode, full configuration/finish restoration and training suspension of isolation/exploded state |
| Optional sound | Off by default; opt-in Web Audio; disabled/unsupported/resume-failure behavior does not block gameplay |
| V0.9 visuals | Materials, lighting and Cooktop refinements are unchanged; no new models or loaders |

The intended V0.1–V0.9 feature set is complete. Authentication, cloud scores, placement solvers, manufacturing drawings and official quotations are not implemented release requirements for this concept training application.

## 3. Full gameplay regression results

Production dist bytes were served through Playwright request routing to a local fixture URL. Chrome used headless software WebGL with --enable-unsafe-swiftshader. React refs/callbacks were inspected from the test harness; no production test hooks were added. Physical browser mouse/CDP touch actions exercise selection and dragging, while repeated/stale callbacks are invoked directly to test logic locks.

Google Fonts requests were deliberately blocked and kept separate from application-error accounting. These tests validate the compiled application and fallback-font layout, not a real CDN, HTTPS deployment, physical phone GPU or Safari.

| Suite | Passed checks | Scope |
| --- | ---: | --- |
| Full journey | 169 | Japanese, English, Myanmar desktop 1440×900; English phone 390×844 |
| Scenario exit / Explore | 10 | Early exits, stale session actions, full Type II/right-Sink restoration, seven steps, five layouts and camera presets |
| Audio / phone controls | 13 | Opt-in/off, unsupported/constructor/resume failures; all languages at 390/430; orbit cancels installation framing |
| Final results / review | 10 | Three desktop languages; English 390 and Myanmar 430; scroll, review, Return and replay |
| Phone 430×844 full journey | 43 | English native touch emulation through 1200 |
| Tablet 768×1024 full journey | 43 | English native touch emulation through 1200 |
| Knowledge exit Q1/Q2/Q3 | 37 | Mouse, keyboard buttons and native touch; configuration restoration and stale callback rejection |
| Hood cleanup / rebuild | 7 | Cancel/lost capture, active-drag Return/rebuild, tolerance boundary, world matrix, repeated drops and replay |
| **Total** | **332** | **All final regression suites passed** |

Each check can contain several assertions; this is not a code-coverage percentage. Final normal-flow suites recorded zero application page errors and zero application console errors.

Verified journey:

1. Identification: wrong mesh retains task/score; each correct product awards once; explicit Next; score 300.
2. Installation: wrong drop awards nothing, resets own staging and preserves camera; correct drop snaps the complete world matrix once; explicit Next; score 600.
3. Knowledge: wrong choices retry; correct answers award once; repeated/stale callbacks cannot score or skip; explicit Next; score 900.
4. Scenarios: wrong/correct answers do not rebuild or alter layout; preview alone applies the existing layout, awards no points and is safe when repeated; explicit Next Customer; score 1200.
5. Final results show identified/installed/knowledge/scenarios 3/3, category scores 300/300, total 1200/1200 and 100%. Review lists all twelve items and changes neither configuration nor score.
6. Return restores the captured complete configuration, nested upgrades, finishes, wizard/Focus and suspended isolation/exploded settings. Replay starts Find Sink, Task 1/3, score 0.
7. Orbit gestures do not answer; target and staging bounds fit installation cameras; one connected canvas and one pending animation frame remain; obsolete canvas pointer listeners are removed.
8. Sound requests occur once per accepted result; the enabled complete journey requests twelve correct cues and four completion cues. Disabled sound produces no new tones.

Deliberate failure injection found two runtime gaps, recorded separately from normal gameplay: denied clipboard writing produces an unhandled rejection; unavailable WebGL produces an error and an empty application root. See P1-01 and P2-04.

Harness corrections: an initial desktop selection coordinate inherited from a taller viewport missed the Sink at 1440×900; the final full suite projects a known Sink surface point. The first knowledge-exit run attempted a drag before the moving installation camera had settled under concurrent software rendering. Waiting for measured camera stability made all three exit cases pass. The first modal audit read the lazy-loaded modal before it appeared; the final failure audit explicitly waits for it. No application code changed to make these tests pass.

Evidence directory: C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs. The eight game-mode-v1.0-*results.json files contain the final checks. Screenshots and harnesses are outside the application repository.

## 4. Build and dependency health

| Command / inspection | Result |
| --- | --- |
| pnpm run lint | PASS; script runs tsc --noEmit |
| pnpm run build without preload | FAIL: Windows EPERM realpath on this sandbox's node_modules, before Vite runs |
| pnpm run build with existing external validation preload | PASS; normal vite build, Vite 6.4.3, 1694 modules, 25.10 seconds |
| git diff --check | PASS |
| Missing local HTML asset references | None; generated entry JS and CSS exist; lazy modal/viewport chunks load in browser suites |
| Source maps | None in the production output |
| Application environment access | No required game runtime environment variable, backend/API request or secret-bearing client integration found |
| Limited secret-pattern scan | No common Google/OpenAI/GitHub/AWS/private-key signature found in the 40 baseline files or generated dist files |
| Fresh installation / dependency advisory audit | Not performed; no lockfile exists and no dependencies were installed during this read-only audit |

### Windows workaround

The existing external work/v08-validation-preload.cjs catches EPERM for realpath operations under the task work directory and falls back to the JavaScript realpath implementation. It also loads the existing runner preload. With that preload, the ordinary package build command succeeds; a separate runner-mode build was unnecessary.

Example of the validated environment, using external paths rather than modifying project configuration:

```powershell
$env:NODE_OPTIONS = '--require C:\Users\OE-DKP-20-006\Documents\Codex\2026-10-01\read-codex-handoff-md-completely-then\work\v08-validation-preload.cjs'
$env:PATH = 'C:\Users\OE-DKP-20-006\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:PATH
pnpm run lint
pnpm run build
```

The preload is not imported by the application or included in dist. Evidence points to this environment's filesystem/symlink permissions, not a browser dependency or demonstrated deployment defect. A clean install/build on the chosen build host without the preload is still a release gate. Do not put this workaround into production browser code or rewrite Vite configuration on this evidence.

### Production output

| File | Bytes | Gzip bytes |
| --- | ---: | ---: |
| index.html | 7,399 | 2,466 |
| Entry JS | 358,414 | 102,547 |
| KitchenViewport3D JS | 642,256 | 162,240 |
| Entry CSS | 57,303 | 10,023 |
| BlueprintModal JS | 7,585 | 2,437 |
| QuotationModal JS | 21,112 | 7,169 |
| Shared icon chunk | 327 | 257 |

The viewport chunk includes the application viewport implementation and bundled Three.js code; 642,256 bytes is not a measurement of Three.js alone. The existing Vite >500 kB chunk warning remains. This is a measured transfer/parse cost, not a demonstrated gameplay failure. No bundle optimization was applied.

### Dependency reproducibility

No pnpm-lock.yaml, package-lock.json, yarn.lock or pnpm-workspace.yaml is present. package.json uses ranges and has no engines or packageManager pin. The README incorrectly describes committed pnpm lock/workspace policy and instructs a frozen install. An explicitly frozen pnpm install cannot generate the missing lockfile. [pnpm installation documentation](https://pnpm.io/cli/install)

Validated resolved versions from the bundled runtime include Node 24.19.0, React/React DOM 19.3.0, Three.js 0.186.1, Vite 6.4.3, TypeScript 5.8.3, @vitejs/plugin-react 5.2.0 and Tailwind 4.3.3. These are the actual audit versions, not guaranteed versions on a fresh host. The installed React Vite plugin declares Node ^20.19.0 or >=22.12.0. Choose and pin a supported build runtime/package manager and validate its resolved graph.

Vite is listed in both dependencies and devDependencies. @google/genai, Express, dotenv and motion have no source imports found. Removing unused dependencies is optional hygiene, not an audit-time change. lint provides type validation rather than a full lint/security policy; tsconfig does not enable strict mode and skips library checking. These do not invalidate the passing runtime tests.

### Repository / environment safety

.env.example contains an empty optional GEMINI_API_KEY and is not needed for the game. The committed .gitignore covers .env, .env.local, node_modules, dist and logs. Additional .env.production/.env.staging/.env.*local protection observed in Codex comes from local .git/info/exclude (.env*), not the shared .gitignore; that protection will not travel to fresh clones. No populated root environment file was observed. Extend shared ignore policy after approval; retain .env.example deliberately.

The signature scan does not inspect all Git history, detect every possible secret or replace a dependency/security review. No source uses dangerouslySetInnerHTML, eval, localStorage or sessionStorage in the searched application code. Current state/scores remain local to the page session.

## 5. Three.js performance observations

### Measured render cost

Desktop 1440×900, default I-Type with active equipment effects, software WebGL:

| Measurement | Result |
| --- | ---: |
| Render calls including shadow work | 369 |
| Rendered triangles including shadow work | 13,842 |
| Kitchen geometry triangles before render-pass repetition | 6,306 |
| Current renderer geometries | 156 |
| Current renderer textures | 12 |
| Pixel ratio in this fixture | 1; source caps real device pixel ratio at 1.75 |

A tested Island/oak configuration used 157 geometries, 14 textures, 372 render calls and 13,878 rendered triangles. Returning to the same oak I-Type yielded stable current counts of 156 geometries/14 textures across five rebuilds. The final performance screenshot has equipment effects disabled and therefore lower render work (229 calls/7,942 triangles); do not compare those numbers as an asset optimization.

Triangle counts are modest, but hundreds of submissions plus shadows, transparency, PBR materials, generated texture work and backdrop-blur UI can cost time on phones. No phone FPS or GPU memory budget is established here. Texture counts include renderer-managed resources and are not texture-byte totals. Most procedural finish canvases are 512×512; the Cooktop label is 128×32.

### Renderer churn and duplicate construction — demonstrated

rebuildKitchenScene depends on the full config object. The renderer setup/cleanup effect depends on that callback. It calls the reconstruction function, and a second effect also calls reconstruction. A configuration update therefore tears down the renderer/context, creates a new one, and builds three tagged product roots twice.

Measured across 25 configuration updates:

- 26 WebGL contexts created, 25 renderer disposals and 25 forced context losses.
- 150 tagged root additions: six per update rather than the three required for one kitchen construction.
- One connected canvas and one pending animation callback remained after settling.
- Equal-value configuration objects still triggered the same lifecycle. StepWizard layout selection and cabinet-finish setters can generate such objects.

Source evidence: C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/work/Panasonic-Kitchen-S--CLASS/src/components/KitchenViewport3D.tsx:2427 (callback dependencies), :2430 (setup), :2985 (setup effect dependencies), :2988 (second reconstruction effect). This is existing lifecycle behavior, not a V0.9 visual regression.

### Memory stress follow-up

An independent 40-update run repeatedly applied the same I-Type configuration object with equal field values. Instrumentation uses WeakSet for contexts rather than keeping old canvases/renderers alive. Each sample followed four seconds of settling, two explicit Chrome GC requests separated by one second, then Runtime.getHeapUsage.

| Equal-value updates | JS heap used, bytes | Current geometries/textures | Contexts created/disposed |
| ---: | ---: | --- | --- |
| 0 | 7,784,976 | 156 / 12 | 1 / 0 |
| 10 | 9,494,292 | 156 / 12 | 11 / 10 |
| 20 | 11,043,364 | 156 / 12 | 21 / 20 |
| 30 | 12,132,988 | 156 / 12 | 31 / 30 |
| 40 | 12,972,608 | 156 / 12 | 41 / 40 |

Heap growth of approximately 5.19 MB after GC is demonstrated over this sample; a stable plateau was not demonstrated. Current GPU counters stay flat and old renderer disposal runs. Those facts do not prove that all resources are reclaimed, and the heap samples do not identify a retaining object, an unbounded leak or native GPU memory. Use heap-retainer analysis and physical long-session testing before concluding leak severity. Do not claim 'no memory growth'.

### Cleanup and idle behavior

Source cleanup cancels RAF, removes listeners, disposes OrbitControls, shadow maps, scene geometries/materials/textures, environment render target and renderer, and forces context loss. Clone meshes share original geometry/materials; installation cleanup disposes the helper's owned resources and restores the original instead of destroying shared clone resources. Hood cancellation/rebuild tests confirm this ownership path and live product rediscovery.

With effects active, the fixture rendered 28 frames over 2.5 seconds. After water/fan/burner effects were switched off and transitions settled, it rendered zero frames over 2.5 seconds. With document.hidden simulated, it rendered zero frames over 0.8 seconds. One RAF callback remains scheduled to check state. Source throttles idle animations toward 30 FPS; the software-rendered fixture's observed frame rate is not a hardware performance rating.

Camera presets/keyboard orbit and touch orbit work. Pointer interaction cancels pending installation framing. Framing currently converges by per-frame interpolation, so its elapsed duration depends on render rate; test low-end hardware and interaction during the transition.

External evidence:

- C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs/v10-performance/performance-results.json
- C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs/v10-memory/memory-results.json

Renderer changes need separate approval. Preserve productId ownership/parent lookup, the existing Raycaster, clone sharing, world-transform snapping, drag planes/tolerances and training restoration during any future lifecycle fix.

## 6. Mobile and accessibility

| Area | Result |
| --- | --- |
| Viewports | 390×844, 430×844, 768×1024 and 1440×900 tested |
| Languages | All three desktop full flows; all three header/first-task checks at each size; English phone/tablet full touch flows; Myanmar 430 final UI |
| Touch selection/installation | Native emulated touch flow passes all three products, wrong drops and replay |
| Camera/orbit | Framed target+staging, vertical Hood interaction and orbit-without-answer pass |
| Scroll / overflow | Necessary buttons reachable by scrolling; no horizontal document overflow in tested states; camera preset toolbar has its own scrolling behavior |
| Controls | Core progression/Return/results controls at least 48 px tall in tested training views; sound toggle 44 px; usable header language controls |
| Keyboard buttons | Start, Return and ordinary knowledge/scenario/results controls support browser keyboard activation |
| Visible focus | Training sound button shows a visible 2 px focus ring in all twelve size/language checks |
| Feedback | Existing status / aria-live=polite / aria-atomic feedback observed; configuration wizard announcements exist |
| Scene keyboard access | Camera navigation exists; identification selection and installation placement have no keyboard completion path |
| Document language | html lang stays ja after selecting English or Myanmar; Myanmar screen-reader region labels also fall back to English in several places |
| Modals | No dialog role/aria-modal; opening leaves focus on the background trigger; no focus trap; Escape does not close; icon close lacks an accessible name |
| Reduced motion | Feedback CSS transition becomes 0s; fan/water/burner and camera interpolation remain active |
| WebGL unavailable | Injected getContext failure causes Three.js error and an empty root/body; no accessible fallback |
| Context temporarily lost | UI still offers Start without a graphics notice; Three.js recovered successfully when context restore was explicitly simulated |

The absence of keyboard interaction is a task-level accessibility gap; focusable camera controls alone cannot complete training. Installation also lacks a non-drag single-pointer alternative. W3C distinguishes a pointer alternative to dragging from keyboard operation; both need review, with any essential-dragging exception assessed rather than assumed. [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

Reduced-motion handling is partial. This audit does not claim WCAG conformance, native screen-reader pronunciation, contrast compliance or actual device performance. Readable fallback-font screenshots do not prove Myanmar shaping on every platform or loaded Google Fonts layout.

Evidence: C:/Users/OE-DKP-20-006/Documents/Codex/2026-10-01/read-codex-handoff-md-completely-then/outputs/v10-accessibility/accessibility-results.json and its screenshots, including type-ii-blueprint.png and no-webgl.png.

## 7. Catalog and customer accuracy

Approved knowledge/scenario data continues to follow docs/S_CLASS_GAME_CONTENT.md. This audit reviewed that provenance and the accepted catalog audit; it does not establish a new catalog edition, certified specifications or permission to redistribute Panasonic catalog images.

| Content / model | Assessment |
| --- | --- |
| Sink knowledge | RakuSuru/Sugo-Pika material and gapless/low-step benefits; 9H explicitly attributed to catalog pencil hardness. Preserve approved qualifiers |
| Cooktop knowledge | Flat Wide horizontal cooking zones, access/preparation/wiping benefits; geometry supports the horizontal concept but not an exact commercial appliance model |
| Hood knowledge | Hottoku Clean Hood 15; fan interval qualified by catalog conditions; plate/ring about annually; exterior still needs cleaning. This is appropriately qualified |
| I-Type scenario | One wall row with Sink/Cooktop together; supported |
| II-Type scenario | Sink and cooking divided between two parallel rows; supported only at that concept level |
| L-Type scenario | Connected counter turning 90 degrees; extra preparation return; wording correctly says Sink/Cooktop stay on main run |
| Facing / Island | Shared simplified deeper-counter implementation; neither is a validated correct scenario answer. Keep that distinction |

Customer confirmation / correction needed:

1. Existing upgrade_auto_hood_desc contradicts knowledge: English says '10 years maintenance-free'; Japanese/Myanmar also describe ten years without cleaning. This overgeneralizes maintenance and differs from the qualified fifteen-year fan/annual-plate explanation.
2. Existing L-Type English configurator description promises a kitchen work triangle although Sink/Cooktop remain on the same run. Japanese wording also implies shorter equipment travel.
3. Island descriptions promise complete freestanding/360-degree access. Facing and Island actually share the isPeninsula path and remain near the rear scene wall; the viewer does not model a verified walkaround room layout.
4. II-Type dimensions label W2550 + W1800, but both counters are 2550 mm. Their 650 mm depths and center separation of 950 mm leave a modeled 300 mm gap; a source comment mentions 900 mm. This is not a usable aisle/room planning claim.
5. Hood top label says 2150 mm; the procedural chimney's measured upper bound is about 2700 mm, with hoodY=1.90 and chimney details. Clarify which reference height is intended before giving dimensional advice.
6. BlueprintModal ignores layout and draws a fixed single 2550×650 counter containing both products. Type II, L-Type and deeper Facing/Island outputs are misleading. The title 'Architectural Blueprint' and fixed '1:20' imply precision not established by a responsive SVG.
7. Quotation estimates come from hardcoded sample configuration prices and are described as manufacturer suggested retail prices. No current approved price list, edition, tax/market policy or SKU/availability evidence is tied to these values.
8. index.html Product JSON-LD asserts a SKU, InStock, sixteen offers and price validity through 2027-12-31. These fields have no demonstrated catalog/stock source. Its product/app identifiers still point to the old AI Studio host even though an inline script adjusts the canonical link.
9. Several blueprint/quotation labels remain Japanese or mixed English/Japanese in English/Myanmar mode. Blueprint labels include implementation coordinates rather than a customer planning reference.

The Sink's cavity/drain and generic Hood are conceptual procedural models. They do not need replacement with GLBs to release a clearly qualified training concept. No new geometry, room solver or manufacturing accuracy is recommended as a minimum V1.0 fix.

Obtain approval for the final concept disclaimer, Hood maintenance wording, layout descriptions/dimensions, quotation purpose/price source, blueprint availability and brand/metadata claims. Reuse the approved knowledge summaries where appropriate; do not silently replace customer-approved statements.

## 8. Physical-device manual checklist

Not completed in this environment. Record device/OS/browser version, browser zoom, pixel ratio, network and observations. Use at least one customer-representative Android Chrome phone, one iPhone Safari, one tablet and a desktop; include a lower-power device.

- [ ] Cold-load the production candidate on Wi-Fi and a slower mobile connection; record time to usable Start and any missing assets/fonts.
- [ ] Full 300 → 600 → 900 → 1200 journey in each required language; verify Myanmar glyph shaping and translated line wrapping.
- [ ] Tap wrong/correct products; quick repeated taps; explicit Next; scroll while the canvas is visible; confirm no accidental answer.
- [ ] Drag Sink/Cooktop horizontally and Hood vertically; wrong drop, precise snap, finger occlusion, cancel/interruption and staging visibility.
- [ ] Orbit/pinch and camera presets; begin touching during camera framing; portrait/landscape and browser address-bar expansion/collapse.
- [ ] Results, twelve-item review, Return and replay; start from Type II/right-Sink with custom finishes/upgrades/step/Focus/isolation/exploded state and verify full restoration.
- [ ] Sound off by default; enable after user gesture; audible comfort, silent/vibrate behavior, interruption/backgrounding and immediate off.
- [ ] Ten-minute session with repeated layout/material changes; record slowdowns, JS/native/GPU memory if available, heat, battery and context loss.
- [ ] Background/foreground, lock/unlock and resize while dragging; recover without orphan clone, disabled controls or leaked score.
- [ ] Keyboard-only training after approved alternatives; visible focus, logical order and focus after phase transitions.
- [ ] VoiceOver/TalkBack and desktop screen reader: labels, document language, phase/status announcements, answer names, modal focus and Return.
- [ ] Reduced motion, 200% zoom/larger text and contrast review; ensure controls remain reachable and no horizontal document scroll.
- [ ] Blueprint/quote availability and wording match the approved concept limitations.
- [ ] Clipboard allow/deny and print behavior on the actual HTTPS origin.

Physical-device completion and customer language/content signoff are release verification gates, even where the emulated flows passed.

## 9. Production hosting requirements

| Requirement | Actual application / proposed release setup |
| --- | --- |
| Build | pnpm run lint, then pnpm run build; build script is vite build |
| Install | First approve/pin a lockfile and toolchain; then pnpm install --frozen-lockfile in a clean build environment |
| Publish directory | dist |
| Runtime | Static HTML/CSS/JS over HTTPS; no Node/Express service, database or Gemini integration required for the current game |
| Environment | No required gameplay key. DISABLE_HMR affects development only; GEMINI_API_KEY example is unused |
| Paths | Current default base is / and generated assets start /assets/. A domain-root deployment fits; a subdirectory requires an approved base adjustment and rebuild |
| Routing | No URL router; phases/layouts are React state on one page. Root/index.html is enough for current links. Add fallback only if hosting under additional application paths; do not mask missing JS with HTML |
| MIME | Serve .js as JavaScript and .css as CSS; preserve generated filenames |
| Caching | Short/revalidated index.html; immutable cache for hashed assets; gzip/Brotli where supported; keep releases consistent |
| Security | HTTPS, host-controlled security headers and least-needed external origins; never expose the Vite dev server as production |
| Fonts | External Google Fonts requests exist; approve that dependency or a later self-hosting plan; validate blocked/loading-font behavior |
| Release strategy | Build one verified immutable dist artifact, stage it on the selected static host, run real-origin smoke tests, then obtain explicit publication approval |

Vite documents dist as its default output, distinguishes preview from a production server, and describes base changes for subdirectory hosting. [Vite static deployment guide](https://vite.dev/guide/static-deploy)

server.allowedHosts=true and host=0.0.0.0 apply to development; they are not required for static hosting. Avoid exposing the dev server to untrusted networks. Vite documents the DNS-rebinding risk of unrestricted allowed hosts. [Vite server options](https://vite.dev/config/server-options)

Choose a hosting provider/domain after approval. Test Content-Security-Policy against the actual inline canonical script, JSON-LD, Google Fonts and data-URI favicon; do not install a guessed policy that prevents initialization. Prefer script hashes/nonces appropriate to the host, nosniff, a referrer policy and suitable frame restrictions. No deployed headers were audited.

Publish dist only. Keep source, .git, environment files, internal reports, catalog PDFs and test artifacts outside the public output. Do not put a secret into a VITE_* variable: those variables are exposed to client code. [Vite environment documentation](https://vite.dev/guide/env-and-mode)

## 10. Prioritized findings

Priorities follow the requested scale. P1 items are customer release gates; P2 items are important follow-up work with the noted hardware/verification conditions; P3 items are optional. Effort estimates are approximate developer time and exclude customer approval and device availability.

### P0 — none demonstrated

No observed security compromise, data loss or complete failure of supported normal gameplay. Dependency advisory and hosting security checks are incomplete; this statement cannot establish absence of all security defects.

### P1-01 — unavailable graphics produces a blank application

- Description: WebGLRenderer creation throws without a fallback/error boundary.
- Reproduce: disable browser WebGL/hardware graphics support, or make canvas getContext return null, then load the production build.
- Evidence: failure fixture records THREE.WebGLRenderer: Error creating WebGL context.; rootChildren=0 and empty body text. Setup source at KitchenViewport3D.tsx:2448; Suspense handles loading rather than these errors.
- Impact: affected customers see an empty page with no explanation or recovery path. The metadata's broad WebGL-browser claim does not establish support.
- Proposed fix: localized graphics-unavailable fallback and boundary/retry path; detect/report context loss and resume safely. Preserve the one-renderer lifecycle and game state.
- Effort: approximately 0.5–1 day plus device tests.
- Source changes: yes, viewport initialization/error handling, translations and/or a small application boundary. No fix applied.

### P1-02 — keyboard and non-drag access cannot complete core training

- Description: keyboard events control camera only; identification and placement require pointer actions.
- Reproduce: Start using Enter, focus viewport, try the documented keys; camera moves but no product answer can be selected. Installation instruction provides drag only.
- Evidence: all twelve size/language audits retained score 0 with Enter/Space on the viewport; key handler covers arrows, zoom, presets and reset without selection/drop.
- Impact: keyboard-only and some motor/assistive-technology users cannot finish the required journey.
- Proposed fix: approve an accessible task-equivalent selection/placement path using existing validation/locking callbacks, with keyboard and a single-pointer alternative to dragging. Do not give unearned points or bypass task logic.
- Effort: approximately 1–2 days plus assistive-technology validation.
- Source changes: yes, approved interaction controls, labels and focus behavior; keep existing pointer mechanics intact.

### P1-03 — contradictory product/layout claims and unverified commercial metadata

- Description: ten-year maintenance-free upgrade wording conflicts with qualified Hood 15 knowledge; L/Island/II labels overstate geometry; pricing/SKU/stock metadata lacks a verified source.
- Reproduce: compare Hood upgrade with its knowledge card; choose L/Island/II; open quotation; inspect Product JSON-LD.
- Evidence: translations.ts keys upgrade_auto_hood_desc, layout_type_l_desc, layout_island_desc, layout_type_ii_sub/desc and quote_notice; configOptions dimensions/prices; index.html JSON-LD. See section 7.
- Impact: customers may mistake concept geometry, cleaning intervals, estimated prices or inventory for current manufacturer facts.
- Proposed fix: get customer approval for consistent catalog summaries and concept limits; remove/qualify unsupported SKU/offer claims; reconcile dimension labels with the simplified model rather than remodeling the kitchen.
- Effort: approximately 0.5–1 day of source/content work plus customer confirmation.
- Source changes: yes, approved text/data/metadata only. Existing approved knowledge/scenario meanings should be preserved.

### P1-04 — blueprint misrepresents selected non-straight layouts

- Description: layout is ignored and the same straight counter is presented as an architectural scaled drawing.
- Reproduce: select Type II, L-Type or Island, then open Blueprint.
- Evidence: Type II browser screenshot shows one 2550×650 row with Sink/Cooktop together; BlueprintModal uses sinkLocation/upgrades but does not branch on layout.
- Impact: customers receive a diagram inconsistent with the preview and may treat inaccurate dimensions as planning output.
- Proposed fix: smallest option is to restrict/qualify the existing diagram as an illustrative supported I-Type schematic and explain unsupported layouts; a true layout-aware blueprint can be a separately approved project. Correct precision/scale claims.
- Effort: approximately 0.25–0.5 day for gating/qualification, substantially more for accurate drawings.
- Source changes: yes, modal/entry guards and localized text. No new geometry required.

### P1-05 — release build/dependency graph cannot yet be reproduced

- Description: no lockfile/toolchain pin; README's frozen-install path contradicts the repository; only the provided dependency runtime was built.
- Reproduce: clone onto a fresh host and follow README's frozen install; there is no committed lockfile to use.
- Evidence: 40-file published tree has no package lock/workspace policy; package ranges resolve differently; current versions listed in section 4.
- Impact: a deployment may resolve untested versions or fail before producing the validated artifact; advisory exposure is not known.
- Proposed fix: approve one package manager, runtime and lockfile, verify a fresh install/lint/build without this sandbox's preload, run a current dependency advisory review, and update README to the actual release process.
- Effort: approximately 0.5–1 day, more if advisories require compatible fixes.
- Source changes: package/toolchain/docs/lock policy, not gameplay. No dependency install or update was performed in this audit.

### P2-01 — context churn, double reconstruction and retained-heap growth

- Description: full renderer replacement and two kitchen constructions per configuration object update; stress heap continues growing.
- Reproduce: repeatedly select layouts/finishes, including reselecting an equal configuration; observe context creation/disposal and sample heap after GC.
- Evidence: 25 updates create 26 contexts and 150 product-root additions; independent 40 equal updates retain approximately 5.19 MB additional JS heap, with 156 geometries/12 textures still current.
- Impact: avoidable construction/texture work, camera/context resets and possible long-session pressure on weaker devices. No actual mobile crash or retaining root identified.
- Proposed fix: with approval, separate stable scene/renderer setup from configuration reconstruction and ensure one reconstruction per change; investigate retainers and resource ownership before claiming a leak fix.
- Effort: approximately 1–2 days plus the full clone/drag/rebuild/restoration matrix.
- Source changes: yes, a focused viewport lifecycle change. Do not refactor automatically. Escalate to P1 if physical stress testing shows failures or continuing operationally significant growth.

### P2-02 — document language and modal accessibility are incomplete

- Description: html lang remains ja, Myanmar region labels often use English; modal semantics/name/focus/Escape handling are missing.
- Reproduce: switch language and inspect html lang; keyboard-open quote/blueprint and press Tab/Escape.
- Evidence: twelve language/size samples keep lang=ja; dialogs have no role or aria-modal, initial focus stays on background trigger, Escape leaves them open; close icons are unnamed.
- Impact: wrong screen-reader language and confusing keyboard/modal navigation, despite working native buttons and feedback.
- Proposed fix: set BCP47 document language (Myanmar language code is my, even though application key is mm); add localized dialog labels, focus entry/trap/return, Escape and close names; review phase focus/announcements.
- Effort: approximately 0.5–1 day plus screen-reader tests.
- Source changes: yes, small accessibility/translation changes. Promote as required by the customer's accessibility acceptance criteria.

### P2-03 — reduced-motion preference stops only feedback transitions

- Description: 3D fan/water/burner motion and camera interpolation continue with reduced motion.
- Reproduce: emulate prefers-reduced-motion: reduce and observe idle effects/camera presets.
- Evidence: feedback transition is 0s, but animation frames continue (16 over the failure-audit sample); source animation paths do not consult the preference.
- Impact: motion-sensitive users cannot suppress all nonessential movement using their system preference. Effects can be manually toggled off.
- Proposed fix: honor reduced motion for decorative effects and camera transitions while preserving explicit interaction and required task visibility.
- Effort: approximately 0.25–0.5 day plus framing/interaction tests.
- Source changes: yes, focused viewport preference handling and any needed UI description.

### P2-04 — clipboard denial has no recovery

- Description: quotation copy calls clipboard.writeText without a rejection handler.
- Reproduce: deny clipboard permission / make writeText reject, then choose Copy.
- Evidence: injected NotAllowedError yields unhandled page rejection 'Audit denied clipboard'; normal gameplay suites remain error-free.
- Impact: copy silently fails and emits a runtime error; unsupported clipboard can also fail before a promise exists.
- Proposed fix: feature-detect and catch failure, show localized retry/manual-copy information; keep optional quotation behavior independent of training.
- Effort: approximately 1–2 hours.
- Source changes: yes, quotation handler/translations.

### P2-05 — shared environment-file protection and release security checks need completion

- Description: broad .env* protection is local to Codex; actual registry advisory/host-header checks are outstanding.
- Reproduce: inspect shared .gitignore in a fresh clone; .env.production is not covered by its two explicit .env entries.
- Evidence: git check-ignore -v attributes these variants to .git/info/exclude; limited source/dist scan found no secret signatures; no hosted candidate exists.
- Impact: future environment variants may be accidentally tracked, and release security behavior is unverified. No present key exposure was found.
- Proposed fix: approve shared environment ignores retaining .env.example; audit the locked graph and validate HTTPS/security headers/CSP/served-directory boundaries on the chosen host.
- Effort: approximately 1–2 hours for ignore policy; approximately 0.5 day for host verification, excluding advisory remediation.
- Source changes: shared ignore rule; hosting configuration as chosen. Do not publish the dev server. The verification portion is a pre-deployment gate.

### P3-01 — bundle/dependency and documentation hygiene

- Description: viewport exceeds warning threshold; unused dependencies, generic react-example/version 0.0.0 and stale V0.2 README content remain.
- Reproduce: build and inspect package.json/README/imports.
- Evidence: viewport 642,256 raw / 162,240 gzip bytes; README omits the later accepted phases.
- Impact: additional install surface, transfer/parse time and confusing contributor instructions; no measured normal-flow failure.
- Proposed fix: update release identity/docs; consider dependency pruning and chunk strategy only after measuring target-device load time. Keep build reproducibility fix separate from optional optimization.
- Effort: approximately 0.5 day for docs/hygiene; 1–2 days for measured optimization if needed.
- Source changes: optional docs/package/bundle changes after approval.

### P3-02 — conceptual asset polish and auxiliary localization

- Description: Sink/Hood remain approximations; older blueprint/quote controls and labels mix languages; larger touch targets may improve comfort.
- Reproduce: inspect Sink/Hood and open these modals in English/Myanmar.
- Evidence: prior accepted V0.9 asset audit; current modal screenshot; icon controls lack localized naming (accessibility aspect covered above).
- Impact: reduced presentation consistency; geometry remains sufficient for tested identification/installation.
- Proposed fix: prioritize approved wording/localization before additional asset work. Do not replace procedural products merely because a GLB exists.
- Effort: approximately 0.5 day for text/UI cleanup; model work separately estimated and approved.
- Source changes: optional translations/UI; no asset replacement is required for the minimum release.

## 11. Recommended minimal fixes

Seek approval for a bounded release patch:

1. Localized graphics failure/recovery UI and accessible keyboard/non-drag task paths (P1-01/02). Preserve existing selection/drop validation and scoring locks.
2. Customer-approved Hood/layout/dimension/quote/metadata corrections and concept qualification (P1-03). No geometry redesign.
3. Qualify/restrict the existing blueprint to its supported illustrative scope (P1-04). Do not undertake a manufacturing drawing engine.
4. Pin/lock the build graph, correct install docs and prove a clean build/advisory review (P1-05). Do not automatically upgrade everything.
5. Small language/modal/clipboard/shared-ignore fixes if included in the approved release patch; confirm reduced-motion expectations.
6. Investigate lifecycle/heap retention and run physical stress testing. A persistent-renderer change remains a separate approved scope because of installation/resource ownership risk.

Rough minimum P1 engineering effort: 3–5 developer days, subject to accessibility design, fresh-build results and content approval. Device validation, translation review and hosting choices require additional calendar time. No new training phase, 3D asset system, backend, authentication or pricing engine is necessary.

## 12. Deployment checklist

- [ ] Approve and implement the bounded P1 patch; retain all accepted V0.9 visuals and gameplay invariants.
- [ ] Confirm catalog edition/content/brand/quotation/blueprint qualifications with the customer; native Japanese/Myanmar review.
- [ ] Pin build runtime and package manager; approve one committed lockfile; fresh frozen installation passes.
- [ ] Typecheck, production build and git diff --check pass on the chosen build host without the sandbox preload.
- [ ] Review dependency advisories/licenses for the actual locked production/build graph; resolve material findings.
- [ ] Repeat complete gameplay and action-lock/restoration/clone-cleanup tests after fixes, including keyboard alternatives.
- [ ] Complete physical-device, screen-reader and reduced-motion checklist; investigate long-session memory/context behavior.
- [ ] Select static host, domain root/subpath, asset base, HTTPS, font policy, cache policy and security headers.
- [ ] Approve any host-specific configuration; build and record one immutable dist artifact from the approved release checkpoint.
- [ ] Test real-origin asset loading, wrong/correct actions, audio permission behavior, context failure, clipboard denial, print, fonts and refresh.
- [ ] Ensure public output contains only intended dist files; no .git, environment files, catalogs or internal artifacts.
- [ ] Prepare rollback to a known complete artifact; avoid mismatched index/chunks.
- [ ] Obtain explicit final approval before publishing/deploying. No automatic deployment or branch merge has been configured here.

## 13. Go / No-Go and audit change boundary

**NO-GO for public customer release today.** Normal supported pointer gameplay passes through 1200, and V0.9 remains a valid accepted development baseline. Release gaps are specifically identified; this is not a request to rebuild the game.

Proceed to a V1.0 release candidate after the P1 patch and release gates pass. P2 lifecycle work can be separately scheduled only if hardware stress results support deferral; accessibility acceptance requirements may also promote P2 items. P3 visual upgrades may wait.

The only new application-repository file from this audit is outputs/Game-Mode-V1.0-Release-Readiness.md. All 40 published baseline files still match their recorded SHA-256 values. Existing Codex uncommitted accepted work remains intact. Desktop stays clean at d5fe53d45d22258584177bd61b234e48cfb42a46 on codex/game-mode-development. No source fixes, dependencies, commits, pushes, resets, merges, branch changes or deployment were performed.

