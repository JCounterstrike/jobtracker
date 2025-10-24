# ⚡ Quick Start: Deploy to Vercel

## 5-Minute Deployment Guide

### Step 1: Prepare Environment Variables (2 min)

Create a text file with all these values ready to paste into Vercel:

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_URL=https://your-project.vercel.app  # Update after deployment
NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
OPENAI_API_KEY=sk-your-key  # Optional
```

### Step 2: Push to GitHub (1 min)

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy to Vercel (2 min)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add all environment variables
5. Click "Deploy"

### Step 4: Post-Deployment (2 min)

1. Copy your Vercel URL: `https://jobtracker-yourname.vercel.app`
2. Update `NEXTAUTH_URL` in Vercel environment variables
3. Go to Google Cloud Console → Add Vercel URL to OAuth redirect URIs:
   ```
   https://jobtracker-yourname.vercel.app/api/auth/callback/google
   ```
4. Redeploy project in Vercel

### ✅ Done!

Your app is now live and ready for your portfolio!

---

## Common Issues

**Build fails?**

- Check all environment variables are set
- Verify DATABASE_URL is correct

**OAuth not working?**

- Update Google redirect URIs
- Verify NEXTAUTH_URL matches deployment URL

**Database errors?**

- Confirm pgvector extension is enabled
- Check connection string format

---

## For Your Portfolio

Add this to your README:

```markdown
🚀 **[Live Demo](https://jobtracker-yourname.vercel.app)**
```

And this section:

```markdown
## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **AI:** OpenAI API (GPT-4o-mini, text-embedding-3-small)
- **Auth:** NextAuth.js (OAuth + Credentials)
- **Storage:** Supabase Storage
- **Deployment:** Vercel
```

---

## Interview Ready

**When asked about deployment:**

- "Deployed on Vercel with automatic CI/CD from GitHub"
- "Configured environment variables securely"
- "Integrated OAuth with proper redirect URIs"
- "Monitored with Vercel Analytics"

---

Need more details? See `DEPLOYMENT_GUIDE.md`

