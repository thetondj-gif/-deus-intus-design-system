# Deus Intus Design Rules

**Awaken the Power Within.**

This file converts the Deus Intus Open Design System into source-backed, reusable design rules for agents and template builders.

## Source context

The package is backed by the public GitHub design-system file at `open-design-system.md` and the evidence note in `context/github/deus-intus-repo-evidence.md`.

The source system defines Deus Intus as a premium spiritual streetwear brand that merges the 12 Universal Laws, sacred geometry, and spiritual mechanics with wearable apparel and digital storefront assets.

## Brand principle

Deus Intus should never look like a generic wellness brand. It should feel like a premium streetwear label with spiritual intelligence underneath the surface.

The visual language should combine:

- stark premium contrast
- disciplined grid systems
- sacred geometry used with precision
- heavyweight apparel texture
- minimal typography
- energetic but restrained gold accents
- grounded, authoritative copy

## Colour system

Use the colour tokens in `colors_and_type.css`.

- Obsidian is the primary background and should dominate premium layouts.
- Alabaster is the primary text and light background colour.
- Aether Gold is the luxury accent and should not be overused.
- Pineal Indigo adds esoteric depth and can support editorial or ritual-style layouts.
- Prana Sage grounds lifestyle panels, muted apparel blocks, and softer secondary sections.

## Typography system

Display typography should feel brutalist, geometric, confident, and widely tracked. Body typography should stay neutral and highly readable. Command State affirmations should use monospaced typography to create a coded, intentional, source-like feel.

Recommended hierarchy:

1. Large uppercase display heading.
2. Short affirming subline.
3. Minimal body copy.
4. Monospaced command tag or CTA.

## Sacred geometry implementation

Sacred geometry should function as structure, not decoration. Use it for:

- halos
- borders
- node systems
- subtle overlays
- product detail frames
- background fields
- modular section alignment

Never skew or distort geometry. Keep stroke weight consistent, fine, and mathematically clean. For POD graphics, thicken lines where print limitations require it.

## Apparel and product photography

Mockups should use moody, directional lighting, deep shadows, negative space, and visible garment texture. Product imagery should emphasise heavyweight cotton, embroidery, screen-print detail, and tactile quality.

Avoid bright, flat, generic ecommerce mockups unless producing a plain product listing requirement.

## Storefront layout rules

Use the 12 Universal Laws as a structural metaphor:

- Divine Oneness: strict grid, unified spacing, alignment.
- Vibration: subtle motion and energy accents.
- Correspondence: repeated visual patterns across product, copy, and UI.
- Inspired Action: clear CTA hierarchy.
- Space: large negative space around key visuals.

## UI and component rules

The applied UI kit must load `colors_and_type.css` and modular components from `ui_kits/app/components/`. Components should use the shared `.di-*` classes and CSS tokens where possible.

Every applied interface should include:

- a hero or command-state panel
- a product or collection card
- a CTA area
- a sacred geometry or triad visual reference
- a clear tagline instance

## Preview requirements

The `preview/` directory contains focused, auditable cards. Each preview should be self-contained, import shared tokens, and demonstrate a specific part of the design system:

- colours
- typography
- spacing
- buttons/components
- brand assets
- product or collection composition

## Final quality bar

A Deus Intus design is successful when it feels premium, restrained, spiritually intelligent, and commercially wearable. It should be clear enough for ecommerce and strong enough to support a billion-dollar lifestyle brand ambition.
