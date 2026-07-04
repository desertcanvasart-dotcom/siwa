# Fonts used on the Soléi website

Loaded from Google Fonts via `client/index.html` and wired into the
design system through CSS variables in `client/src/styles/tokens.css`
and Tailwind aliases in `tailwind.config.ts`.

## Primary pairing

| Role     | Family            | Weights / styles loaded             | Tailwind class | CSS variable     |
| -------- | ----------------- | ----------------------------------- | -------------- | ---------------- |
| Display  | Playfair Display  | 400, 500 — regular + italic         | `font-display` | `--font-display` |
| Body     | Raleway           | 300, 400, 500                       | `font-body`    | `--font-body`    |

- **Playfair Display** — every editorial heading, the gold-accent
  italic phrases in hero titles, the italic lede on journal articles,
  property names in hotel cards.
- **Raleway** — paragraphs, navigation labels, buttons, form fields,
  most UI chrome.

## Secondary / legacy

| Family             | Weights loaded            | Where it shows up                                   |
| ------------------ | ------------------------- | --------------------------------------------------- |
| Cormorant Garamond | 600                       | Loaded for select editorial accents; minimal use.   |
| Poppins            | 300, 400, 500, 600, 700   | Sits in the `font-sans` fallback chain after Raleway. |
| Inter              | 300, 400, 500, 600, 700   | Loaded but not actively referenced in current code. Candidate for removal if trimming the font payload. |

## Files

- `client/index.html` — Google Fonts `<link>` tag (single combined request).
- `client/src/styles/tokens.css` — `--font-display` and `--font-body` definitions.
- `client/src/index.css` — sets `body` to `var(--font-body)` and headings to `var(--font-display)`.
- `tailwind.config.ts` — `fontFamily.display`, `fontFamily.body`, `fontFamily.sans` aliases.
