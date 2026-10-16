# Changelog

All notable changes to `open-claude-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - `feat/rea-ground-truth-audit`

### 🔍 REA v6.5.0 Ground-Truth Precision Audit (Chapter-by-Chapter)

> Based on deep AST analysis and runtime extraction from Claude Desktop `/Applications/Claude.app` (`@ant/desktop v2.37337.1`, build `2026-10-13T22:16:06Z`, ASAR evidence `ev_e0bd89cee50a5b7d0dbf9e75cef5dfbca2bcb1699df4d4371449dd08452a8358`) using **[REA (Reverse Engineer Anything) v6.5.0](https://github.com/morluto/rea)**.

#### Chapter 1: Design Philosophy & Design Tokens (`docs/v1/01-设计哲学与设计令牌体系.md`)

- **35-Tier Grayscale & Orange Color Ramps**:
  - Replaced approximated surface hex values with the complete 35-tier grayscale spectrum (`--cds-gray-0` to `--cds-gray-900`) and 35-tier orange spectrum (`--cds-orange-0` to `--cds-orange-900`) extracted from `c6a992d55-sXiDGMFQ.css`.
  - Calibrated `--cds-surface-0` Light mode to `#f9f9f7` (`--cds-gray-20`, previously `#f5f5f3`) and Dark mode to `#0b0b0b` (`--cds-gray-900`, previously `#0b0b0a`).
  - Calibrated `--cds-surface-3` Dark mode to `#20201f` (`--cds-gray-800`, previously `#20201e`).
- **OLED Anti-Banding Hex Law**:
  - Documented Anthropic's exact 2-level hexadecimal step decrement rule across dark surfaces (`800: #20201f` $\to$ `810: #1e1e1d` $\to$ `820: #1c1c1b` $\to$ ... $\to$ `900: #0b0b0b`), eliminating OLED banding.
- **Official Brand Token Separation**:
  - Defined `--brand: #c6613f` as official desktop primary brand color, while retaining `--cds-clay: #d97757` for pulse indicators, spark icons, and terracotta highlights.
- **Concentric Radius Formula & Card Token**:
  - Implemented the adaptive concentric radius formula `--radius-card: calc(var(--cds-radius) + calc(.25rem * var(--cds-rem-scale, 1)))` in `cds-theme.css`.
  - Added `'card': 'var(--radius-card, ...)'` to `tailwind.config.js` to ensure inner and outer curvatures maintain concentric harmony during viewport zoom.
- **Scroll-Driven 28px Fade System**:
  - Formally specified `--cds-scroll-fade-size: 28px` (calibrated from 24px/32px approximations).
  - Documented the 4-stop non-linear relative color fade formula (`0%`, `13%` at 0.85 alpha, `40%` at 0.50 alpha, `70%` at 0.15 alpha, `100%` transparent) driven by CSS `scroll-timeline`.
- **CJK Font Stack & Variable Axes**:
  - Integrated `--font-cjk-sans-fallback` (`PingFang SC`, `PingFang TC`, `Hiragino Sans`, `Apple SD Gothic Neo`) into default font stacks.
  - Added explicit variable font optical size axes (`--font-opsz-axis-title: "opsz" 28,;`, `--font-opsz-axis-heading: "opsz" 20,;`, `--font-opsz-axis-display: "opsz" 48,;`) and subpixel badge weight `--cds-badge-x-wght: 577.8`.
- **Suite of 7 Production Physical Cubic-Bezier Curves**:
  - Expanded motion tokens from 3 generic curves to all 7 production bezier functions extracted from desktop bundles:
    - `--cds-ease-swift`: `cubic-bezier(.16, 1, .3, 1)` (hover/ghost buttons)
    - `--cds-ease-expand`: `cubic-bezier(.19, 1, .22, 1)` (Grid 0fr to 1fr accordion expand)
    - `--cds-ease-enter`: `cubic-bezier(.22, 1, .36, 1)` (block entry with 4px blur fade)
    - `--cds-ease-overshoot`: `cubic-bezier(.34, 1.3, .64, 1)` (jelly spring pop, +30%)
    - `--cds-ease-pop`: `cubic-bezier(.34, 1.56, .64, 1)` (high-stiffness modal pop, +56%)
    - `--cds-ease-pulse`: `cubic-bezier(.4, 0, .2, 1)` (quiet dot 1.9s pulse)
    - `--cds-ease-rise`: `cubic-bezier(.3, .7, .4, 1)` (status line enter rise)
    - `--cds-ease-fall`: `cubic-bezier(0, 0, .2, 1)` (status line exit fall)

---

## [1.0.1] - 2026-10-16

### 🐛 Fixed (Community Issues #9 – #13)

- **`DiffViewer` Header Rendering (Issue #9)**:
  - Fixed issue where the sticky file header, path icon, and badge statistics failed to render when `chunks` array was empty. The header now always renders reliably with complete metadata.
- **`SortableList` Drag-and-Drop Index (Issue #10)**:
  - Fixed off-by-one error when dragging an item past the end of the list. The drop target index is now properly clamped to `items.length - 1`.
- **`PromptInput` IME Composition Enter Guard (Issue #11)**:
  - Added `isComposing` guard to `onKeyDown` to prevent CJK IME candidate selection (Enter key) from prematurely triggering message submission.
- **`MediaLightbox` Pan Boundary Constraints (Issue #12)**:
  - Added dynamic clamp bounds `[-maxPanX, maxPanX]` and `[-maxPanY, maxPanY]` based on current zoom scale, preventing media from being panned completely out of view.
- **`ViewTransitionPortal` Timing Collision (Issue #13)**:
  - Synchronized `view-transition-name` assignment with `ReactDOM.flushSync` and cleanup hooks, avoiding DOM transition name collision errors during rapid route changes.

### 📝 Documentation & Community

- Merged community fixes via PR [#14](https://github.com/Caho1/open-claude-ui/pull/14) with acknowledgments to contributors `@alexanderchen-ai`, `@dev-liu-kevin`, `@sakura-code99`, `@marcus-web-eng`, and `@t-h-tanaka`.
- Added dynamic interactive Star History chart to `README.md`.
- Clarified repository description: *"还原 30 个独立 React 组件与 8 项硬核交互物理算法"*.

---

## [1.0.0] - 2026-10-14

### 🎉 Initial Release

- **30 Standalone React Components**:
  - Production-ready, TypeScript-strictly-typed UI component implementations recreating Claude Desktop's design system.
  - Buttons, Segmented Controls, Status Indicators, Confirmation Dialogs, Attachment Cards, Message Bubbles, Thinking Accordions, Chat Composer, Artifacts Sandbox, Media Viewer, Split Panes, Diff Viewer, and more.
- **8 Hardcore Interaction & Motion Physics Algorithms**:
  - True Spring Physics (`stiffness: 400`, `damping: 32`).
  - Web Audio API real-time AudioWorklet microphone visualizer.
  - Retina 0.5px hairline rendering with media query scaling.
  - Triple-layer focus ring and dual-ring composer elevation.
  - Container query responsive folding (`@container`).
  - CSS Grid 0fr $\to$ 1fr height jitter elimination.
  - Retinal irradiation weight compensation for dark mode (`-40` wght offset).
  - WebKit 16px mobile input zoom prevention threshold.
- **Complete CDS Engineering Manual**:
  - 9-chapter exhaustive reverse-engineering specification covering design tokens, atom controls, conversation flows, motion shaders, audiovisuals, desktop integration, Tailwind configurations, and Agent UI assembly.
