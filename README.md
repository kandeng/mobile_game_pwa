# Mobile Game PWA — General-Purpose Mobile Game UI Framework

A mobile-first Progressive Web App framework for building VR and AR mobile games. Provides a ready-to-use UI package with touch controls, a resizable AI chat panel, a telemetry HUD, and an extensible toolbox — designed to work with any 3D scene, physical drone, or robot toy.

The included demo uses a Crazyflie drone model to illustrate the framework's control capabilities. In production, the 3D viewport is replaced with your own VR/AR scene.

## Features

- **Pluggable 3D Viewport** — Swap in any Three.js scene, AR camera feed, or VR environment
- **4-Mode Joystick** — Touch-based joystick with Move, Rotate, Height, and Lens (focal length) modes
- **Telemetry HUD** — Live overlay displaying position, orientation, and camera parameters
- **AI Chat Panel** — Resizable chat panel with toolbox expansion for in-game communication
- **Extensible Toolbox** — Grid of quick-action buttons, customizable per game
- **PWA Support** — Installable as a native-like app on mobile devices
- **iOS Optimized** — Full safe-area support for iPhone notch and browser toolbar

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/mobile_game_pwa.git
cd mobile_game_pwa
npm install
```

## Running

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`. Open this URL on your phone (same network) or desktop browser.

To access from a mobile device on the same Wi-Fi network, use your computer's local IP address, e.g. `http://192.168.x.x:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## How to Use

### Joystick Control

The joystick is a semi-transparent circular overlay in the center of the viewport. It generates velocity commands that your game logic can map to any controllable entity (drone, robot, character, camera, etc.).

| Mode | Label | Action | Directions |
|------|-------|--------|------------|
| **Move** | M | Horizontal translation | Up / Down / Left / Right |
| **Rotate** | R | Yaw rotation | Clockwise / Counter-clockwise |
| **Height** | H | Vertical translation | Up / Down |
| **Lens** | L | Camera focal length (zoom) | Left (zoom out) / Right (zoom in) |

- **Toggle mode**: Tap the inner circle to cycle through modes: M → R → H → L → M
- **Control**: Touch the outer ring area and drag in the desired direction
- **Stop**: Release your finger to stop immediately

### Chat Panel

- **Swipe up** on the drag handle (gray pill at top of panel) to expand the chat area
- **Swipe down** to collapse it
- The panel snaps to three heights: collapsed (15vh), default (30vh), expanded (50vh)
- Tap the **+** button to open the toolbox with quick-action buttons (Camera, Identify, Game, Settings)

### Telemetry HUD

The heads-up display at the bottom of the viewport shows real-time state of the controlled entity:
- Position: `x`, `y`, `z`
- Orientation: `yaw` (degrees)
- Camera: `focal` length value

The HUD fields are customizable — adapt them to display any telemetry relevant to your game (speed, health, battery, signal strength, etc.).

## Project Structure

```
mobile_game_pwa/
├── public/models/          # 3D model assets (.glb) — demo only
├── src/
│   ├── components/
│   │   ├── ThreeScene.tsx   # 3D viewport (replace with your VR/AR scene)
│   │   ├── Joystick.tsx     # 4-mode touch joystick (reusable)
│   │   ├── ChatPanel.tsx    # AI chat + toolbox panel (reusable)
│   │   └── HUD.tsx          # Telemetry overlay (reusable)
│   ├── App.tsx              # Root component, state management
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind CSS entry
├── index.html               # HTML shell with iOS meta tags
├── vite.config.ts           # Vite + PWA + Tailwind config
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Integration Guide

### Option A: Use as a local npm package

Install this framework as a dependency in your own project using a local file reference:

```bash
# In your project directory
npm install ../mobile_game_pwa
```

This adds the following to your `package.json`:

```json
{
  "dependencies": {
    "mobile_game_pwa": "file:../mobile_game_pwa"
  }
}
```

Then import the components in your code:

```tsx
import { Joystick, ChatPanel, HUD } from 'mobile_game_pwa';
import type { EntityState } from 'mobile_game_pwa';
```

**Exported components:**

| Component | Description |
|-----------|-------------|
| `Joystick` | 4-mode touch joystick (Move/Rotate/Height/Lens) |
| `ChatPanel` | Resizable AI chat panel with expandable toolbox |
| `HUD` | Telemetry heads-up display overlay |

**Exported types:**

| Type | Description |
|------|-------------|
| `EntityState` | State interface with `x`, `y`, `z`, `yaw`, `focal` fields |

**Peer dependencies your project needs:**

```bash
npm install react react-dom framer-motion lucide-react
```

**Note:** Since this package exports raw TypeScript source, your project's bundler (Vite) handles transpilation. No separate build step is required for the package itself.

### Option B: Copy source files directly

Alternatively, copy the reusable components into your project:

1. **Replace `ThreeScene.tsx`** with your VR/AR scene component. It receives a state object and renders accordingly.
2. **Customize `EntityState`** in `App.tsx` — extend the state interface to match your game entity (add speed, health, battery, etc.).
3. **Map joystick callbacks** (`onMove`, `onRotate`, `onHeight`, `onFocal`) to your game's control logic or network protocol.
4. **Customize the HUD** to display game-specific telemetry.
5. **Extend the toolbox** in `ChatPanel.tsx` with your game's action buttons.

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type-safe development
- **Vite** — Build tool with hot module reload
- **Three.js** / **@react-three/fiber** / **@react-three/drei** — 3D rendering
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Chat panel animations
- **Lucide React** — Icon library
- **vite-plugin-pwa** — PWA manifest and service worker generation

## License

MIT — see [LICENSE](./LICENSE)

## Documentation

For technical details including architecture and workflow, please refer to [doc/WIKI.md](doc/WIKI.md).
