# Deus Intus Design System Skill

Use this skill whenever creating or reviewing Deus Intus visual assets, product mockups, storefront UI, collection pages, social graphics, or prompt templates.

## Primary instruction

Always treat the package files as the source of truth, especially:

- `open-design-system.md`
- `DESIGN.md`
- `colors_and_type.css`
- `preview/*.html`
- `ui_kits/app/index.html`

Lead with the Deus Intus tagline: **Awaken the Power Within.**

## Brand behaviour

Generate work that feels:

- premium spiritual streetwear
- modern, grounded, and esoteric
- calm but powerful
- spacious, restrained, and intentional
- suitable for product pages, mockups, apparel graphics, and social posts

Avoid:

- generic wellness templates
- cluttered new-age effects
- distorted sacred geometry
- loud rainbow gradients
- thin unreadable print details
- cheap mockup styling
- overexplaining the brand in every design

## Colour usage

Use `colors_and_type.css` tokens directly when producing HTML or UI work.

Core palette:

- Obsidian `#050505`
- Alabaster `#FAFAFA`
- Aether Gold `#D4AF37`
- Pineal Indigo `#2D004B`
- Prana Sage `#8A9A86`

Aether Gold should be used with restraint for sacred geometry, premium highlights, borders, and call-to-action states.

## Typography usage

- Display: Space Grotesk, Monument Extended, Arial Black fallback.
- Body: Inter, Helvetica Now, Helvetica fallback.
- Command State: Roboto Mono or Courier New.

Use uppercase, wide tracking, and short declarative lines for apparel graphics and command-state affirmations.

## Sacred geometry rules

Geometry must remain mathematically clean. Do not stretch, skew, or casually distort sacred geometry. Use it as a structural layer, border, halo, node system, or fine-line background.

## Product and mockup rules

Prioritise heavy cotton texture, embroidery detail, tactile surfaces, directional light, shadow depth, and spacious composition. Mockups should feel like premium editorial still-life photography rather than generic catalogue images.

## UI kit rules

When building HTML interfaces:

1. Import `../../colors_and_type.css` from `ui_kits/app/index.html`.
2. Load modular files from `ui_kits/app/components/`.
3. Use reusable class names such as `.di-card`, `.di-button`, `.di-display`, and `.di-command`.
4. Create composed interfaces, not isolated fragments.
5. Keep motion subtle and breath-like.

## Audit repair behaviour

If an audit reports missing package assets, update the actual package files. Do not suppress warnings, delete evidence, or satisfy findings by only rewriting prose. Preserve context and evidence notes outside `context/` when requested by the audit, and keep README, SKILL, DESIGN, preview cards, CSS tokens, and UI kit files in sync.
