# Life Admin V10.0 Alpha

# Life Admin V9.3 Alpha

A polished local-first personal life-admin app designed for mobile Safari and PWA home-screen use.

## V8.3.3.1 Alpha
- Final visual polish pass for spacing, hierarchy, touch targets and mobile readability.
- Integrated Life Admin app icon/branding.
- Forest-green, mint, cream and muted green-grey visual system throughout the app.
- Local calendar for birthdays, appointments and general events.
- Existing recurring bills and income appear on the calendar.
- Fortnightly recurrence supported.
- Home, Items, Calendar, Money and More navigation.
- Local storage with export/import backup.

## PWA branding
The `assets/` folder contains the Life Admin app icons used by the manifest, browser tab and iPhone home-screen installation.

## Alpha testing
This build is intended for a small family/friends alpha test. Existing local data is retained through the current Life Admin storage key.


V8.4.2 changes: redesigned the home status card to remove the misleading percentage score and restored projected incoming/outgoing money calculations while retaining automatic income completion and recurring projections.


## V9.3
- Added five user-selectable colour themes: Forest, Ocean, Slate, Sunset and Lavender.
- Theme selection lives in Settings → Appearance and applies instantly.
- Selected theme is stored locally with existing app settings and survives reloads/imports.
- Semantic status colours remain consistent for overdue, due soon and completed states.


## V9.6
- Deployed the new neutral Life Admin folder/checklist branding across the PWA, browser icon, header and About area.
- Branding uses charcoal, ivory and soft stone-grey so it remains compatible with all five built-in themes: Forest, Ocean, Slate, Sunset and Lavender.
- Existing V9.5 functionality and local data storage remain unchanged.
- Version display is V9.6 Alpha.


## V10.0
- Added a real local Document Vault using IndexedDB for persistent photos and files.
- Added document categories: Bills, Receipts, Insurance, Warranties, Personal and Other.
- Added multi-file upload, optional item linking, image/PDF preview, open-file support and delete.
- Existing item attachments remain visible in the vault.
- JSON backups continue to cover Life Admin data; document files remain local to the device for now.


## V10.0 — Linked Document Relationships
Documents in the vault can now be linked to Life Admin items as a true two-way relationship. Linked vault documents appear in an item's Attachments section, can be opened from the item, and can be unlinked without deleting the document. The Attach action now opens the document picker, with an option to add a new document directly linked to the current item.


V10.0 visual polish: cleaner calendar presentation, refined interactive states, theme-aware subtle shadows, and the saved user name is shown only on the Home header (not Calendar/Items/Money/More).


## V10 Cloud Lab Baseline
This is a copy of the polished local-first Life Admin build prepared as the baseline for a separate cloud-sync experiment. Cloud sync is not implemented in this baseline.
