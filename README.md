# Life Admin V10.5 — Cloud Test

Cloud Lab build based on V10.4 corrected Supabase configuration.

## V10.5 fix
- Restored the missing local backup `exportData()` function.
- Cloud Pull could successfully retrieve cloud items, then `openSettings()` attempted to wire the Backup > Export button to a missing function, producing a `ReferenceError` (reported as `exportDate`/export-related in testing). This is now fixed.
- Backup exports include an `exportDate` timestamp and app version.
- Supabase URL remains the corrected Cloud Test project URL.
- Existing authentication, RLS and cloud push/pull behaviour are otherwise unchanged.
