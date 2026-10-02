# Panasonic S-CLASS Kitchen — Game Mode Development Context

## Project

I am building an interactive Panasonic S-CLASS Kitchen web experience using Three.js.

Existing Explore Mode:
https://s-class-kitchen-panasonic.iida-mm.com/

Repository:
https://github.com/komoemm/Panasonic-Kitchen-S--CLASS.git

Planning/reference website:
https://plan-s-class-ktichen.iida-mm.com/

I already have an Explore Mode. Do NOT rebuild the Three.js application from scratch.

The goal is to add a Game Mode on top of the existing Explore Mode architecture.

## Developer Background

I am comfortable with:

- Three.js
- JavaScript/web development
- AI-assisted/vibe coding
- Google AI Studio
- Supabase
- basic Blender
- AI agents

I may also use Blender MCP and AI image-to-3D tools later.

My deadline is approximately 15 days.

Therefore prioritize a working MVP over complicated architecture.

---

# Main Architecture Decision

Explore Mode and Game Mode should share the same:

- THREE.Scene
- WebGLRenderer
- Camera
- lighting
- environment
- GLTF models
- kitchen scene
- product assets
- asset loading system

Do NOT build a second complete Three.js scene/app unless the existing architecture absolutely requires it.

Desired architecture:

S-Class App
|
|-- Shared 3D World
|   |-- Scene
|   |-- Renderer
|   |-- Camera
|   |-- Lighting
|   |-- AssetLoader
|   |-- Kitchen
|   `-- Products
|
|-- Explore Mode
|   |-- camera/orbit interaction
|   |-- product selection
|   `-- product information
|
`-- Game Mode
    |-- GameManager
    |-- TaskManager
    |-- InteractionManager
    |-- SnapManager
    |-- ScoreManager
    `-- Game UI

Before implementing this architecture, inspect the existing repository and reuse existing systems wherever possible.

Do NOT refactor unrelated working Explore Mode code just to match this structure.

---

# Development Principle

Do NOT start by creating final 3D assets.

Gameplay must work first using the existing products or simple placeholder boxes.

The first milestone is:

"Install the Sink"

Player selects/moves Sink
→ place near correct target
→ validation
→ snap to correct position
→ success feedback
→ +100 score
→ next task

Once this loop works, other products should primarily be configuration/data rather than custom systems.

---

# Game Mode Roadmap

## Level 1 — Identify

Example:

"Find the Sink."

Player explores the existing kitchen and clicks a product.

Correct product:
- highlight success
- +100 score
- move to next task

Wrong product:
- visual error feedback
- allow another attempt

Use the existing raycasting/product-selection system from Explore Mode if one already exists.

Do NOT build another raycasting system unnecessarily.

---

## Level 2 — Placement

Example:

"Install the Sink."

Player selects or drags the Sink.

Show a visible target/drop zone.

When the product is sufficiently close to its target:

- validate placement
- snap it to its correct transform
- give positive visual feedback
- add score
- complete task

Initially use:

- Three.js Raycaster
- DragControls if appropriate
- Vector3 distance checks
- Box3/drop zones
- predefined snap positions

Do NOT add a physics engine for the MVP.

---

## Level 3 — Build S-CLASS Kitchen

Sequential installation training.

Example:

1. Base Cabinet
2. Countertop
3. Sink
4. Cooktop
5. Range Hood

The player installs components in the required order.

Show progress such as:

3 / 5

After a successful installation, move automatically to the next step.

---

## Final — Knowledge Quiz

After the assembly training:

- approximately 5 questions
- multiple choice
- final score
- accuracy
- completion screen
- replay option
- return to Explore Mode option

---

# Product System

Products should be data-driven.

Avoid code like:

if (mesh.name === "...")

spread throughout the application.

Create or adapt a product configuration system similar to:

```js
const products = {
  sink: {
    id: "sink",
    name: "S-CLASS Sink",
    model: "...",
    game: {
      draggable: true,
      targetPosition: [x, y, z],
      targetRotation: [x, y, z],
      tolerance: 0.3,
      points: 100
    }
  }
};
```

Attach metadata to Three.js objects:

```js
object.userData.productId = "sink";
object.userData.interactive = true;
```

Explore Mode and Game Mode should ideally reference the same product metadata.

---

# Game State

Keep the first version simple.

Example:

```js
const gameState = {
  state: "idle",
  level: 0,
  currentTask: 0,
  score: 0,
  mistakes: 0,
  completed: []
};
```

Avoid Redux or unnecessarily complicated state-management frameworks unless the existing project already depends on one.

---

# GameManager

GameManager should mainly control:

- start()
- reset()
- current task
- correct()
- wrong()
- nextTask()
- score
- completion

Do not put renderer, asset-loader, camera, or scene responsibilities inside GameManager.

---

# Interaction

Before implementing anything, inspect how Explore Mode currently performs:

- pointer handling
- raycasting
- model selection
- OrbitControls
- highlighting
- product identification

Reuse those systems.

When dragging a product, temporarily disable OrbitControls if necessary so dragging does not rotate the camera.

---

# Snap System

Start simple.

Each placeable product has:

- target position
- target rotation
- tolerance or valid drop zone

Example logic:

```js
distance = object.position.distanceTo(target);

if (distance < tolerance) {
  snap();
  completeTask();
}
```

Later this can use Box3 volumes for better placement UX.

Do not introduce realistic physics unless gameplay eventually requires it.

---

# Game UI

Keep the HUD clear and training-focused.

Example:

S-CLASS TRAINING

TASK 03

Install the IH Cooktop

Score: 300

Progress: 3 / 5

The player should always know:

- what they need to do
- which object is relevant
- where it should go
- whether their action was correct

Use:

- green success feedback
- red incorrect feedback
- target glow
- progress animation
- score animation

Do not make the interface look like a complicated RPG.

---

# 3D Assets

Do NOT block Game Mode development on final models.

Development order:

placeholder/existing model
→ gameplay works
→ final GLB replacement

Important product assets may later come from:

- approved Panasonic assets
- AI image-to-3D
- Blender cleanup
- simple Blender hard-surface modeling

Environment assets/materials may use free resources such as Poly Haven or ambientCG where licensing permits.

AI-generated GLBs should be cleaned/optimized before production use.

---

# Backend

Do NOT prioritize Supabase initially.

For the MVP, game progress can use local application state or localStorage.

Supabase can later store:

- users
- training sessions
- scores
- completion/progress

Gameplay must work without Supabase first.

---

# First Implementation Task

Before editing code:

1. Inspect the entire repository structure.
2. Explain how the existing Three.js app is organized.
3. Locate:
   - scene creation
   - renderer
   - camera
   - OrbitControls
   - GLTF loading
   - model/product loading
   - raycasting
   - pointer events
   - product information system
   - UI/router/navigation
4. Identify which existing systems can be reused for Game Mode.
5. Propose the smallest set of files that need to be added or modified.

Do NOT begin a large refactor before completing this analysis.

After analysis, implement only Game Mode V0.1.

---

# Game Mode V0.1

The first playable implementation should contain only:

1. Game Mode entry/button.
2. GameManager.
3. One task: "Find the Sink."
4. Reuse existing product raycasting.
5. Correct/wrong feedback.
6. Score.
7. Ability to exit back to Explore Mode.

Verify that Explore Mode still works.

Commit this as a working checkpoint before implementing placement.

---

# Game Mode V0.2

After V0.1 works:

Implement:

"Install the Sink."

Use one existing Sink model or temporary placeholder.

Requirements:

- selectable/movable
- target zone visible
- correct-position validation
- snapping
- +100 points
- completion state

No physics.

---

# Rules For Codex

1. Inspect before editing.
2. Preserve working Explore Mode behavior.
3. Prefer reuse over duplication.
4. Make small commits/checkpoints.
5. Do not rewrite the entire application.
6. Do not introduce unnecessary dependencies.
7. Keep game logic separate from rendering infrastructure.
8. Prefer data-driven product/task configuration.
9. Use placeholder assets until gameplay works.
10. Run/build/test after meaningful changes.
11. Explain major architectural decisions.
12. If existing architecture conflicts with this document, first explain the conflict and propose the smallest safe adaptation.

Primary goal:

SHIP A WORKING S-CLASS GAME MODE WITHIN 15 DAYS.