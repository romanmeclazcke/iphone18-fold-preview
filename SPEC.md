# Spec: Foldview

## Objective

Build a reusable browser tool where a user pastes a public URL and previews it inside an interactive, foldable phone mockup. The MVP must make responsive review useful without pretending to reproduce unreleased hardware pixel-for-pixel.

## Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS 4, Phosphor icons, Vitest.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

## Project Structure

- `src/` application source and component tests
- `tasks/` implementation plan and checklist
- `public/` static assets if needed later

## Code Style

Use small typed React components, local state for isolated interaction, explicit labels, and pure helpers for validation.

```ts
export function normalizeUrl(value: string): string | null {
  const candidate = value.match(/^https?:\/\//i) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
```

## Testing Strategy

Unit test URL normalization and component interactions. Validate production compilation with `npm run build`, lint with `npm run lint`, and visually inspect both folded and unfolded states in a real browser.

## Boundaries

- Always: validate URL input, preserve keyboard accessibility, explain iframe restrictions.
- Ask first: add a server-side screenshot/proxy service, analytics, authentication, or deployment.
- Never: proxy credentials, bypass site security headers, claim exact Apple device dimensions without official web viewport data.

## Success Criteria

- A user can paste a public HTTP(S) URL and load it in the device.
- The device transitions between compact outer-screen and wide inner-screen states.
- The user can adjust fold and viewing angle, rotate orientation, reload, and open the URL directly.
- Empty, loading, invalid-input, and iframe-restriction guidance are present.
- Tests, lint, and production build pass.

## Open Questions

- A future capture mode can support sites that deny iframe embedding.
- Exact Safari/iOS simulation will require an official simulator profile and real-device validation.
