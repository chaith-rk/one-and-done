# Changelog - One and Done Task Manager

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2025-12-20

### V1 Scope Finalization

Major architectural decisions finalized to simplify V1 and accelerate time-to-market.

### Added to V1

**Core Features:**
- **Bulk Operations** - Multi-select tasks with checkboxes, bulk delete with confirmation, bulk complete
- **Filter Views** - Toggle between "All" (default), "Active" (incomplete only), "Completed" (completed only)
- **Auto-Sorting** - Tasks sorted by creation date (newest first) OR by due date (earliest first, overdue at top)
- **Hard Delete with Confirmation** - Permanent task/list deletion with "Are you sure?" dialog
- **Password Reset** - Email-based password reset via Supabase (trivial to implement, prevents support burden)
- **Protected Inbox List** - Default "Inbox" list cannot be deleted or renamed
- **Responsive Task Editing** - Inline edit on desktop, bottom sheet modal on mobile

**UI/UX:**
- Two-column layout (lists | tasks) - simpler than three-column
- Completed tasks automatically move to bottom with strikethrough
- Can uncheck completed tasks → moves back to top
- Empty states with helpful prompts

**Technical:**
- Theme token system - All colors defined in `tailwind.config.js` (never hardcode hex in components)
- Acceptance test requirement - Change primary color → entire app updates

### Removed from V1 (Deferred to V2)

**Folders:**
- **Rationale:** Unnecessary for users with <20 lists. Tasks are ephemeral (completed and archived), unlike notes which accumulate indefinitely. Data will inform if folders needed (30+ lists).
- **V2 Timeline:** Add if user research shows need for hierarchical organization

**Drag-and-Drop:**
- **Rationale:** Auto-sorting provides 90% of functionality with 10% of implementation complexity. Arrow buttons removed entirely.
- **V2 Timeline:** Add based on user feedback if manual reordering is requested

**Manual Reordering UI (Arrow Buttons):**
- **Rationale:** Auto-sort handles ordering automatically. No need for manual controls in V1.
- **V2 Timeline:** May add with drag-drop if users request manual control

**Soft Delete / Deleted Section:**
- **Rationale:** Simpler architecture. Hard delete reduces complexity, no need for recovery mechanism, no 30-day auto-purge cron job.
- **V2 Timeline:** Add if users report accidental deletions as major pain point

**Email Verification:**
- **Rationale:** Reduces signup friction. Industry data shows 20-40% drop-off with email verification. Target is 100 signups in 30 days - every friction point hurts.
- **V1.5 Timeline:** Add after 100+ users if spam becomes an issue

### Database Schema Changes

**`lists` table:**
- ❌ Removed `folder_id` column - No folders in V1
- ❌ Removed `position` column - Auto-sorted by `created_at ASC` (creation order)
- ✅ Added `is_inbox` boolean - Marks protected default list

**`tasks` table:**
- ❌ Removed `position` column - Auto-sorted by `created_at DESC` or `due_date ASC`
- ❌ Removed `deleted_at` column - Hard delete only (no soft delete)

**`folders` table:**
- ❌ Table removed entirely - Deferred to V2

**Indexes:**
- Added `idx_lists_created_at` for auto-sorting
- Added `idx_tasks_created_at` for auto-sorting
- Added `idx_tasks_due_date` for due date sorting
- Removed all position-based indexes

### Dependency Changes

**Removed:**
- `@dnd-kit/core` - No drag-drop in V1
- `@dnd-kit/sortable` - No manual reordering
- `@dnd-kit/utilities` - Not needed

**No Changes:**
- All other dependencies remain (Supabase, Zod, shadcn/ui, Tailwind)

### Documentation Updates

**Created:**
- `CHANGELOG.md` - This file

**Updated:**
- `docs/PRD.md` - Added user flows, error handling, data policy, bulk operations, settings spec
- `docs/AI-INSTRUCTIONS.md` - Updated schema docs, removed drag-drop troubleshooting
- `README.md` - Removed false claims about folders/drag-drop, updated features and usage guide
- `docs/PROGRESS.md` - Updated Phases 3-5 to remove deferred features, updated success criteria

### Theme Token System (CRITICAL)

**Strict enforcement of design tokens:**
- ALL colors must be defined in `tailwind.config.js`
- NEVER use `bg-[#hexcode]` or hardcoded hex values in components
- Acceptance test: Change primary color in config → entire app updates
- Enables future dark mode / theming with single file edit

**Token structure:**
- `primary` - Orange #FF9500
- `primary-light` - #FFB84D
- `primary-dark` - #FF8000
- `background` - White #FFFFFF
- `text-primary` - Dark text #1D1D1F
- `text-secondary` - Gray text #86868B
- `border` - Subtle borders #D2D2D7

---

## V1 Launch Targets (First 30 Days)

**User Acquisition:**
- 100 signups
- 50 weekly active users

**Engagement:**
- 70% of users create at least 1 task
- 40% return on Day 7
- Average 10 tasks created per user

**Technical:**
- 99% uptime
- < 100ms avg API response time
- Zero critical bugs

**North Star Metric:** Weekly active tasks completed

---

## Future Versions

### V1.5 (Quick Wins)
- Email verification (if spam is an issue)
- Overdue task styling (red/warning colors)
- Keyboard shortcuts (power user feature)

### V2 (Major Features)
- Folders (if data shows users have 30+ lists)
- Drag-and-drop reordering
- Soft delete / 30-day recovery
- AI phone call concierge
- ChatGPT integration
- Subtasks
- Recurring tasks
- Collaboration (share lists)
- Tags/labels
- Calendar view
- Dark mode
- OAuth providers (Google, Apple)

### V3 (Platform Expansion)
- iOS native app
- Offline support
- Push notifications
- Widgets
- API access for integrations

---

## Notes

**Philosophy:** Build for the 80% use case (5-20 lists, tasks are ephemeral). Let real user behavior inform V2 features. Ship fast, iterate based on data.

**Data Model:** User → Lists → Tasks (flat, simple hierarchy)

**Non-Negotiables:**
- Mobile must work perfectly (60%+ of users will be mobile)
- Data security (RLS on all tables)
- Fast UI (optimistic updates, no loading spinners)
- Orange theme (brand identity)

---

Last updated: 2025-12-20
