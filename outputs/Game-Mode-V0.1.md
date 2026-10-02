# Game Mode V0.1

Implemented against repository commit `fa43ae7e4d40eefbcacbe50cb0932e96f05fbcc9` in the local checkout under `work/Panasonic-Kitchen-S--CLASS`.

The playable flow is Start Game Mode → Find the Sink → click/tap the sink → Correct! +100 → Training Complete → Return to Explore. A wrong kitchen hit shows Try again and keeps the score at zero. Starting another game resets the score.

## Files changed

| File | Change |
| --- | --- |
| `src/App.tsx` | Single task constant, game state, Start/Return handlers, product-selection handler, and React HUD. The viewport and configurator remain mounted. The configurator is hidden and inert during training. |
| `src/components/KitchenViewport3D.tsx` | Optional mode/selection props, sink metadata, a kitchen mesh collection, parent product lookup, click/tap raycasting, orbit gesture rejection, and listener cleanup. Training temporarily suspends isolation/exploded settings and restores them on exit. |
| `src/types.ts` | Shared `AppMode = 'explore' | 'game'` type. |
| `src/i18n/translations.ts` | Training UI labels in Japanese, English, and Myanmar. |

No application dependencies or package scripts changed. No new game framework was introduced.

## State and props

App owns `appMode`, `currentTask`, `score`, `gameStatus` (`idle`, `playing`, `complete`), and `feedback` (`correct`, `wrong`, or null).

The viewport accepts `mode?: AppMode` and `onProductSelect?: (productId: string) => void`. Refs keep these values current without adding them to the existing Three.js setup effect's dependencies.

## Sink selection

`rebuildKitchenScene` tags `sinkGroup.userData.productId = 'sink'` and collects only meshes inside the kitchen. Studio walls, the floor, and lights are excluded. On a primary pointer click/tap, coordinates are normalized against the renderer canvas bounds, the existing camera creates the ray, and the nearest visible kitchen mesh is selected. Parent traversal resolves sink descendants to `sink`. Other kitchen meshes report `other`; empty background clicks are ignored.

Movement beyond six pixels cancels the answer so OrbitControls gestures continue to work. New listeners and the mesh collection are cleaned up when the existing scene lifecycle cleans up. A completed task cannot award additional points.

## Architectural compromises

- Green/red React HUD feedback is used; existing product materials are untouched.
- The current procedural sink assembly includes its faucet and water details. Those descendants resolve to the sink for V0.1.
- The existing setup effect still recreates the renderer/world when kitchen configuration changes. Game entry, feedback, completion, language changes, and exit do not recreate it.
- Game logic is deliberately kept in App for this single task.

## Validation

| Check | Result |
| --- | --- |
| `pnpm run lint` (`tsc --noEmit`) | Passed after the final change. |
| `pnpm run build` | Native esbuild's config loader failed on directory access in the Windows sandbox. |
| `pnpm run build --configLoader runner` | Passed after the final change, using a scratch Node preload to supply the existing config's `__dirname`. No Vite config source edit was made. |
| `pnpm run preview --host 127.0.0.1 --port 3000 --configLoader runner` | Served the production build successfully with the same preload. |
| `git diff --check` | Passed. |

Dependency install scripts were kept disabled. The package manager's generated verification files were moved out of the source checkout after validation.

Browser checks used headless Chrome against the production build at desktop 1440×1100 and phone 390×844 with real touch events. External font requests were blocked in the browser test to keep loading deterministic; the browser used fallback fonts.

Verified:

- Kitchen rendering and all seven configurator steps, including configuration changes.
- All five camera preset buttons and OrbitControls gestures.
- Wrong kitchen selection, correct sink selection, completion, repeat-click score protection, and replay reset.
- Sink selection after rebuilding a Type II kitchen with the sink mirrored to the right.
- Three repeated Explore → Game → Explore cycles and restoration of configurator step, isolation, and exploded settings.
- One canvas and one active animation frame loop after each settled state. Mode switching retained the same canvas/context and unchanged listener counts.
- Configuration rebuilds removed all listeners from old canvases and left one live canvas/loop.
- Mobile wrong/correct taps, return, and replay. The viewport stays at the same position and size as feedback changes.
- Task labels in Japanese, English, and Myanmar.
- No JavaScript page errors during the successful browser checks.

## Remaining issues

- The existing header language controls overlap on a narrow 390px phone viewport; the Myanmar control was not reliably tappable at that width. Desktop language controls and the localized game labels work. `TopBar.tsx` was not changed.
- Vite continues to warn about the large Three.js viewport chunk (approximately 635 kB before gzip).
- The standard Vite config loader cannot run in this sandbox; the production build was verified with the module-runner workaround described above.

`game-mode-v0.1.patch` contains the complete four-file source diff. No commit, push, or deployment was performed.
