# Authentication Implementation

This app now includes session validation with Supabase Auth and Next.js App Router with i18n support.

## Features Implemented

### 1. Session Validation Middleware

- Located in `src/middleware.ts`
- Validates user sessions on every request
- Redirects unauthenticated users from protected routes to `/[locale]`
- Redirects authenticated users from auth routes to `/[locale]/home`
- Preserves i18n routing functionality

### 2. Authentication Utilities

- `lib/supabase/auth.ts` - Server-side auth utilities
  - `getUser()` - Get current user
  - `requireAuth()` - Require authentication (redirects if not logged in)
  - `requireNoAuth()` - Require no authentication (redirects if logged in)
  - `getSession()` - Get current session

### 3. Client-Side Authentication

- `src/providers/auth-provider.tsx` - React context for auth state
- `src/components/auth-guard.tsx` - Loading component during auth check
- Integrated with app providers in `src/app/providers.tsx`

### 4. Protected Routes

- Dashboard layout (`src/app/[locale]/(dashboard)/layout.tsx`) requires authentication
- Auth routes (`src/app/[locale]/(auth)/layout.tsx`) redirect authenticated users

### 5. Login Implementation

- Updated login form to use Supabase authentication
- Changed username field to email field
- Proper error handling and success feedback

### 6. Sign Out Functionality

- Added to user profile component
- Uses `useAuth` hook for client-side sign out

## Route Protection

### Protected Routes (require authentication):

- `/[locale]/home`
- `/[locale]/tasks`
- `/[locale]/vehicles`
- Any route under the dashboard group

### Auth Routes (redirect if authenticated):

- `/[locale]/login`
- `/[locale]/signup`
- `/[locale]` (root)

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How It Works

1. **Middleware**: Checks every request, validates session, and handles redirects
2. **Server Components**: Use `requireAuth()` or `requireNoAuth()` for server-side validation
3. **Client Components**: Use `useAuth()` hook to access user state and auth methods
4. **Forms**: Use Supabase client for authentication actions

The implementation ensures that:

- Unauthenticated users cannot access dashboard routes
- Authenticated users are automatically redirected to the dashboard
- All routes maintain proper i18n functionality
- Loading states are handled gracefully during auth checks
