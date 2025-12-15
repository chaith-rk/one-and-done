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
- **No password reset** - Deferred to V2 to ship faster

### Core Task Management

#### Folders
- Create, edit, delete folders
- Manual drag-drop reordering
- Folders appear in left sidebar

#### Task Lists
- Create, edit, delete lists within folders
- Lists can exist without folders (inbox-style)
- Manual drag-drop reordering within folders
- Lists appear in middle panel

#### Tasks
- **Required fields:** Task title
- **Optional fields:**
  - Description (multi-line text)
  - Due date (date picker)
  - Due time (time picker)
- **Actions:**
  - Create new task
  - Edit existing task
  - Delete task
  - Mark complete/incomplete (checkbox)
  - Drag-drop to reorder within list

#### Task Display
- Sort options:
  - Manual order (default)
  - Due date (earliest first)
- Completed tasks:
  - Move to bottom of list
  - Strikethrough text
  - Grayed out appearance
- Empty states with helpful prompts

### User Interface

#### Design Principles
1. **Minimalism** - No clutter, essential features only
2. **Speed** - Fast loading, instant interactions
3. **Apple-inspired** - Clean, modern, calculator-like aesthetic
4. **Orange theme** - Primary brand color: #FF9500

#### Layout
- **Desktop:** Three-column layout (folders | lists | tasks)
- **Mobile:** Single-column with navigation tabs
- **Responsive breakpoints** at 768px and 1024px

#### Visual Design
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
- **Subtasks** - Break down tasks into smaller steps
- **Tags/labels** - Cross-cutting organization
- **Collaboration** - Share lists with others
- **Recurring tasks** - Daily/weekly/monthly repeats
- **Attachments** - Add files/photos to tasks
- **Calendar view** - See tasks by date
- **Themes** - Dark mode, other color schemes
- **Password reset** - Email-based flow
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

**What we're NOT building (and why):**
- **No email verification** - Friction in onboarding, can defer
- **No password reset** - Edge case, manual support OK for V1
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
- **Google Tasks** - Too basic, no folders

**Our differentiator:** Minimalist design + future AI features + free + web-first

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
