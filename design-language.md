# Design Language

This project uses React + Tailwind + DaisyUI with a light, dashboard-focused UI. The look is clean and modern, with strong red accents, dark charcoal text, and rounded, card-based layouts.

## Core palette
- Primary: #EC232B (brand red, CTAs, highlights)
- Secondary: #22262B (charcoal, headings, nav, neutral actions)
- Neutral: #565656 (muted text)
- Backgrounds: #FFFFFF (base), #F2F2F2, #E5E6E6, #EFEFEF (panel + page backdrops)
- State colors: info #3ABFF8, success #36D399, warning #FBBD23, error #F87272

## Typography
- Font: Poppins (tailwind config); default body text is medium weight with tight, readable line height.
- Headings are bold or semibold; body/secondary text uses muted gray.

## Layout and spacing
- Dashboard layout with left icon-only sidebar (pill buttons) + top bar for greeting, search, and actions.
- Card-first surfaces: `bg-white` or `bg-background` with `rounded-xl` and `p-5`/`p-6` padding.
- Pills and chips use `rounded-full` with small padding; avatars and icon buttons are circular.
- Generous whitespace; use subtle borders and hover shadows for separation.

## Components and patterns
- Buttons: primary red fill with white text; dark fill for neutral actions; outline red for secondary actions. Icons often paired with text.
- Inputs: DaisyUI `input` and `select` classes, usually on white surfaces; search inputs include left icons.
- Status chips: tinted backgrounds (e.g., `primary/10`, `green-100`) with rounded-full shapes.
- Tables/cards use light shadows (`shadow-sm`) and increase on hover (`hover:shadow-lg`).

## Motion and feedback
- Transitions are quick and subtle (200–300ms) on hover states.
- Animations: slide/fade for toasts and panels; pulse for skeleton loading.
- Toasts appear top-center with strong color fills and rounded corners.

## Imagery and branding
- Login screen uses a gradient background image plus campus photo and school logos.
- Iconography is consistent via `react-icons` (line + filled variants).

## Notes for consistency
- Light theme only; no dark theme styling.
- Use `text-muted` for secondary text and `text-dark` for primary headings.
- Prefer rounded shapes and soft edges; avoid hard corners or heavy borders.
