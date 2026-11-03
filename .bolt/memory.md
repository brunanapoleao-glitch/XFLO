# Project memory

## Product intent & audience

- XFLO is a digital creation brand; the project is a full-stack institutional website plus an admin panel.
- Audience: prospective clients evaluating XFLO's digital creation services.
- Services offered: website creation, visual identity, interactive invitations, digital catalogs, and other digital materials connecting people and brands.
- Stack: React + Vite + TypeScript, Tailwind CSS, Supabase for backend/auth/data.

## Brand personality & voice

- Portuguese-language UI and content.
- Friendly, modern, approachable tone — imagery should convey happiness and human connection, not sterile/corporate.
- Brand promise: transform ideas into digital experiences; combine creativity, technology, and strategy; every project has its own identity and deserves attention to detail, innovation, and dedication.

## Visual design & UX direction

- Hero section: two-column desktop layout (copy + CTAs left, photo right); stacks on mobile.
- Hero photo: user-supplied image of smiling professional in office with laptop (replaced stock photo).
- Photo in glowing purple frame with floating badges (e.g. "Projeto entregue", "Design sob medida").
- "Quem somos" section added directly below hero with user-provided copy; nav menu link added.
- Custom animation keyframes used sparingly; `prefers-reduced-motion` respected.
- Lucide React icons for logos and UI; no extra icon/theme packages.
- Brand color leans purple (glow effects, accents).
- Responsive across mobile, tablet, desktop — visual review recommended at all breakpoints.
- Portfolio projects displayed as grid on homepage.
- Planned carousel for showcasing created websites (sliding strip with arrows + touch swipe); reuses existing admin data.

## Decisions, constraints & rationale

- No UI theme or icon packages beyond Tailwind + lucide-react unless explicitly requested.
- Use `@/` path alias for imports (maps to `src/`).
- Removed unused large hero logo component after switching to photo-based hero.
- Admin panel supports portfolio project CRUD (name, type, order, photo); changes reflect automatically on site.
- Carousel will reuse existing admin data — no admin panel changes needed.

## Open questions & assumptions

- No live browser preview; visual correctness assumed from build/lint success only.
- Exact Supabase schema, admin panel scope, and page list beyond home not yet confirmed.
- Accessibility (alt text, contrast) for new imagery not explicitly verified.
- Hero photo framing on large/small screens needs visual confirmation.
- User hasn't decided whether carousel replaces the grid or is added alongside it.