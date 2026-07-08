# Deus Intus Design System Skill

Use this skill whenever creating or reviewing Deus Intus visual assets, product storytelling, storefront UI, collection pages, social graphics, or prompt-ready design references.

## Primary instruction

Treat these files as the package source of truth:

- `open-design-system.md`
- `DESIGN.md`
- `colors_and_type.css`
- `preview/*.html`
- `ui_kits/app/index.html`

Lead with the exact tagline: **Awaken the Power Within.**

## Brand behaviour

Generate work that feels:

- sacred-modern
- premium and cinematic
- calm but powerful
- spacious and restrained
- emotionally grounded

Avoid:

- generic wellness styling
- generic tech-dashboard styling
- cluttered new-age effects
- distorted sacred geometry
- loud rainbow gradients
- hype-heavy copy

## Colour usage

Use `colors_and_type.css` tokens directly.

Core palette:

- Deep Navy `#0B213A`
- Midnight `#081829`
- Ink `#12202E`
- Sacred Gold `#C9A227`
- Soft Gold `#D7C38A`
- Luminous Aqua `#84D7D2`
- Mist Aqua `#D9F4F2`
- Bone `#F7F4EE`

Gold is for hierarchy and emphasis. Aqua is a secondary energy accent. Bone is the preferred light text colour on dark surfaces.

## Typography usage

- Display: `Italiana`
- Reflective/editorial: `Lora` or `Cormorant Garamond`
- Body/UI: `Montserrat`
- Command/meta: `Jura`

Use spacious display settings, calm body copy, and tracked uppercase labels for metadata and system moments.

## Sacred geometry rules

Geometry must stay mathematically clean and visually restrained. Use circles, arcs, halos, and quiet linework as structure. Never let symbolism overpower readability.

## Product and surface rules

Prioritise:

- dark luxury panels
- fine borders
- premium material feeling
- generous negative space
- calm CTA hierarchy

Mockups and product surfaces should feel editorial and tactile, not flat or catalogue-generic.

## UI kit rules

When building HTML interfaces:

1. Load `colors_and_type.css`.
2. Load the modular files in `ui_kits/app/components/`.
3. Reuse `.di-card`, `.di-button`, `.di-display`, `.di-command`, and related shared styles.
4. Compose full brand moments instead of isolated fragments.
5. Keep motion slow and polished.

## Audit repair behaviour

If an audit finds drift, update the actual package files so docs, previews, tokens, and the applied UI kit stay in sync. Do not patch one layer and leave the rest contradicting it.
