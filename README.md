# Life Admin V0.0.1 — Friends & Family Beta
## Mobile sign-in icon hotfix

This patch fixes the broken/question-mark icon shown in the Sign in / Create account modal on mobile.

### Changed file
- `app.js`

No icons, manifests, images, or unchanged files are included. The auth modal now uses the same inline theme-aware SVG branding system as the rest of the app, avoiding the missing nested image asset.
