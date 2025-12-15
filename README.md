# One and Done

A minimalist task management web application with an orange theme inspired by Apple's Calculator app. Built for speed, simplicity, and future AI integration.

![Orange Theme](https://img.shields.io/badge/theme-orange-FF9500)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## Features

- **Organize with Folders & Lists** - Hierarchical task organization
- **Simple Task Management** - Create, edit, complete, and delete tasks
- **Drag & Drop** - Reorder tasks and lists intuitively
- **Due Dates & Times** - Optional scheduling for tasks
- **Clean UI** - Minimalist orange-themed interface
- **Mobile Responsive** - Works beautifully on any device
- **Secure** - Row-level security ensures your data is private

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** Supabase (PostgreSQL + Auth)
- **UI:** shadcn/ui + Tailwind CSS
- **Drag & Drop:** @dnd-kit/core
- **Validation:** Zod
- **Hosting:** Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Vercel account (optional, for deployment)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd one-and-done
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your project URL and anon key
4. Run the database migration:
   - Go to **SQL Editor** in Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL
   - Verify tables are created under **Table Editor**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Where to find these values:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API → Project API keys → anon/public
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → Project API keys → service_role (keep secret!)

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Account

1. Navigate to `/signup`
2. Enter email and password
3. Sign up (no email verification required)
4. Start creating tasks!

## Project Structure

```
one-and-done/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Main application
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── auth/          # Auth forms
│   │   ├── folders/       # Folder components
│   │   ├── lists/         # List components
│   │   └── tasks/         # Task components
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase/     # Supabase clients
│   │   ├── actions/      # Server Actions
│   │   └── hooks/        # Custom React hooks
│   └── types/            # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
├── docs/
│   ├── PRD.md           # Product Requirements
│   └── AI-INSTRUCTIONS.md # Development guide
└── public/              # Static assets
```

## Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate TypeScript types from Supabase
npm run types:generate
```

### Adding shadcn/ui Components

This project uses shadcn/ui for accessible, customizable components:

```bash
# Add a new component
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Components will be added to `src/components/ui/`.

### Database Migrations

To modify the database schema:

1. Create a new migration file in `supabase/migrations/`
2. Write your SQL (ALTER TABLE, CREATE INDEX, etc.)
3. Apply migration in Supabase Dashboard → SQL Editor
4. Regenerate TypeScript types: `npm run types:generate`

### Generating TypeScript Types

After any database schema changes:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate types
supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - Your app will be live at `your-app.vercel.app`

### Environment Variables in Production

Make sure all environment variables are set in your hosting platform:

| Variable | Description | Where to Use |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Server only |

**Security Note:** Never commit `.env.local` to version control. The service role key has admin privileges.

## Usage Guide

### Creating Your First Task

1. **Sign up or log in** to your account
2. **Create a folder** (optional) - Click "New Folder" in the sidebar
3. **Create a list** - Click "New List" in the middle panel
4. **Add a task** - Click "New Task" button
5. **Fill in task details:**
   - Title (required)
   - Description (optional)
   - Due date (optional)
   - Due time (optional)
6. **Click Save**

### Managing Tasks

- **Complete a task:** Click the checkbox next to the task
- **Edit a task:** Click on the task to open details
- **Delete a task:** Click the delete icon in task details
- **Reorder tasks:** Drag and drop tasks in the list
- **Sort by due date:** Use the sort dropdown

### Organizing with Folders & Lists

- **Folders** contain multiple lists
- **Lists** contain multiple tasks
- Tasks are always in a list
- Lists can exist without a folder (inbox-style)
- Drag to reorder folders and lists

## Troubleshooting

### "Failed to fetch" or Connection Errors

**Problem:** App can't connect to Supabase

**Solutions:**
1. Check `.env.local` has correct values
2. Verify Supabase project is active (not paused)
3. Check Supabase dashboard for service outages
4. Clear browser cache and reload

### Can't Sign Up or Log In

**Problem:** Authentication not working

**Solutions:**
1. Check Supabase Auth is enabled (Dashboard → Authentication)
2. Verify email/password provider is enabled
3. Check browser console for errors
4. Try a different email address
5. Ensure RLS policies are set correctly

### Tasks Not Saving

**Problem:** Tasks disappear after creation

**Solutions:**
1. Check browser console for errors
2. Verify database RLS policies in Supabase dashboard
3. Ensure user is authenticated
4. Check Supabase logs for query errors
5. Verify `list_id` exists and belongs to user

### TypeScript Errors After DB Changes

**Problem:** TypeScript complains about missing fields

**Solutions:**
1. Run `npm run types:generate` to regenerate types
2. Restart TypeScript server in your IDE
3. Delete `.next` folder and rebuild
4. Verify migration was applied in Supabase

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
1. Run `npm run lint` to check for issues
2. Fix all TypeScript errors (`npm run type-check`)
3. Clear `.next` folder: `rm -rf .next`
4. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
5. Check all environment variables are set

### Mobile Issues

**Problem:** App doesn't work well on mobile

**Solutions:**
1. Clear mobile browser cache
2. Test in both portrait and landscape
3. Check responsive breakpoints in Tailwind
4. Verify touch targets are 44x44px minimum
5. Test on real device, not just emulator

## Contributing

This is a personal project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow the conventions in `docs/AI-INSTRUCTIONS.md`
- Use TypeScript strictly (no `any` types)
- Style with Tailwind CSS (orange theme)
- Test on mobile before submitting
- Keep it minimal - don't add unnecessary features

## Documentation

- **[PRD.md](docs/PRD.md)** - Product vision, features, and roadmap
- **[AI-INSTRUCTIONS.md](docs/AI-INSTRUCTIONS.md)** - Detailed development guide for AI assistants

## Roadmap

### V1 (Current)
- [x] User authentication
- [x] Folder/list/task CRUD
- [x] Drag & drop reordering
- [x] Due dates and times
- [x] Task completion
- [x] Mobile responsive
- [x] Orange minimalist UI

### V2 (Planned)
- [ ] AI phone call concierge
- [ ] ChatGPT integration
- [ ] iOS native app
- [ ] Subtasks
- [ ] Recurring tasks
- [ ] Collaboration features
- [ ] Dark mode
- [ ] Password reset
- [ ] OAuth providers (Google, Apple)

See `docs/PRD.md` for detailed V2 features.

## Tech Stack Details

### Why Next.js?
- Server Components for better performance
- Built-in API routes
- Easy Vercel deployment
- Great developer experience

### Why Supabase?
- Free tier is generous
- PostgreSQL (reliable, powerful)
- Auth built-in
- Row Level Security
- Open source (no vendor lock-in)
- Real-time capabilities for future features

### Why shadcn/ui?
- Accessible by default
- Fully customizable
- Copy-paste components (no npm bloat)
- Works with Tailwind
- Modern and clean design

## Performance

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

Optimizations:
- Server Components by default
- Optimistic UI updates
- Minimal 'use client' boundaries
- Next.js Image optimization
- Edge runtime where possible

## Security

- Row Level Security (RLS) on all tables
- Supabase Auth handles password hashing
- HTTPS enforced by Vercel
- Service role key never exposed to client
- Input validation with Zod
- No third-party analytics (privacy-first)

## License

This project is private and not licensed for public use.

## Support

For issues or questions:
1. Check `docs/AI-INSTRUCTIONS.md` for development help
2. Check this README for setup issues
3. Open an issue on GitHub
4. Contact the maintainer

## Acknowledgments

- Design inspiration: Apple Calculator app
- UI components: [shadcn/ui](https://ui.shadcn.com)
- Icons: [Lucide](https://lucide.dev)
- Database & Auth: [Supabase](https://supabase.com)
- Hosting: [Vercel](https://vercel.com)

---

Built with ☕ and an unhealthy obsession with minimalism.
