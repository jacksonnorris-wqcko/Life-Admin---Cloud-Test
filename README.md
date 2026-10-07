# Life Admin V10.6 — Cloud Test

Cloud Lab build based on V10.4 corrected Supabase configuration.

## V10.5 fix
- Restored the missing local backup `exportData()` function.
- Cloud Pull could successfully retrieve cloud items, then `openSettings()` attempted to wire the Backup > Export button to a missing function, producing a `ReferenceError` (reported as `exportDate`/export-related in testing). This is now fixed.
- Backup exports include an `exportDate` timestamp and app version.
- Supabase URL remains the corrected Cloud Test project URL.
- Existing authentication, RLS and cloud push/pull behaviour are otherwise unchanged.


### V10.6 update handling
The Cloud Test now uses a network-first service worker for the app shell and checks for a fresh service worker whenever the app opens. This is designed to pick up new GitHub Pages builds automatically without users clearing browser/site data. Offline fallback remains available for previously cached app-shell files.
