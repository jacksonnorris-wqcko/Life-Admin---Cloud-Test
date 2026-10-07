# Life Admin V12.1.3 — Family Beta

Visual/account refinement build for the Life Admin family beta.

- Dedicated Account & Sync area in the top toolbar
- Sign in / Create account / Sync moved out of Settings
- Home sync card removed to reduce duplication
- Settings now focuses on app preferences and local data tools
- Supabase auth/cloud data architecture retained
- Version 12.1.2


## V12.1.3 — Mobile keyboard / form usability fix
- Modal sheets now follow the visible mobile viewport when the software keyboard opens.
- Focused inputs are automatically scrolled into a usable position.
- Applied globally to modal forms across the app, not just Account & Sync.
- Removed automatic email autofocus on Account & Sync open so the keyboard does not appear unexpectedly.
- Added mobile viewport handling for iPhone/Safari keyboard resizing.


## V12.1.3 — Header and sync status polish
- Good morning/afternoon/evening is now shown only on Home. Other tabs use concise page titles.
- Account/cloud status now has a persistent visual state: synced, changes waiting, syncing, or offline.
- Cloud button gets a live status badge and accessible status label.
- No Supabase data model or sync architecture changes.
