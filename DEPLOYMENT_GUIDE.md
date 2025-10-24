# JobTracker - Deployment Guide for Vercel

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup

Before deploying, ensure you have all required environment variables documented:

**Required Variables:**

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For migrations

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

# OAuth (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# OpenAI (Optional - for AI features)
OPENAI_API_KEY="sk-..."
```

---

## 📦 Vercel Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure `.gitignore` is correct:**

```gitignore
# Already in your .gitignore
node_modules/
.env
.env.local
.next/
.vercel/
```

2. **Commit all changes:**

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

1. Add **ALL** environment variables from your `.env` file
2. Set for **Production**, **Preview**, and **Development** environments
3. **Important**: Update `NEXTAUTH_URL` to your Vercel domain

**Example:**

```
NEXTAUTH_URL = https://jobtracker-yourname.vercel.app
```

### Step 4: Build Settings (Usually Auto-Detected)

Vercel should automatically use:

- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. Visit your deployed site!

---

## 🔧 Post-Deployment Configuration

### 1. Update Google OAuth Redirect URIs

In Google Cloud Console:

1. Go to Credentials → Your OAuth 2.0 Client
2. Add authorized redirect URIs:

```
https://jobtracker-yourname.vercel.app/api/auth/callback/google
```

### 2. Update Supabase CORS (if needed)

In Supabase Dashboard → Settings → API:

- Add your Vercel domain to allowed origins if you encounter CORS issues

### 3. Test All Features

- ✅ User registration/login
- ✅ Google OAuth sign-in
- ✅ Job CRUD operations
- ✅ Resume upload
- ✅ Analytics dashboard
- ✅ Calendar view
- ✅ Dark mode toggle
- ✅ Export functionality
- ✅ AI features (if API key provided)

---

## 🎨 Portfolio Presentation Tips

### 1. Create a Landing Page

Consider adding a public landing page at `/` (currently redirects to dashboard):

**Create:** `app/page.tsx` (replace existing)

```typescript
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">JobTracker</h1>
          <p className="text-xl text-gray-700 mb-8">AI-Powered Job Application Management System</p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Get Started
            </Link>
            <Link href="/demo" className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
              View Demo
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Track success rates and application trends</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">Get resume-job match scores and suggestions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">Calendar View</h3>
              <p className="text-gray-600">Visualize deadlines and application timeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2. Add Portfolio-Specific Metadata

Update `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "JobTracker - AI-Powered Job Application Manager | [Your Name]",
  description: "Full-stack job application tracking system built with Next.js 15, TypeScript, Prisma, OpenAI, and Supabase. Features AI resume matching, analytics dashboard, and calendar view.",
  keywords: ["Next.js", "TypeScript", "Prisma", "OpenAI", "Job Tracker", "Portfolio Project"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "JobTracker - AI Job Application Manager",
    description: "AI-powered job application tracking with resume matching and analytics",
    type: "website",
  },
}
```

### 3. Add README Badges

Update `README.md` with deployment info:

```markdown
# JobTracker 🚀

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://jobtracker-yourname.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)

[Live Demo](https://jobtracker-yourname.vercel.app) | [Documentation](#)
```

### 4. Create a Demo Account (Optional)

For portfolio visitors who want to try without signing up:

- Create a demo user account
- Add prominent "Demo Login" button
- Pre-populate with sample data

---

## 🔒 Security Considerations

### 1. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variable encryption
- ✅ Rotate secrets regularly

### 2. Rate Limiting (Recommended)

Consider adding rate limiting for API routes:

```bash
npm install @upstash/ratelimit @upstash/redis
```

### 3. CORS Headers

Already configured in Next.js, but verify for production

### 4. Database Connection Pooling

Supabase handles this, but be aware of connection limits

---

## 📊 Monitoring & Analytics

### 1. Vercel Analytics (Recommended)

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react"

// In your layout
;<body>
  {children}
  <Analytics />
</body>
```

### 2. Error Tracking (Optional)

- Sentry for error tracking
- LogRocket for session replay
- Vercel built-in logs

---

## 🎯 Portfolio Showcase Tips

### What to Highlight:

1. **Tech Stack:**

   - Next.js 15 (App Router, Server Actions)
   - TypeScript
   - Prisma ORM with PostgreSQL
   - NextAuth.js for authentication
   - OpenAI API integration
   - Supabase Storage
   - TailwindCSS with dark mode
   - Recharts for data visualization

2. **Key Features:**

   - Full-stack authentication (credentials + OAuth)
   - AI-powered resume matching
   - Real-time analytics dashboard
   - Calendar/timeline view
   - Bulk operations & selective export
   - Dark mode with persistence
   - Responsive design

3. **Architecture Decisions:**

   - Server-side rendering for SEO
   - Client-side interactivity with React
   - Secure API routes
   - Vector embeddings for semantic search
   - File upload handling

4. **Code Quality:**
   - TypeScript for type safety
   - Modular component structure
   - Reusable utility functions
   - Error handling
   - Loading states

---

## 📸 Screenshots for Portfolio

Capture screenshots of:

1. Dashboard (light & dark mode)
2. Analytics page with charts
3. Calendar view
4. Job detail page with AI matching
5. Mobile responsive views

Store in `/public/portfolio/` directory

---

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Production**: `main` branch pushes
- **Preview**: Pull request deployments
- **Development**: Optional branch deployments

To trigger redeployment:

```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 🐛 Common Issues & Solutions

### Issue: Build fails on Vercel

**Solution:** Check environment variables are set correctly

### Issue: Database connection errors

**Solution:** Verify `DATABASE_URL` and `DIRECT_URL` are correct for Supabase

### Issue: OAuth redirect errors

**Solution:** Update Google OAuth settings with Vercel URL

### Issue: File uploads not working

**Solution:** Verify Supabase keys and bucket permissions

### Issue: AI features not working

**Solution:** Ensure `OPENAI_API_KEY` is set and valid

---

## 📝 Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Settings → Domains → Add Domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs

---

## 💰 Cost Considerations

**Vercel Free Tier:**

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments

**Supabase Free Tier:**

- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users

**OpenAI:**

- Pay-per-use (optional feature)
- ~$0.0001 per embedding
- ~$0.002 per 1K tokens (GPT-4o-mini)

---

## 🎓 For Your Portfolio Site

### Project Card Template:

```markdown
### JobTracker - AI Job Application Manager

**Tech Stack:** Next.js 15, TypeScript, Prisma, OpenAI, Supabase

A full-stack application for tracking job applications with AI-powered resume matching,
analytics dashboard, and calendar view. Features include OAuth authentication,
bulk operations, dark mode, and data export.

**Key Achievements:**

- Implemented AI resume-job matching using OpenAI embeddings
- Built real-time analytics with Recharts data visualization
- Developed comprehensive CRUD operations with Prisma ORM
- Integrated OAuth 2.0 authentication with NextAuth.js
- Designed responsive UI with Tailwind CSS dark mode

[Live Demo](https://jobtracker.vercel.app) | [GitHub](https://github.com/yourusername/jobtracker)
```

---

## ✅ Final Checklist Before Going Live

- [ ] All environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] Database migrations run
- [ ] All features tested in production
- [ ] Error pages created (404, 500)
- [ ] Loading states implemented
- [ ] Mobile responsiveness verified
- [ ] Dark mode works correctly
- [ ] SEO metadata configured
- [ ] README updated with live link
- [ ] Portfolio page created
- [ ] Screenshots captured
- [ ] Analytics installed (optional)

---

## 🚀 You're Ready to Deploy!

Your JobTracker application is production-ready and will make an excellent portfolio piece. The combination of modern tech stack, AI integration, and polished UX will definitely impress potential employers!

**Questions?** Check Vercel docs or the troubleshooting section above.

