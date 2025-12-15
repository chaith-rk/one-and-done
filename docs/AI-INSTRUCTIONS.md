# AI Assistant Instructions for One and Done

This document provides guidance for AI coding assistants (Claude, Cursor, GitHub Copilot, etc.) working on the One and Done task management application.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Coding Conventions](#coding-conventions)
5. [Common Development Tasks](#common-development-tasks)
6. [Database Schema](#database-schema)
7. [Adding New Features](#adding-new-features)
8. [Troubleshooting](#troubleshooting)

## Project Overview

**One and Done** is a minimalist task management web app with an orange theme inspired by Apple's Calculator app. It's built to be simple, fast, and future-ready for AI features.

**Current Version:** V1 (MVP)
**Framework:** Next.js 15 with App Router + TypeScript
**Database:** Supabase (PostgreSQL + Auth)
**Hosting:** Vercel

### Design Principles
1. **Minimalism first** - Don't add features not explicitly requested
2. **Speed matters** - Use optimistic updates, avoid loading states
3. **Orange theme** - Primary color: #FF9500
4. **Apple-inspired aesthetics** - Clean, modern, simple

## Project Structure

```
/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth route group (login, signup)
│   │   ├── (dashboard)/         # Main app route group
│   │   ├── api/                 # API routes (future webhooks)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing/redirect page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── auth/                # Auth forms
│   │   ├── folders/             # Folder components
│   │   ├── lists/               # List components
│   │   └── tasks/               # Task components
│   ├── lib/
│   │   ├── supabase/            # Supabase clients
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   └── middleware.ts    # Auth middleware
│   │   ├── actions/             # Server Actions
│   │   │   ├── auth.ts
│   │   │   ├── folders.ts
│   │   │   ├── lists.ts
│   │   │   └── tasks.ts
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── database.types.ts    # Auto-generated from Supabase
├── supabase/
│   └── migrations/              # Database migrations
├── docs/
│   ├── PRD.md                   # Product requirements
│   └── AI-INSTRUCTIONS.md       # This file
├── public/                      # Static assets
├── .env.local                   # Environment variables (git-ignored)
├── .env.local.example           # Example env file
└── README.md                    # Developer quickstart
```

## Tech Stack

### Core Dependencies
- **next** (15.x) - React framework
- **react** (19.x) - UI library
- **typescript** (5.x) - Type safety
- **@supabase/ssr** - Supabase auth for Next.js
- **@supabase/supabase-js** - Supabase client

### UI & Styling
- **tailwindcss** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **@dnd-kit/core** - Drag and drop
- **lucide-react** - Icons

### Validation & Forms
- **zod** - Runtime type validation
- **react-hook-form** (optional) - Form management

### Development
- **eslint** - Linting
- **prettier** (optional) - Code formatting

## Coding Conventions

### TypeScript
- **Always use TypeScript** - No `.js` or `.jsx` files
- **Strict mode enabled** - Fix all type errors
- **Use auto-generated types** - Import from `@/types/database.types.ts`
- **Avoid `any`** - Use `unknown` and narrow types

### React Components
- **Use functional components** - No class components
- **Server Components by default** - Only add `'use client'` when needed
- **One component per file** - Exception: small helper components
- **PascalCase for components** - e.g., `TaskItem.tsx`
- **Props interface naming** - e.g., `TaskItemProps`

```typescript
// Good
interface TaskItemProps {
  task: Task
  onComplete: (id: string) => void
}

export default function TaskItem({ task, onComplete }: TaskItemProps) {
  // ...
}
```

### File Naming
- **Components:** `PascalCase.tsx` (e.g., `TaskList.tsx`)
- **Utilities:** `camelCase.ts` (e.g., `formatDate.ts`)
- **Server Actions:** `camelCase.ts` (e.g., `tasks.ts`)
- **Hooks:** `use + PascalCase.ts` (e.g., `useTasks.ts`)

### Styling
- **Use Tailwind utilities** - Avoid custom CSS unless necessary
- **Orange theme variables** - Use theme colors from config
- **Mobile-first responsive** - Use `sm:`, `md:`, `lg:` breakpoints
- **Consistent spacing** - Use Tailwind's spacing scale (4, 8, 16, etc.)

```typescript
// Good - Tailwind utilities
<button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
  Click me
</button>

// Avoid - Inline styles
<button style={{ backgroundColor: '#FF9500' }}>
  Click me
</button>
```

### Database Access
- **Use Server Actions** - No direct DB calls from client components
- **Row Level Security** - All queries automatically filtered by user
- **Optimistic updates** - Update UI immediately, sync in background
- **Error handling** - Always handle Supabase errors gracefully

```typescript
// Good - Server Action
'use server'

export async function createTask(data: CreateTaskInput) {
  const supabase = await createClient()
  const { data: task, error } = await supabase
    .from('tasks')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return task
}
```

## Common Development Tasks

### Adding a New Component

1. **Choose the right location:**
   - Auth-related → `src/components/auth/`
   - Folder-related → `src/components/folders/`
   - List-related → `src/components/lists/`
   - Task-related → `src/components/tasks/`
   - Reusable UI → `src/components/ui/`

2. **Create the component file:**
   ```typescript
   // src/components/tasks/TaskItem.tsx
   import { Task } from '@/types/database.types'

   interface TaskItemProps {
     task: Task
   }

   export default function TaskItem({ task }: TaskItemProps) {
     return (
       <div className="p-4 border rounded">
         <h3>{task.title}</h3>
       </div>
     )
   }
   ```

3. **Import and use:**
   ```typescript
   import TaskItem from '@/components/tasks/TaskItem'
   ```

### Adding a Server Action

1. **Create/edit action file:**
   ```typescript
   // src/lib/actions/tasks.ts
   'use server'

   import { createClient } from '@/lib/supabase/server'
   import { revalidatePath } from 'next/cache'

   export async function updateTask(id: string, updates: Partial<Task>) {
     const supabase = await createClient()

     const { error } = await supabase
       .from('tasks')
       .update(updates)
       .eq('id', id)

     if (error) throw error

     revalidatePath('/') // Refresh the page data
   }
   ```

2. **Use in component:**
   ```typescript
   'use client'

   import { updateTask } from '@/lib/actions/tasks'

   export default function TaskItem({ task }: TaskItemProps) {
     async function handleComplete() {
       await updateTask(task.id, { completed: true })
     }

     return <button onClick={handleComplete}>Complete</button>
   }
   ```

### Adding a Database Migration

1. **Create migration file:**
   ```sql
   -- supabase/migrations/002_add_task_priority.sql

   ALTER TABLE tasks ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high'));
   ```

2. **Run migration locally:**
   ```bash
   supabase db reset
   ```

3. **Update TypeScript types:**
   ```bash
   npm run types:generate
   ```

### Adding a New Route

1. **Create route folder:**
   ```
   src/app/(dashboard)/settings/
   └── page.tsx
   ```

2. **Create page component:**
   ```typescript
   // src/app/(dashboard)/settings/page.tsx
   export default function SettingsPage() {
     return <div>Settings</div>
   }
   ```

3. **Add navigation link** (in layout or nav component)

## Database Schema

### Tables

#### `user_profiles`
Extended user information beyond Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users (unique) |
| name | text | User's display name |
| phone | text | Phone number (nullable, for V2) |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

#### `folders`
Top-level organization containers.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| name | text | Folder name |
| position | integer | Manual sort order |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

#### `lists`
Task lists within folders (or standalone).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| folder_id | uuid | Foreign key to folders (nullable) |
| name | text | List name |
| position | integer | Manual sort order within folder |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

#### `tasks`
Individual tasks within lists.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| list_id | uuid | Foreign key to lists |
| title | text | Task title (required) |
| description | text | Task description (nullable) |
| due_date | date | Due date (nullable) |
| due_time | time | Due time (nullable) |
| completed | boolean | Completion status (default: false) |
| position | integer | Manual sort order |
| completed_at | timestamp | When completed (nullable) |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |
| metadata | jsonb | AI-related data (nullable, for V2) |

### Relationships
```
auth.users (Supabase)
    ↓
user_profiles (1:1)
    ↓
folders (1:many)
    ↓
lists (1:many, optional folder)
    ↓
tasks (1:many)
```

### Row Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only SELECT their own data
- Users can only INSERT data with their user_id
- Users can only UPDATE their own data
- Users can only DELETE their own data

**Example RLS policy:**
```sql
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM lists WHERE lists.id = tasks.list_id));
```

## Adding New Features

### Feature Development Checklist

When adding a new feature, follow this process:

1. **Understand the requirement**
   - Read the PRD.md to see if it's planned
   - Check if it fits the minimalist philosophy
   - Consider mobile implications

2. **Plan the implementation**
   - Database changes needed?
   - New components or modify existing?
   - Server Actions required?
   - UI/UX considerations?

3. **Database first (if needed)**
   - Create migration file
   - Run migration locally
   - Regenerate TypeScript types
   - Update database.types.ts imports

4. **Backend next**
   - Create/update Server Actions
   - Add Zod validation schemas
   - Handle errors gracefully
   - Add revalidatePath calls

5. **Frontend last**
   - Create/update components
   - Add 'use client' only when needed
   - Implement optimistic updates
   - Style with Tailwind + orange theme
   - Test on mobile

6. **Testing**
   - Manual test happy path
   - Test error cases
   - Test on mobile device
   - Test in production build

### Future AI Integration Points

The codebase is designed to support AI features in V2. Here's how to extend it:

#### Phone Call Feature
- Store call transcripts in `tasks.metadata` JSONB
- Use `user_profiles.phone` for Twilio integration
- Create webhook endpoints in `src/app/api/webhooks/`
- Add `ai_sessions` table to track conversations

#### ChatGPT Integration
- Create `src/components/ai/ChatInterface.tsx`
- Add Server Actions in `src/lib/actions/ai.ts`
- Store conversation history in new `ai_sessions` table
- Use `tasks.metadata` for AI-generated suggestions

#### Example metadata structure:
```json
{
  "ai_generated": true,
  "source": "phone_call",
  "call_id": "uuid",
  "transcript": "Remind me to call mom tomorrow at 3pm",
  "confidence": 0.95
}
```

## Troubleshooting

### Common Issues

#### "Failed to fetch" errors
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is not paused
- Check browser console for CORS errors

#### RLS policy blocks queries
- Ensure user is authenticated
- Check `auth.uid()` matches expected user_id
- Verify RLS policies in Supabase dashboard

#### TypeScript errors after DB changes
- Run `npm run types:generate`
- Restart TypeScript server in IDE
- Check migration was applied successfully

#### Drag-and-drop not working
- Ensure `@dnd-kit/core` is installed
- Check parent has `'use client'` directive
- Verify position fields are integers

#### Optimistic updates not showing
- Check `revalidatePath` is called in Server Action
- Verify component is not over-fetching
- Use React DevTools to inspect state

### Debug Checklist

When something breaks:

1. **Check browser console** - Look for JS errors
2. **Check network tab** - Look for failed API calls
3. **Check Supabase logs** - Look for DB errors
4. **Check server logs** - `npm run dev` output
5. **Verify environment variables** - `.env.local` correct?
6. **Clear Next.js cache** - Delete `.next` folder and rebuild
7. **Check authentication** - User logged in?
8. **Inspect RLS policies** - Blocking the query?

### Getting Help

1. **Check this file first** - Most common tasks documented
2. **Check PRD.md** - Understand what features should exist
3. **Check README.md** - Setup and running issues
4. **Check Supabase docs** - https://supabase.com/docs
5. **Check Next.js docs** - https://nextjs.org/docs
6. **Check shadcn/ui docs** - https://ui.shadcn.com

## Best Practices

### Performance
- Use Server Components by default
- Minimize 'use client' boundaries
- Implement optimistic updates for mutations
- Use Next.js Image component for images
- Lazy load heavy components

### Security
- Never expose SUPABASE_SERVICE_ROLE_KEY to client
- Always use RLS policies
- Validate all inputs with Zod
- Sanitize user-generated content
- Use HTTPS only (enforced by Vercel)

### Accessibility
- Use semantic HTML
- Include proper ARIA labels
- Support keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

### Mobile
- Test all features on mobile
- Use touch-friendly tap targets (min 44x44px)
- Avoid hover-only interactions
- Test on real devices when possible
- Use responsive Tailwind classes

## Code Review Checklist

Before committing code, verify:

- [ ] TypeScript compiles with no errors
- [ ] No console errors in browser
- [ ] Follows file naming conventions
- [ ] Uses Tailwind for styling (orange theme)
- [ ] Works on mobile
- [ ] Optimistic updates implemented (if mutation)
- [ ] Error states handled
- [ ] Server Actions include revalidatePath
- [ ] No sensitive data in client components
- [ ] Accessible (keyboard, screen reader)

## Resources

- **PRD:** See `docs/PRD.md` for product vision and roadmap
- **README:** See `README.md` for setup instructions
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **shadcn/ui Components:** https://ui.shadcn.com
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Next.js Docs:** https://nextjs.org/docs
