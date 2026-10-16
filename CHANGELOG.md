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

#### Chapter 2: Foundational Atoms & Controls (`docs/v1/02-基础原子组件与交互控件.md`)

- **5-Tier Button Height Scale & Nested Control Heights**:
  - Calibrated button sizes to official 5-tier scale: `xxs (18.8px, data-step="1")`, `xs (22.6px)`, `sm (26.35px)`, `md (30.1px desktop / 32px web, default)`, and `lg (37.65px desktop / 40px web)`.
  - Added official `--cds-h-control-nested` scale (17px, 18.8px, 20.7px, 26.35px) for toolbar/composer-nested controls.
- **6 Production Button Variants & Paint Layer Decoupling**:
  - Extracted official variant matrix: `secondary` (default, borderless with `bg-fill-secondary`), `primary` (clay), `ghost` (`hover:bg-fill-ghost-hover`), `danger` (`bg-fill-danger`), `brand` (`--brand: #c6613f`), and `onContent` (media overlay with `backdrop-blur-md` and `var(--cds-button-on-content)`).
  - Implemented decoupled paint layer (`data-cds-part="paint"`) to isolate focus ring outlines from inner background/shadow fills.
- **15-Stop CSS `linear()` Spring Curve & Button Squish Physics**:
  - Extracted official `--cds-btn-spring: linear(0, .2459, .6526, .9468, 1.0764, 1.0915, 1.0585, 1.0219, .9993, .9914, .9921, .9957, .9988, 1.0004, 1)` (+9.15% overshoot).
  - Implemented `.cds-btn-squish` with runtime height damping `Bl(h) = Math.min(1.5, Math.max(0.5, h * (1/32)))`.
- **Segmented Control 1px Precision Geometry & Dual Container Breakpoints**:
  - Corrected track padding to strictly `1px` (not 2px) with `top: 1px; bottom: 1px;` indicator positioning.
  - Formally specified multi-breakpoint container query: `@container (width <= 180px)` for 2-tab pills and `@container (width <= 254px)` for 3-tab pills.
  - Extracted 0.5px hairline inset shadow: `inset 0 0 0 0.5px var(--cds-border), 0 1px 2px #0000000f, 0 2px 6px -1px #0000000d` (Light) and `inset 0 0 0 0.5px #ffffff14, 0 1px 2px #0000004d, 0 2px 6px -1px #00000040` (Dark).
- **Official 6px Status Indicators & Accurate Trajectories**:
  - Standardized `.status-dot` to 6px diameter with 4 semantic kinds: `ready` (accent steady), `running` (1.2s dot blink), `error` (danger steady), and `clay` (3.0s breathe cycle from brightness 0.96 scale 0.86 to brightness 1.06 scale 1).
  - Specified `.timeline-quiet-dots` (3px dots, 3.5px gap, 1.9s cycle with 0s/0.15s/0.3s phase delays) and `cds-skeleton-sweep` (2s linear, 105deg angle, 255deg in RTL).
- **6-Tier Confirmation Dialog Matrix & Nested Dialog Blur**:
  - Extracted official `Qg` dialog scale: `sm: max-w-[400px]`, `md: max-w-[520px]`, `lg: max-w-[720px]`, `xl: max-w-[880px]`, `2xl: max-w-[1024px]`, `3xl: max-w-[1152px]`.
  - Added dynamic `--environment-dialog-cap` formula and automated nested dialog blurring: `data-[nested-dialog-open]:blur-[2px]`.
- **7.5rem Square Attachment Tiles & Bi-Directional Mid-Truncation**:
  - Corrected attachment card from 128x96px rectangle to exact square 7.5rem (`size-[calc(7.5rem * var(--cds-rem-scale, 1))]`, ~112.94px on desktop) with `rounded-card` and `shadow-field-drop`.
  - Documented floating remove button protocol: `absolute -end-2 -top-2 size-5 rounded-full bg-surface-3 shadow-card-ring`.
  - Recreated intelligent bi-directional mid-truncation (`head` + `…` + `tailStem` + `tailExt`) preserving file extension visibility.

#### Chapter 3: Chat Stream & Composer Engine (`docs/v1/03-会话核心流与指令交互引擎.md`)

- **Message Bubbles & Typography Scale (`[data-cds=UserMessage]`, `[data-cds=AssistantMessage]`)**:
  - Extracted exact bubble radius formula `--cds-message-bubble-radius: calc(var(--cds-radius) + calc(.25rem * var(--cds-rem-scale, 1)))` and padding `--cds-message-bubble-pad-x: var(--cds-pad-lg)` (16px), `--cds-message-bubble-pad-y: var(--cds-pad-md)` (12px).
  - Documented dynamic tinting: default `var(--cds-bg-neutral)` vs personal `#dde8f7` (Light) / `#193c5f` (Dark) with hover mixing `--feed-bubble-mix: 16%`.
  - Documented 300px collapse threshold with 3rem bottom decay mask: `[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]`.
  - Extracted Assistant message Text Inset & Stop Law: `--cds-assistant-message-text-inset: 4px; --cds-assistant-message-text-stop: clamp(0px, (100% - 384px) * .175, 56px);` with `0px` reset when embedding cards or tables.
  - Documented vertical rhythm: `--chat-turn-gap = chat-body * chat-leading * 0.75` and `--chat-item-gap = chat-body * chat-leading * 0.5`.
- **Thinking Accordion Timeline Physics (`.timeline-quiet-dots`, `.timeline-expand`)**:
  - Discovered exact `.timeline-quiet-dots` keyframe physics in `cc1aae219-DtZTxCKj.css` (3 dots, 3.5px gap, 3px diameter, 1.9s infinite `cubic-bezier(.4, 0, .2, 1)` with 0s/0.15s/0.3s delays).
  - Extracted CSS Grid 0fr $\leftrightarrow$ 1fr expansion (`.2s cubic-bezier(.19, 1, .22, 1) timeline-expand`) eliminating height recalculation reflow.
  - Documented status line entrance/exit physics: `.timeline-status-enter-quiet` (.24s rise 6px) and `.timeline-status-exit-quiet` (.18s fall -4px).
  - Implemented streaming generation lock (`isThinkingLive` locks `open=true` and suppresses toggle clicks).
- **Composer Engine & WebKit 500ms Post-Composition Delta Guard**:
  - Discovered Anthropic's WebKit 500ms post-composition delta guard (`Lm() && Math.abs(e.timeStamp - Fm) < 500`) in `shared-frame-BfjMqbuN.js`, eliminating false Enter submissions following CJK IME selection.
  - Implemented capture-phase `beforeinput` interceptor preventing synthetic line breaks.
  - Reverse engineered Slash & Mention tokenizer (`cb6930dae-BD0W5ZM9.js`): CJK punctuation stripper `$o = /[.,;:!?'"\u3001\u3002\uFF0C\uFF1B\uFF1A\uFF01\uFF1F\u2026]+$/`, `rs = 1024` max path length, and 256 file mentions defense cap.
  - Implemented `field-sizing: content` with ghost element fallback and `max-h-[min(40svh,24rem)]` (384px) cap.
- **Model Matrix & Prompt Caching Gauge**:
  - Updated official model architecture with Claude 3.7 Sonnet, Haiku 3.5, and Opus 3; documented deprecation of `thinking.type=enabled` in favor of `thinking.type=adaptive`.
  - Deconstructed 5m (`3e5` ms) and 1h (`36e5` ms) ephemeral cache token lifetimes with 4-part cost decomposition (`cache_read`, `cache_creation`, `input`, `output`).
  - Standardized circular SVG gauge formula: `strokeDashoffset = 2 * PI * r * (1 - ratio)` with 80% capacity alert threshold.
- **MCP Decision Cards & Security Lifecycle**:
  - Reverse engineered 3-stage authorization lifecycle (`pending_approval`, `running`, `success`/`error`) with real settle reasons: `user_denied`, `policy_denied`, `PERMISSIONS_ERROR`.
  - Extracted `structured_content` parameter inspection and session whitelist map (`bs`) with 330s automatic garbage collection.

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
