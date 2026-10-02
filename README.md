# Panasonic S-Class Kitchen Game Mode

Stable Game Mode V0.2 shares the existing React/Three.js kitchen with Explore Mode.

Start Game Mode → Find the Sink → Next Task → Find the Cooktop → Next Task → Find the Range Hood → Training Complete.

Each correct answer awards 100 once. Completion shows Score 300 and Products Identified 3 / 3. Wrong answers preserve the task and score; replay resets to Task 1 and Score 0. Training requires a configuration containing all three products.

The application supports Japanese, English, and Myanmar. The seven-step configurator, camera controls, Focus Mode, and isolation/exploded settings are preserved.

## Install and run

Use Node.js 20.19+ or 22.12+ and pnpm 10. The committed pnpm lockfile records the dependency versions used for validation. `pnpm-workspace.yaml` retains the tested policy that disables dependency install scripts.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

The development server uses port 3000. The current identification game does not require an API key. `.env.example` contains placeholders only.

## Validate and build

```sh
pnpm run lint
pnpm run build
git diff --check
```

`pnpm run lint` runs TypeScript checking. The production build is written to the ignored `dist/` directory. The existing Three.js chunk-size warning is documented in the V0.2 report.

### Windows sandbox build workaround

If the native Vite config loader fails with the documented directory-access error, use the same module-runner/preload approach used during V0.1 and V0.2 validation. Run this from the project root in PowerShell:

```powershell
$preloadPath = Join-Path ([IO.Path]::GetTempPath()) 'sclass-vite-runner-preload.cjs'
Set-Content -LiteralPath $preloadPath -Value 'global.__dirname = process.cwd();' -Encoding utf8
$previousNodeOptions = $env:NODE_OPTIONS
try {
  $env:NODE_OPTIONS = ($previousNodeOptions + ' --require "' + $preloadPath + '"').Trim()
  pnpm run build --configLoader runner
} finally {
  $env:NODE_OPTIONS = $previousNodeOptions
}
```

The preload is outside the checkout; no Vite configuration change is required. The same preload can be used with `pnpm run preview --host 127.0.0.1 --port 3000 --configLoader runner`.

## Source and reports

- [V0.1 implementation report](outputs/Game-Mode-V0.1.md)
- [V0.2 implementation report](outputs/Game-Mode-V0.2.md)
- [Original planning handoff](CODEX_HANDOFF.md)

The current source and implementation reports take precedence over assumptions in the historical handoff. In particular, this V0.2 implements three identification tasks. Placement, snapping, quizzes, backend integration, and final model replacement remain future work.

The validated source checkpoint is `1c88433` (`feat: complete S-Class Game Mode V0.2`). The subsequent repository-preparation checkpoint adds this README, the handoff, reports, pnpm lockfile, and install policy without changing application source or rewriting history.

## Repository remotes

- `origin`: original Explore source/reference, `https://github.com/komoemm/Panasonic-Kitchen-S--CLASS.git`
- `game`: Game Mode repository, `https://github.com/komoemm/Panasonic-S-Class-Kitchen-Game-Mode.git`

The stable Game Mode checkpoint belongs on `game/main`, with tag `game-mode-v0.2`.
