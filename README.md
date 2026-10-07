# Life Admin V10.8 — Cloud Test

Cloud Lab build based on V10.4 corrected Supabase configuration.

## V10.5 fix
- Restored the missing local backup `exportData()` function.
- Cloud Pull could successfully retrieve cloud items, then `openSettings()` attempted to wire the Backup > Export button to a missing function, producing a `ReferenceError` (reported as `exportDate`/export-related in testing). This is now fixed.
- Backup exports include an `exportDate` timestamp and app version.
- Supabase URL remains the corrected Cloud Test project URL.
- Existing authentication, RLS and cloud push/pull behaviour are otherwise unchanged.


### V10.6 update handling
The Cloud Test uses a network-first service worker for the app shell and checks for a fresh service worker whenever the app opens.
This is designed to pick up new GitHub Pages builds automatically without users clearing browser/site data. Offline fallback remains available for previously cached app-shell files.

### V10.8 cloud snapshot sync
- Calendar events are included in cloud transfers.
- Push replaces the signed-in user's previous cloud snapshot instead of accumulating stale rows.
- Pull restores the cloud snapshot and replaces local Life Admin items/events rather than merging stale local data.
- Documents remain local.



### V10.8 local sign-out cleanup
Signing out clears this device's local Life Admin items, calendar events, local document metadata, and locally stored document files. The cloud snapshot is not deleted. Sign-out uses a local session scope so other devices remain signed in.
