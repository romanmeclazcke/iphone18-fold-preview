# iPhone 18 Fold View

iPhone 18 Fold View previews a public website inside an interactive foldable-phone concept. Its portrait proportions are calibrated as a visual approximation of iPhone Duo, for quick responsive-layout reviews rather than hardware-accurate iOS emulation.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, paste a site address, and adjust the fold, perspective, or orientation controls.

You can share a configured preview with a query parameter:

```text
http://localhost:5173/?url=https%3A%2F%2Fexample.com
```

## iframe limitation

Sites that send `X-Frame-Options` or a restrictive Content Security Policy will refuse to render inside any browser-based preview tool. Use the direct-open button for those sites. Supporting them inside Foldview would require a separate server-side browser-capture mode.

## Verify

```bash
npm test
npm run lint
npm run build
```

## Deploy on Vercel

Import this repository into Vercel. The project is detected as a Vite app automatically; use `npm run build` as the build command and `dist` as the output directory.
