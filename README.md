# Panasonic S-Class Kitchen Game Mode

Accepted source baseline: V0.9 Priority 1 Visual Pass, with the published V1.0 release audit at `42c2c8d` on `codex/game-mode-development`. V1.0.1 adds release fixes for review; it is not a public-release approval.

The existing shared React/Three.js kitchen supports Explore Mode and four training phases:

| Phase | Cumulative maximum |
| --- | ---: |
| Product identification | 300 |
| Product installation | 600 |
| Product knowledge | 900 |
| Customer scenarios | 1200 |

Each phase has three tasks. Correct answers score once; progression is explicit. Installation dragging and accessible movement controls use the same placement tolerances and world-transform snapping. Explore settings are restored after training. Japanese, English and Myanmar are supported.

## Runtime and dependencies

Use **Node.js 24 LTS** (`>=24.19.0 <25`; `.nvmrc` records the tested 24.19.0 patch) and **pnpm 11.25.0**, pinned by `packageManager`. Keep a supported, patched Node 24 runtime; later patches require validation. The [Node release table](https://nodejs.org/en/about/previous-releases) lists the supported LTS lines.

Direct package versions match the working dependency inventory. `pnpm-lock.yaml` records the resolved graph and integrity hashes; Vite has one entry in devDependencies. `pnpm-workspace.yaml` enforces the runtime engines and disables dependency lifecycle scripts. See [pnpm installation](https://pnpm.io/cli/install) and [workspace settings](https://pnpm.io/settings).

Install the pinned pnpm version through your normal trusted package-manager setup. Verify versions first:

```sh
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm run dev
```

The development server uses port 3000. Do not regenerate the lockfile merely to get past a frozen-install error; review a manifest/lockfile mismatch first.

No API key is needed for the current training or concept configurator. `.env.example` remains trackable. `.env` and its other variants are ignored by shared rules. Do not put credentials into browser code or Vite-exposed variables; a browser bundle cannot keep a secret.

## Validate the production build

```sh
pnpm run lint
pnpm run build
git diff --check
pnpm audit
pnpm run preview
```

`lint` runs TypeScript checking. `dist/` is ignored. Test the generated production assets and complete training journey before release. The existing large Three.js chunk warning remains; bundle optimization is outside this pass.

### Windows Codex sandbox diagnostics

This environment denies some native directory realpath calls and dependency symlinks. A default clean/frozen install or build can fail with `EPERM`. The validation record distinguishes those failures from successful diagnostic runs using an **external** filesystem/Vite preload and a fresh pnpm hoisted installation. That preload is not an application dependency and is not shipped in `dist/`.

For pnpm 11 diagnostic script runs against the pre-existing working dependencies, validation sets `pnpm_config_verify_deps_before_run=false` to prevent an implicit reinstall. This is a diagnostic environment override, not the normal release installation policy. The full commands, isolated-install paths and limitations are recorded in [V1.0.1 release fixes](outputs/Game-Mode-V1.0.1-Release-Fixes.md).

Run the normal frozen install/build on an unrestricted clean workstation or CI before publication. A build using a diagnostic preload does not establish that an independent clean production build passed.

## Content and release gates

Models and dimensions are training concepts, not manufacturing/installation specifications. The I-Type-only drawing is a concept illustration, not a construction drawing. Displayed estimates use unverified hardcoded samples and must not be used as manufacturer/supplier quotations.

Review the [content approval matrix](docs/V1.0.1_CONTENT_APPROVAL_MATRIX.md) and [accepted catalog content](docs/S_CLASS_GAME_CONTENT.md). Public release also requires physical-device, assistive-technology, customer content/pricing/brand approval and hosting acceptance. Pending copy does not become approved through passing technical tests.

## Reports

- [V1.0 release readiness audit](outputs/Game-Mode-V1.0-Release-Readiness.md)
- [V1.0.1 release fixes](outputs/Game-Mode-V1.0.1-Release-Fixes.md)
- [V0.9 visual pass](outputs/Game-Mode-V0.9-Visual-Pass.md)
- [V0.8 training results and polish](outputs/Game-Mode-V0.8.md)
- [V0.7 customer scenarios](outputs/Game-Mode-V0.7.md)
- [Historical handoff](CODEX_HANDOFF.md)

The current source and accepted reports take precedence over historical planning assumptions. The Game Mode repository is `https://github.com/komoemm/Panasonic-S-Class-Kitchen-Game-Mode.git`. This development pass does not commit, push, merge or deploy.
