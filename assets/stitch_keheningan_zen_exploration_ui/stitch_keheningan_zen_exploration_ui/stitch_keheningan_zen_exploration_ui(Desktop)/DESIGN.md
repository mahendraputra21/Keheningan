---
name: Keheningan Zen Exploration
colors:
  surface: '#fcf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fcf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ebe8df'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#494740'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f4f1e8'
  outline: '#7a776f'
  outline-variant: '#cac6bd'
  surface-tint: '#605e5b'
  primary: '#0e0d0c'
  on-primary: '#ffffff'
  primary-container: '#242321'
  on-primary-container: '#8d8a87'
  inverse-primary: '#cac6c2'
  secondary: '#526254'
  on-secondary: '#ffffff'
  secondary-container: '#d2e4d2'
  on-secondary-container: '#566758'
  tertiary: '#160a04'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e2016'
  on-tertiary-container: '#9c8678'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6e2de'
  primary-fixed-dim: '#cac6c2'
  on-primary-fixed: '#1c1b1a'
  on-primary-fixed-variant: '#484644'
  secondary-fixed: '#d5e7d5'
  secondary-fixed-dim: '#b9cbb9'
  on-secondary-fixed: '#101f13'
  on-secondary-fixed-variant: '#3b4b3d'
  tertiary-fixed: '#f8ddcd'
  tertiary-fixed-dim: '#dbc2b2'
  on-tertiary-fixed: '#26190f'
  on-tertiary-fixed-variant: '#554337'
  background: '#fcf9f0'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.04em
  headline-xl-mobile:
    fontFamily: Noto Serif
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: '1.25'
    letterSpacing: 0.03em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 2.5rem
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.03em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: '1.45'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '300'
    lineHeight: '1.8'
    letterSpacing: 0.025em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '300'
    lineHeight: '1.75'
    letterSpacing: 0.02em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: 0.03em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.16em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.5rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4.5rem
---

## Brand & Style

This design system embodies the Japanese aesthetic concepts of *Ma* (negative space / emptiness), *Wabi-sabi* (beauty in imperfection and transience), and *Yūgen* (subtle grace and depth). Created for an interactive Zen exploration web experience, the interface recedes entirely into the atmosphere, functioning not as a decorative overlay but as quiet brushstrokes across wet washi paper.

The emotional tone is meditative, grounded, and solitary. The target audience seeks respite, contemplative discovery, and quiet visual poetry. The interface strips away conventional game tropes: no HUD clusters, no numerical counters, no health gauges, no shrill notifications. Instead, the design style merges **Organic Tactility** with **Strict Wabi-Sabi Minimalism**—surfaces mimic fibrous handmade paper, text appears like hand-ground sumi ink seeping into parchment, and interactions dissolve softly like morning mist rising over moss gardens.

## Colors

The palette is derived directly from the traditional tools and natural elements of Japanese sumi-e painting and classical gardens:

- **Primary (`#242321` - Sumi Ink):** Deep charcoal ink ground from pine soot. Used for contemplative headings, active glyphs, and high-priority states. Never pure digital black (`#000000`).
- **Secondary (`#7A8B7B` - Muted Bamboo Sage):** Weathered moss and stone lichen. Used for subtle affordances, progressive disclosure hints, and state transitions. Its deeper shade (`#5C6E5E`) provides sustained contrast.
- **Tertiary (`#5C4A3E` - Natural Timber):** Aged hinoki cedar and temple timber. Provides warm, grounding balance across secondary narratives, subtle active selections, and natural delimiters.
- **Neutral (`#F7F4EB` - Washi Paper Base):** Raw mulberry fibers dried in indirect sunlight. Accompanied by `#EFE9DB` for layered washi panels and `#D9D5CC` / `#EDE9E1` for soft morning mist scrims and dividers.

Avoid saturated alerts or high-chroma highlights. Functional feedback is conveyed using subtle shifts in ink density (opacity variations from 20% to 85%) and gentle tinting toward dried sage or wet charcoal.

## Typography

Typography establishes an intentional cadence between lyrical, literary expression and quiet, functional restraint:

- **Headlines & Meditative Prose (`Noto Serif`):** Reserved for poetic excerpts, koan prompts, title cards, and dialogue. Letterforms must feel unhurried, typeset with intentional tracking (`0.02em` to `0.04em`) to let each character breathe. Vertical writing modes (`writing-mode: vertical-rl`) are supported for brief ritual inscriptions.
- **Interface & Interactions (`Plus Jakarta Sans`):** Clean, calm, geometric sans-serif tuned to low weights (`300` and `400`). Interface actions, controls, and dismissible hints use expanded tracking (`0.12em` to `0.16em`) and uppercase styling at small scales to maintain clarity without competing against the contemplative serif headlines.

## Layout & Spacing

The layout philosophy honors *Ma*—the expressive void where stillness lives. Rather than packing viewport space, elements sit adrift within generous, open territory.

- **Canvas Architecture:** An asymmetric fluid grid anchored by expansive margins (`margin: 4rem` desktop, `1.5rem` mobile). Elements drift in natural vertical alignment with wide vertical rhythms (`space-lg` and `space-xl`).
- **Responsive Adaptations:**
  - **Desktop (1024px+):** Generous off-center compositions, solitary controls anchored gracefully to the perimeter (e.g., bottom-right sound vessel, top-left chapter whisper), leaving central vistas unobstructed.
  - **Tablet (768px - 1023px):** Standardizes margins to `2.5rem`, collapses multi-column prose into centered single-thread contemplation scrolls.
  - **Mobile (<768px):** Reduces horizontal margins to `1.5rem`, ensures touch zones remain spacious (`48px` minimum touch envelope) while UI labels remain diminutive and peripheral.

## Elevation & Depth

Standard dropshadows, raised 3D planes, and layered plastic elevations are strictly forbidden. Visual depth is rendered through natural translucency and aqueous atmospheric layers:

1. **Base Parchment (Level 0):** Solid `#F7F4EB` tinted with a micro-grain organic texture imitating mulberry paper.
2. **Mist Diffusion (Level 1):** Overlays, contemplative dialogs, and navigation drawers use soft translucent wash layers (`rgba(247, 244, 235, 0.82)`) combined with subtle backdrop blur (`blur(12px)`). This creates the illusion of looking through moist silk or morning fog.
3. **Ambient Wet Shadow:** When tactile elements require separation, use an ultra-diffused, unsharp shadow that simulates wet ink bleeding slightly into paper: `0 12px 32px -8px rgba(36, 35, 33, 0.06)`.
4. **Delimiters:** Edges rely on low-contrast mist lines (`rgba(92, 74, 62, 0.12)`) or torn-paper organic margins rather than synthetic solid rules.

## Shapes

Shapes are understated, gentle, and organic. Sharp razor corners (`0px`) feel too mechanical, while pill caps (`9999px`) appear overly clinical or app-like.

- **Core Geometry:** UI panels, interactive cards, and input boundaries employ `roundedness: 1` (`0.25rem` to `0.5rem`), evoking the softened, hand-cut edges of hand-pressed paper squares.
- **Ensō Iconography:** Circular elements (focal anchors, breathing guides, audio rings) represent the Ensō—the brushstroke circle representing enlightenment, strength, and elegance. These maintain a free-form, variable stroke width rather than mechanical 1px rings.

## Components

### Buttons
- **Quiet Action (Primary):** Background of deep Sumi ink (`#242321`) with washi-toned text (`#F7F4EB`), padded with `0.625rem 1.75rem`, radius `0.25rem`. Hover triggers a tranquil opacity decay (`opacity: 0.85`) and a slow, gentle `translateY(-1px)` transition timed over `400ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Ghost Action (Secondary):** Completely transparent background framed by a delicate water-line border (`1px solid rgba(36, 35, 33, 0.18)`), Sumi text. On hover, the background softly washes with sage mist (`rgba(122, 139, 123, 0.1)`).
- **No tactile "press" or punchy bounce:** Transitions must emulate ink settling into fiber.

### Chips & Seals (Hanko)
- Compact classification tokens and environment cues. Styled like subtle Japanese artist seals (*Hanko*): square or softened rectangular borders (`0.25rem`), muted earth brown (`rgba(92, 74, 62, 0.12)`) background, labeled in tracking-wide uppercase typography (`label-sm`).

### Lists & Dialogue Threads
- Free of dividing borders and bullet discs. Items are paced using `space-md` gaps. Dialogue threads fade in progressively, line by line, mimicking silent contemplation, using left-aligned vertical rules tinted in soft mist (`#D9D5CC`).

### Checkboxes & Radio Affordances
- **Ritual Check:** A subtle square with an interior brush-stroke dot. Selected state reveals a deep sumi blot centered organically rather than a geometric checkmark.
- **Ensō Radio:** A soft outer circular trace (`18px`) that draws a miniature charcoal Ensō ring in the center when selected, accompanied by a quiet fade.

### Input Fields
- Single-line and poetic reflections use an uncontained baseline: no box envelope, only an ethereal bottom border (`rgba(36, 35, 33, 0.15)`). The active focus state gently darkens the rule to Sumi charcoal (`#242321`) with no harsh outline rings. Placeholder text rests in low-contrast mist gray (`#8C7A6B` at `50% opacity`).

### Contemplation Cards (Paper Panels)
- Surface panels use the secondary paper tone (`#EFE9DB`) over the primary backdrop, treated with an ambient wet shadow. Padding is generous (`space-lg`), inviting the user into a quiet space dedicated to single thoughts, journal fragments, or meditation pauses.

### Ritual Breathing Sphere / Focal Ring
- An interactive centerpiece featuring a hand-drawn Ensō SVG with subtle stroke breathing animations (`scale(0.98)` to `scale(1.02)` over `8000ms` sinusoidal loops), providing passive pacing for reading and meditation.