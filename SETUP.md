# JobTracker Setup Guide

Follow these steps to get your JobTracker application up and running.

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Your Database

You have several options for PostgreSQL:

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL locally, then create a database
createdb jobtracker
```

#### Option B: Supabase (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Copy the "Connection string" from Settings → Database

#### Option C: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

#### Option D: Railway

1. Go to [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.local.example .env
```

Edit `.env` and add your values:

```env
# Required: Database connection
DATABASE_URL="postgresql://postgres:[cdnxp3yOIKqtyqXA]@db.hlzhumofaubyjengenhl.supabase.co:5432/postgres"

# Required: NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="n6qhnoknhv6yxjrnfnpdvvkio"

# Optional: Google OAuth (can skip for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

#### Generate NEXTAUTH_SECRET

**On Mac/Linux:**

```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**

```powershell
# Generate a random string
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Or just use a random string generator online:**

- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## Google OAuth Setup (Optional)

If you want to enable "Sign in with Google":

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 2. Add to .env

```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### 3. Restart the dev server

```bash
npm run dev
```

---

## Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 to view and edit your data.

### Reset Database (careful!)

```bash
npx prisma db push --force-reset
```

### View Database Schema

```bash
npx prisma db pull
```

---

## Troubleshooting

### "Error: P1001: Can't reach database server"

**Solution:** Check your DATABASE_URL is correct

- Ensure PostgreSQL is running (if local)
- Verify connection string format
- Check firewall/network settings

### "Error: Invalid `prisma.user.create()` invocation"

**Solution:** Run `npx prisma generate` to regenerate the Prisma Client

### "NextAuth: NEXTAUTH_SECRET not set"

**Solution:** Make sure `.env` file exists and contains NEXTAUTH_SECRET

### Google OAuth not working

**Solution:**

1. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
2. Verify redirect URI matches exactly in Google Cloud Console
3. Make sure the OAuth consent screen is configured

### Port 3000 already in use

**Solution:**

```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or run on a different port:

```bash
PORT=3001 npm run dev
```

---

## Next Steps

Once your app is running:

1. **Create an account** at http://localhost:3000/register
2. **Add your first job** application
3. **Explore the dashboard** and test all features

### Future Features to Implement (Weeks 2-5)

- Week 2: Resume upload functionality
- Week 3: AI-powered resume matching
- Week 4: Analytics and reminders
- Week 5: Deploy to production

---

## Production Deployment

See the main [README.md](./README.md) for deployment instructions.

Quick deploy with Vercel:

```bash
npm install -g vercel
vercel
```

Remember to set all environment variables in your hosting platform!

---

## Need Help?

- Check the [README.md](./README.md) for more details
- Review the API endpoints documentation
- Examine the code structure in the project

Happy job tracking! 🚀
