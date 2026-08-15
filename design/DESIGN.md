---
name: Utah Opportunity Navigator
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#115cb9'
  on-secondary: '#ffffff'
  secondary-container: '#659dfe'
  on-secondary-container: '#003370'
  tertiary: '#000e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#022800'
  on-tertiary-container: '#68945a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#acc7ff'
  on-secondary-fixed: '#001a40'
  on-secondary-fixed-variant: '#004491'
  tertiary-fixed: '#c0f0ad'
  tertiary-fixed-dim: '#a4d393'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#28501e'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
typography:
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-display:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1280px
---

## Brand & Style
The design system for this platform balances institutional authority with the agility of a modern startup. It targets entrepreneurs, developers, and local government officials, requiring a UI that feels reliable yet approachable.

The style is **Corporate / Modern** with a focus on high-utility data visualization. It avoids the dense, uninspiring layouts of traditional bureaucracy in favor of generous white space, clear information hierarchy, and soft tactile elements. The aesthetic should evoke a sense of momentum and "navigational" ease, using clean lines and subtle depth to guide the user through complex economic data.

## Colors
The palette is rooted in a foundation of **Deep Navy** and **Professional Blue** to establish immediate credibility and trust. These are complemented by **Utah Sage Green** and **Copper**, which provide a localized, organic warmth and represent growth and industry respectively.

- **Primary & Secondary:** Use for navigation, primary actions, and brand identification.
- **Tertiary & Quaternary:** Use sparingly for categorical indicators, specialized data sets, or subtle accents in illustrations.
- **Accents:** High-visibility Success Green and Warning Amber are reserved strictly for readiness scores and status indicators.
- **Backgrounds:** Off-white surfaces should be used to reduce eye strain, with soft grays providing structural separation between content blocks.

## Typography
The typography strategy employs **Montserrat** for headings to project confidence and a contemporary "founder" feel. A slight increase in letter spacing on headlines ensures an authoritative and airy presentation.

**Inter** is utilized for all body copy and data labels due to its exceptional legibility at small sizes and its neutral, systematic tone. For score visualizations (Match % and Readiness %), use the `data-display` style to ensure these key metrics are the primary focus of the visual hierarchy.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a max-width container for desktop viewing to prevent line lengths from becoming illegible.

- **Mobile (Default):** Single column with 16px side margins. Cards and data visualizations should span the full width of the safe area.
- **Tablet:** 8-column grid with 24px gutters.
- **Desktop:** 12-column grid. Sidebars for navigation or filtering should occupy 3 columns, with main content occupying the remaining 9.

Spacing follows an 8px base unit. Use `lg` and `xl` spacing for section vertical padding to maintain the "startup-like" airy feel, avoiding the cramped nature of legacy data portals.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. Surfaces should not feel "flat," but rather staged in a physical environment.

- **Base Layer:** Off-white (#F8F9FA) background.
- **Card Layer:** Pure white (#FFFFFF) with a soft, diffused shadow (0px 4px 12px rgba(0, 33, 71, 0.08)). This navy-tinted shadow ensures the depth feels integrated with the brand colors rather than a generic gray.
- **Interaction Layer:** Upon hover, cards should slightly lift (0px 8px 20px rgba(0, 33, 71, 0.12)) to provide tactile feedback.
- **Overlays:** Modals and dropdowns use a higher elevation with a subtle backdrop blur (4px) to maintain context while focusing user attention.

## Shapes
The shape language is defined by **Rounded** corners (8px default) to soften the professional aesthetic and make the tool feel modern and accessible.

- **Standard Elements:** Buttons, input fields, and small cards use the `rounded` (8px) token.
- **Large Containers:** Dashboard widgets and main content sections use `rounded-lg` (16px) to emphasize the "friendly startup" layout.
- **Pills:** Status badges (e.g., "Ready," "In Progress") should use `rounded-xl` (24px) for a distinct shape contrast against rectangular buttons.

## Components
- **Buttons:** Primary buttons are Solid Deep Navy with white text. Secondary buttons use a Copper or Professional Blue outline. All buttons have a minimum height of 48px for mobile tap targets.
- **Data Cards:** Cards housing "Match %" should feature a prominent circular progress indicator or a large-format Montserrat digit. Use a 2px Sage Green border for "High Match" cards to provide extra visual reinforcement.
- **Input Fields:** Use soft gray backgrounds (#F1F3F5) with a 1px border that shifts to Professional Blue on focus. Labels should always be visible above the field in `body-sm` bold.
- **Chips/Badges:** Use for industry tags (e.g., "Tech," "Manufacturing"). These should be low-contrast (light gray background, dark gray text) unless indicating a specific status.
- **Readiness Gauges:** Horizontal bar charts with rounded caps. The fill color dynamically changes from Warning Amber (<60%) to Success Green (≥80%) based on the data.
- **Lists:** Use "Active Lists" with 16px internal padding and subtle dividers. List items should have a hover state that applies a light blue tint (#E7F0F7).
