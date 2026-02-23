# RE FIT - Deployment Guide

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

---

## Deployment to Vercel

### Option 1: Vercel Postgres (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/re-fit.git
   git push -u origin main
   ```

2. **Create a Vercel account** at [vercel.com](https://vercel.com)

3. **Create a new project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Add Database" → "Create Vercel Postgres"
   - Name it `re-fit-db`
   - Click "Connect"

4. **Configure environment variables:**
   Vercel will auto-populate `POSTGRES_URL`. Update your `.env` to use it:
   
   In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL")
   }
   ```

5. **Generate NEXTAUTH_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Add it to Vercel environment variables as `NEXTAUTH_SECRET`

6. **Update NEXTAUTH_URL:**
   Add your production URL to Vercel environment variables:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

7. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - After deployment, run database migrations in Vercel:
     ```bash
     vercel link
     vercel env pull
     npx prisma generate
     npx prisma db push
     ```

---

### Option 2: Supabase PostgreSQL (Free Alternative)

1. **Create a Supabase account** at [supabase.com](https://supabase.com)

2. **Create a new project:**
   - Go to [supabase.com/new-project](https://supabase.com/new-project)
   - Choose a region close to you
   - Get your connection string from Settings → Database

3. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Add environment variables to Vercel:**
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   NEXTAUTH_SECRET=[GENERATED-SECRET]
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

5. **Deploy to Vercel** (same as Option 1)

---

### Option 3: Neon PostgreSQL (Serverless)

1. **Create a Neon account** at [neon.tech](https://neon.tech)

2. **Create a new project:**
   - Free tier includes 500MB storage
   - Get your connection string from the dashboard

3. **Follow the same steps as Option 2**

---

## Environment Variables

### Local Development (`.env.local`)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://..."  # From Vercel Postgres/Supabase/Neon
NEXTAUTH_SECRET="generated-secret-key-min-32-chars"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Post-Deployment Checklist

- [ ] Database is connected and migrations are applied
- [ ] `NEXTAUTH_SECRET` is set (min 32 characters)
- [ ] `NEXTAUTH_URL` matches your production domain
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Test onboarding flow saves to database
- [ ] Test dashboard loads user data
- [ ] Test favorites are saved/loaded correctly

---

## Troubleshooting

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Ensure database is accessible from Vercel (allow all IPs for Supabase)

### "NEXTAUTH_SECRET is required"
Generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Invalid callback URL"
Make sure `NEXTAUTH_URL` matches your actual domain exactly.

---

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)

2. Create a new project

3. Enable Google+ API

4. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

5. Add to Vercel environment variables:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

6. Update `src/lib/auth.ts` to add Google provider.

---

## Database Schema

The app uses the following tables:
- `User` - Authentication & user accounts
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification
- `Biometrics` - User health data
- `Favorite` - Saved recipes
- `WeightEntry` - Weight tracking history

---

## Support

For issues or questions:
- Check NextAuth.js docs: [next-auth.js.org](https://next-auth.js.org)
- Check Prisma docs: [prisma.io/docs](https://prisma.io/docs)
- Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)
