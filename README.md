# Life Admin V11.0 — Cloud Test

Cloud Lab build based on V10.4 corrected Supabase configuration.

## V10.5 fix
- Restored the missing local backup `exportData()` function.
- Cloud Pull could successfully retrieve cloud items, then `openSettings()` attempted to wire the Backup > Export button to a missing function, producing a `ReferenceError` (reported as `exportDate`/export-related in testing). This is now fixed.
- Backup exports include an `exportDate` timestamp and app version.
- Supabase URL remains the corrected Cloud Test project URL.
- Existing authentication, RLS and cloud push/pull behaviour are otherwise unchanged.


### V11.0 update handling
The Cloud Test uses a network-first service worker for the app shell and checks for a fresh service worker whenever the app opens.
This is designed to pick up new GitHub Pages builds automatically without users clearing browser/site data. Offline fallback remains available for previously cached app-shell files.

### V11.0 cloud snapshot sync
- Calendar events are included in cloud transfers.
- Push replaces the signed-in user's previous cloud snapshot instead of accumulating stale rows.
- Pull restores the cloud snapshot and replaces local Life Admin items/events rather than merging stale local data.
- Documents remain local.



### V11.0 local sign-out cleanup
Signing out clears this device's local Life Admin items, calendar events, local document metadata, and locally stored document files. The cloud snapshot is not deleted. Sign-out uses a local session scope so other devices remain signed in.

### V11.0 Alpha Prep
- Replaced separate Push local / Pull cloud controls with one Sync now action.
- Sync saves the current device snapshot first, then reads it back and refreshes the local workspace.
- Shows the last successful sync time.

### V11.6 Alpha Prep — sync status
- Added a home-screen cloud status card.
- Shows `Up to date` with the last successful sync time.
- Shows `Changes not synced` whenever local data changes after a successful sync.
- Tapping the card runs Sync Now when connected, or opens Cloud Connect when not connected.
- Cloud pulls are marked clean so restored data does not immediately appear as unsynced.


### V11.4 Alpha Prep
- Explicit sign-in always reconciles with the cloud snapshot first when there are no local unsynced changes.
- Logout/login can no longer rely on a stale local sync timestamp.
- Sync now pulls the current cloud snapshot whenever the device has no unsynced local changes.
- If local edits and newer cloud edits both exist, the app pulls the newer cloud copy instead of silently overwriting it.


## V11.5 Visual Polish
- Premium visual refresh built from the stable V11.4 cloud-sync baseline.
- Cloud/auth/snapshot logic intentionally unchanged.
- Refined hierarchy, spacing, cards, navigation, typography, status treatments, buttons and mobile safe-area presentation.
- More restrained brand colour usage and cleaner list/calendar presentation.


V11.6 visual correction: restored theme-aware accent surfaces throughout the V11.5 polish layer, including the floating + button, active navigation, primary controls, selected chips, calendar add controls and theme-driven cards. Added Berry, Teal and Amber themes. Cloud/auth/sync logic unchanged.


V11.6 Colour & Personality Pass: theme selector changed to a compact dropdown with live swatch; added stronger theme-aware colour accents, gradients, category surfaces, Money/Calendar/Home colour treatments, and theme-driven primary/add controls. Cloud/auth/sync logic unchanged.
