# Product Requirements Document: One and Done

## Product Vision

**One and Done** is a minimalist task management web application that helps users organize their tasks with a clean, distraction-free interface. Inspired by the Apple Calculator's aesthetic, the app features an orange color scheme and focuses on simplicity and speed.

The long-term vision includes AI-powered features like a phone call concierge and ChatGPT integration, plus a native iOS app, but V1 focuses on delivering a rock-solid core task management experience.

## Target Users

### Primary Persona: The Productivity Minimalist
- **Age:** 25-45
- **Occupation:** Knowledge workers, entrepreneurs, students
- **Pain Points:**
  - Overwhelmed by complex task managers with too many features
  - Wants something fast and simple
  - Needs tasks organized but doesn't want to spend time organizing
  - Mobile-first lifestyle

### Secondary Persona: The Future AI Early Adopter
- Same as primary, but excited about:
  - AI-assisted task creation
  - Voice/phone call task capture
  - Smart task suggestions
- Willing to be early tester for V2 features

## V1 Features (MVP)

### Authentication
- **Email/password signup** - Simple, no email verification required
- **Login/logout** - Secure session management via Supabase Auth
- **Password reset** - Email-based password reset via Supabase (trivial to implement, prevents support burden)

### Core Task Management

#### Task Lists
- Create, edit, delete lists
- Auto-sorted by creation order (no manual reordering in V1)
- "Inbox" list is protected (cannot be deleted or renamed)
- Lists appear in left sidebar
- New users get default "Inbox" list with sample task

#### Tasks
- **Required fields:** Task title
- **Optional fields:**
  - Description (multi-line text)
  - Due date (date picker)
  - Due time (time picker)
- **Actions:**
  - Create new task
  - Edit existing task (desktop: inline edit, mobile: bottom sheet modal)
  - Delete task (hard delete with confirmation)
  - Mark complete/incomplete (checkbox)
  - Bulk operations (multi-select, bulk delete, bulk complete)

#### Task Display

**Sorting:**
- Auto-sort by creation date (newest first) - default
- OR sort by due date (earliest first, overdue at top)

**Completed Tasks:**
- Automatically move to bottom of list
- Strikethrough text
- Grayed out appearance
- Can be unchecked → moves back to top

**Filter Views:**
- "All" (default) - Show incomplete + completed
- "Active" - Show only incomplete
- "Completed" - Show only completed

**Bulk Operations:**
- Multi-select tasks with checkboxes
- Bulk delete with confirmation
- Bulk complete (no confirmation needed)

**Empty States:**
- Empty list: "No tasks yet. Click + to add your first task."
- All completed: "All tasks completed! 🎉"
- No results after filter: "No active/completed tasks."

### User Interface

#### Default New User Experience
- First login creates **one default list named "Inbox"**
- Contains **one sample task:** "Welcome! Click here to edit this task or create your own."
- No onboarding wizard (poor completion rates in user research)
- Users can immediately start adding tasks without setup friction

### Critical User Flows

#### Flow 1: First-Time User
1. Sign up with email/password → Immediately logged in
2. See dashboard with "Inbox" list (pre-created)
3. See one sample task: "Welcome! Click here to edit this task or create your own."
4. Click task → Inline editor appears → Edit text → Auto-saves
5. Click ☐ checkbox → Task completes → Strikethrough, moves to bottom
6. Click "+ New Task" → Inline input → Type title → Press Enter → Created

#### Flow 2: Create Task with Due Date
1. Click "+ New Task"
2. Type title → Press Enter → Task created
3. Click task → Inline editor opens
4. Click "Due date" field → Date picker → Select date → Auto-saves
5. Optional: Click "Due time" → Time picker → Select time → Auto-saves
6. Click outside task → Editor closes

#### Flow 3: Bulk Delete Completed Tasks
1. Filter view: Click "Completed" to see only completed tasks
2. Checkbox appears on hover for each task
3. Click checkboxes to select multiple tasks
4. "Delete Selected (N)" button appears at top
5. Click → Confirmation dialog: "Delete N tasks? This cannot be undone."
6. Click "Delete" → All selected tasks permanently deleted

#### Flow 4: Filter Tasks
1. Default view: "All" (shows both incomplete + completed)
2. Click "Active" filter → Only incomplete tasks visible
3. Click "Completed" filter → Only completed tasks visible
4. Click "All" filter → Back to showing everything

#### Flow 5: Delete Single Task
1. Hover over task → Trash icon appears
2. Click trash → Confirmation dialog: "Are you sure you want to delete?"
3. Click "Delete" → Task permanently deleted (hard delete, no recovery)

#### Flow 6: Create New List
1. Click "+ New List" in sidebar
2. Inline input appears → Type name → Press Enter
3. List created, appears in sidebar (sorted by creation order)
4. Click list → Select it → Right panel shows tasks from that list
5. Exception: "Inbox" list has no delete icon (protected)

#### Design Principles
1. **Minimalism** - No clutter, essential features only
2. **Speed** - Fast loading, instant interactions
3. **Apple-inspired** - Clean, modern, calculator-like aesthetic
4. **Orange theme** - Primary brand color: #FF9500

#### Layout
- **Desktop:** Two-column layout (lists | tasks)
- **Mobile:** Single-column with navigation tabs
- **Responsive breakpoints** at 768px and 1024px

#### Visual Design
- **Theme System:** All colors defined in `tailwind.config.js` as design tokens
  - `primary` (#FF9500 orange)
  - `primary-light`, `primary-dark` (variations)
  - `background`, `text`, `secondary`, `accent`
- **NEVER hardcode hex values in components** - use Tailwind theme tokens (`bg-primary`, not `bg-[#FF9500]`)
- **Color Palette:**
  - Orange primary buttons and accents (#FF9500)
  - White background (#FFFFFF)
  - Dark text (#1D1D1F)
  - Gray secondary text (#86868B)
  - Subtle borders (#D2D2D7)
- Smooth transitions and hover states

### Technical Requirements

#### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

#### Browser Support
- Chrome/Edge (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (last 2 versions)

#### Data & Privacy
- All user data isolated via Row Level Security
- No third-party analytics in V1
- Data stored in Supabase (US region)
- HTTPS only

### Error Handling Strategy

#### Network Errors
**Scenario:** User clicks "Create Task" but network fails mid-request

**UX:**
- Show toast notification: "Connection lost. Retrying..."
- Auto-retry up to 3 times
- If all retries fail: "Couldn't save task. Try again" with Retry button
- Task remains in UI (optimistic update) but shows error icon

#### Validation Errors
**Empty task title:**
- Inline error: "Task title is required"
- Prevent submission until fixed

**Invalid due date:**
- Inline error: "Date must be today or in the future"

**Empty list name:**
- Inline error: "List name is required"

#### Supabase Downtime
- Banner at top: "Service temporarily unavailable. We're working on it."
- Disable all create/edit/delete actions
- Read-only mode if possible (can view tasks but not modify)

#### Optimistic Update Failures
**Pattern:** UI updates immediately for speed, then syncs with backend

**If backend fails:**
- Revert UI change
- Show error toast: "Couldn't save changes. Please try again."
- Example: Task appears checked → backend fails → unchecks automatically + shows error

#### Authentication Errors
**Session expired:**
- Redirect to login page
- Show message: "Your session has expired. Please log in again."
- After re-login, return to previous page

#### Concurrent Editing
**Same user, 2 devices (phone + desktop):**
- V1: Last write wins (no conflict resolution)
- V2: Real-time sync via Supabase Realtime subscriptions

### Data Retention & Privacy Policy

#### Hard Delete Policy
**Tasks:**
- Click delete → Confirmation dialog → Permanent deletion
- No recovery mechanism in V1
- No "deleted" section or trash

**Lists:**
- Click delete → Confirmation dialog
- If list has tasks → Cascade delete (all tasks deleted too)
- Exception: "Inbox" list cannot be deleted

**Account:**
- User can delete account from Settings
- Confirmation: Must type "DELETE" to confirm
- All data purged immediately (lists, tasks, profile)

#### User Rights (GDPR Compliance)

**Data Export:**
- Available in Settings → "Export Data"
- JSON file with all lists and tasks
- Format:
  ```json
  {
    "lists": [...],
    "tasks": [...],
    "exported_at": "2025-12-20T10:30:00Z"
  }
  ```

**Account Deletion:**
- Available in Settings → "Delete Account"
- All data purged immediately
- No data retention post-deletion
- Cannot be undone

**Privacy Commitments:**
- No personal data sold or shared with third parties
- No third-party analytics in V1 (privacy-first)
- Data stored in Supabase (US region)
- HTTPS only

#### Legal Requirements (Pre-Launch)
- Privacy Policy (use template from Termly)
- Terms of Service (use template from TermsFeed)
- Display links in footer
- Last updated date on both documents

#### Data Security
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Auth handled by Supabase (bcrypt password hashing)
- No passwords stored in plain text

### Settings Page Specification

**Path:** `/settings`

#### Account Settings
- **Email:** Display only (cannot change in V1)
- **Change Password:** Form with "Current password" + "New password" + "Confirm password"
- **Delete Account:** Button → Confirmation modal → Type "DELETE" → Purge all data

#### Data Management
- **Export Data:** Button → Download JSON file
- **View Statistics:** Total tasks created, total completed, current streak
- **Clear All Completed Tasks:** Button → Confirmation → Delete all completed tasks across all lists

#### Display Preferences
- **Default Filter View:** Dropdown (All | Active | Completed)
- **Date Format:** Dropdown (MM/DD/YYYY | DD/MM/YYYY | YYYY-MM-DD)
- **First Day of Week:** Dropdown (Sunday | Monday) - affects date picker

#### About & Legal
- **Version:** Display current version (e.g., "v1.0.0")
- **Privacy Policy:** Link to privacy page
- **Terms of Service:** Link to terms page
- **Contact Support:** Email link (support@oneandone.com)

## V2 Roadmap (Future Features)

### AI Phone Call Concierge
**Problem:** Users forget to add tasks, or can't stop to type them out

**Solution:** Call a dedicated phone number and tell an AI assistant your tasks. The AI:
- Transcribes the call
- Extracts tasks from conversation
- Adds them to the correct lists
- Confirms via SMS or in-app notification

**Technical approach:**
- Twilio for phone infrastructure
- OpenAI Whisper for transcription
- GPT-4 for task extraction
- Store call metadata in `tasks.metadata` JSONB field

### ChatGPT Integration
**Problem:** Users want to brainstorm and break down complex projects

**Solution:** Chat interface where users can:
- Ask AI to break down big goals into tasks
- Get suggestions for task prioritization
- Query their task history ("What did I complete last week?")
- Natural language task creation ("Add remind mom's birthday to personal list")

**Technical approach:**
- OpenAI API integration
- Streaming responses for better UX
- Context-aware (knows user's folders, lists, tasks)
- Conversation history stored in new `ai_sessions` table

### iOS Native App
**Problem:** Users want native mobile experience with offline support

**Solution:** Swift/SwiftUI iOS app that:
- Uses same Supabase backend
- Supports offline task creation/editing
- Syncs when online
- Push notifications for due tasks
- Widget for today's tasks

**Technical approach:**
- Swift + Supabase Swift SDK
- Local Core Data cache
- Background sync
- APNs for notifications

### Additional V2+ Features
- **Folders** - Hierarchical organization (deferred until data shows users have 30+ lists and struggle with flat structure)
- **Drag-and-drop** - Add drag-drop reordering if users request manual control over sort order
- **Soft delete / Recovery** - 30-day deleted section if users report accidental deletions
- **Overdue task styling** - Red/warning colors for past-due tasks
- **Subtasks** - Break down tasks into smaller steps
- **Tags/labels** - Cross-cutting organization
- **Collaboration** - Share lists with others
- **Recurring tasks** - Daily/weekly/monthly repeats
- **Attachments** - Add files/photos to tasks
- **Calendar view** - See tasks by date
- **Themes** - Dark mode, other color schemes
- **OAuth providers** - Google, Apple sign-in
- **Email to task** - Forward emails to create tasks
- **API access** - Public API for integrations

## Success Metrics

### V1 Launch Targets (First 30 Days)
- **User Acquisition:**
  - 100 signups
  - 50 weekly active users
- **Engagement:**
  - 70% of users create at least 1 task
  - 40% return on Day 7
  - Average 10 tasks created per user
- **Technical:**
  - 99% uptime
  - < 100ms avg API response time
  - Zero critical bugs

### North Star Metric
**Weekly active tasks completed** - Measures if users are actually getting value from the app

### Leading Indicators
- Task completion rate (completed / created)
- Average session time
- Tasks per active user
- Day 7 retention

## Launch Plan

### Pre-Launch (Before V1)
1. Complete all V1 features
2. Manual testing on 3+ devices
3. Fix all critical/high bugs
4. Deploy to Vercel
5. Invite 5 beta testers
6. Iterate based on feedback

### Soft Launch
1. Share on personal networks
2. Post to Reddit (r/productivity, r/selfhosted)
3. Product Hunt launch
4. Monitor metrics daily
5. Fix bugs within 24h
6. Gather user feedback

### Post-Launch
1. Weekly metric reviews
2. User interview program (5 users/week)
3. Public roadmap based on feedback
4. Begin V2 planning when:
   - 50+ WAU achieved
   - < 5 open bugs
   - 60%+ Day 7 retention

## Constraints & Trade-offs

### V1 Scope Decisions

**What We're Building in V1:**
- Auto-sorting (newest first OR by due date)
- Hard delete with confirmation (no recovery)
- Bulk operations (multi-select, bulk delete, bulk complete)
- Filter views (All, Active, Completed)
- Protected Inbox list (cannot delete/rename)
- Password reset via email
- Two-column layout (lists | tasks)
- Responsive task editing (inline on desktop, bottom sheet on mobile)
- Theme token system (all colors in tailwind.config.js)

**What We're NOT Building in V1 (and Why):**
- **No folders** - Unnecessary for users with <20 lists; tasks are ephemeral (archived when complete) unlike notes that accumulate indefinitely. Deferred to V2 if data shows users have 30+ lists.
- **No drag-and-drop** - Auto-sorting provides 90% of functionality with 10% of implementation complexity. Manual reordering deferred to V2 based on user feedback.
- **No manual reordering UI** - Arrow buttons removed. Auto-sort handles ordering automatically.
- **No soft delete / deleted section** - Hard delete simplifies architecture. Recovery feature can be V2 if users request it.
- **No email verification** - Reduces signup friction (20-40% drop-off with verification). Deferred to V1.5 once we hit 100+ users and assess spam risk.
- **No overdue task styling** - Core sorting behavior first, visual polish (red colors) in V1.5
- **No collaboration** - Adds complexity, single-user is enough for MVP
- **No subtasks** - Can nest in description, proper UI is V2
- **No attachments** - Storage costs, not core to task management
- **No recurring tasks** - Complex to implement, can manually recreate
- **No undo/redo** - Nice-to-have, not essential
- **No keyboard shortcuts** - Power user feature, defer to V2
- **No dark mode** - Doubles UI work, orange looks better in light

### Technical Debt We're OK With
- Server Actions instead of API routes (can refactor later for iOS)
- No comprehensive test suite (manual testing for V1)
- No CI/CD pipeline (Vercel auto-deploys)
- No error tracking service like Sentry (use Vercel logs)
- Basic validation only (no real-time field validation)

### Non-Negotiables
- **Mobile must work** - 60%+ of users will be mobile
- **Data security** - RLS on all tables, no exceptions
- **Fast UI** - Optimistic updates, no loading spinners on mutations
- **No bugs in critical path** - Signup, login, create task, complete task
- **Orange theme** - Brand identity

## Open Questions

- [ ] Should we add Google OAuth for V1? (Easier signup but more complexity)
- [ ] Do we need a "Today" smart view? (All tasks due today)
- [ ] Should completed tasks auto-archive after 30 days?
- [ ] Do we want task priority levels (high/medium/low)?
- [ ] Should we allow markdown in task descriptions?

## Appendix

### Competitive Analysis
- **Todoist** - Too complex, overwhelming UI
- **Things 3** - Great design but iOS-only and paid
- **Microsoft To Do** - Good but feels corporate
- **Any.do** - Clean but limited free tier
- **Google Tasks** - Too basic, no list organization

**Our differentiator:** Minimalist design + future AI features + free + web-first

**Data Model Philosophy:**
- Build for 80% use case (users with 5-20 active lists)
- Tasks are ephemeral (completed and archived), not permanent like notes
- Let real user behavior inform V2 features (folders, tags, drag-drop)
- Hierarchy: User → Lists → Tasks (flat, simple)

### Technology Choices Justification

**Why Next.js?**
- Modern, popular, great docs
- Server Components = better performance
- Easy Vercel deployment
- Good for SEO (landing pages later)

**Why Supabase?**
- Free tier is generous
- PostgreSQL is future-proof
- Open source (no lock-in)
- Auth built-in
- Real-time if we need it later

**Why not Firebase?**
- Firestore is NoSQL (harder to query)
- Vendor lock-in concerns
- PostgreSQL better for AI features

**Why not build custom backend?**
- Time to market
- Supabase handles auth, security, scaling
- Can always migrate later

### Design Inspiration
- Apple Calculator app (minimalism)
- Linear (fast, keyboard-driven)
- Height (clean task UI)
- Superhuman (speed philosophy)
