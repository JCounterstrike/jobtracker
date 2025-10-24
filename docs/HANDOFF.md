# JobTracker - Project Handoff Document

**Date**: October 2, 2025  
**Status**: Week 2 Complete, Ready for Week 3 (AI Integration)

---

## 📋 Project Overview

**JobTracker** is a web application for managing job applications with AI-powered resume matching and suggestions.

### Core Features (Planned)

1. ✅ User authentication (email/password + Google OAuth)
2. ✅ Job application tracking with dashboard
3. ✅ Resume upload & management (PDF/DOCX)
4. 🔄 AI-powered resume-to-job matching (Week 3)
5. 🔄 GPT-powered resume tailoring suggestions (Week 3)
6. 🔄 Advanced analytics & insights (Week 4)

---

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui patterns (custom implementation)
- **State Management**: React hooks (no global state library yet)
- **File Upload**: react-dropzone

### Backend

- **API**: Next.js API Routes
- **Authentication**: NextAuth.js v4 (Credentials + Google OAuth)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **File Storage**: Supabase Storage (with service role key)

### AI/ML (Week 3 - Not Yet Implemented)

- **Embeddings**: OpenAI Embeddings API
- **Vector DB**: Pinecone or pgvector
- **LLM**: GPT-4/3.5 for suggestions

### Deployment

- **Hosting**: Local dev (planned: Vercel)
- **Database**: Supabase (PostgreSQL serverless)

---

## ✅ Completed Features

### Week 1: MVP - Authentication & Job Tracking

- ✅ User registration (email + bcrypt password hashing)
- ✅ Login with NextAuth (Credentials + Google OAuth)
- ✅ Protected dashboard routes
- ✅ CRUD operations for job applications
- ✅ Job filtering by status (Applied, Interviewing, Offer, Rejected)
- ✅ Dashboard with job statistics

### Week 2: Resume Upload & Management

- ✅ Drag-and-drop resume upload (PDF/DOCX)
- ✅ Text extraction from resumes (pdf-parse, mammoth)
- ✅ Supabase Storage integration
- ✅ Resume listing with metadata
- ✅ Resume deletion (storage + database)
- ✅ File validation and error handling

---

## 📁 Key Files & Structure

```
jobtracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts         # User registration
│   │   ├── jobs/
│   │   │   ├── route.ts                  # GET all jobs, POST new job
│   │   │   └── [id]/route.ts             # GET/PUT/DELETE single job
│   │   └── resumes/
│   │       ├── route.ts                  # GET all resumes for user
│   │       ├── upload/route.ts           # POST upload resume (with text parsing)
│   │       └── [id]/route.ts             # DELETE resume
│   ├── dashboard/
│   │   ├── layout.tsx                    # Protected dashboard layout
│   │   ├── page.tsx                      # Dashboard home (job list + stats)
│   │   ├── jobs/
│   │   │   ├── new/page.tsx              # Add new job form
│   │   │   └── [id]/page.tsx             # Edit job details
│   │   └── resumes/
│   │       └── page.tsx                  # Resume management UI
│   ├── login/page.tsx                    # Login page
│   ├── register/page.tsx                 # Registration page
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout with Providers
│   ├── globals.css                       # TailwindCSS styles
│   └── providers.tsx                     # SessionProvider wrapper
├── components/
│   ├── Navbar.tsx                        # Navigation with auth state
│   ├── JobCard.tsx                       # Job display component
│   └── ResumeUpload.tsx                  # Drag-drop upload component
├── lib/
│   ├── prisma.ts                         # Prisma client (singleton)
│   ├── auth.ts                           # NextAuth configuration
│   ├── supabase.ts                       # Client-side Supabase (anon key)
│   └── supabase-server.ts                # Server-side Supabase (service role)
├── types/
│   └── next-auth.d.ts                    # NextAuth type extensions
├── prisma/
│   └── schema.prisma                     # Database schema
├── .env                                  # Environment variables (not in git)
├── package.json                          # Dependencies
└── next.config.ts                        # Next.js config
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?   // bcrypt hashed (null for OAuth users)
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  jobs          Job[]
  resumes       Resume[]
}

model Job {
  id           String    @id @default(cuid())
  userId       String
  company      String
  position     String
  description  String?   @db.Text
  status       JobStatus @default(APPLIED)
  deadline     DateTime?
  appliedDate  DateTime?
  notes        String?   @db.Text
  matchScore   Float?    // AI match score (0-100)
  suggestions  String?   @db.Text // AI-generated suggestions
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum JobStatus {
  APPLIED
  INTERVIEWING
  OFFER
  REJECTED
}

model Resume {
  id         String   @id @default(cuid())
  userId     String
  fileName   String
  fileUrl    String   // Supabase Storage URL
  parsedText String   @db.Text // Extracted text content
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```bash
# Database (Supabase PostgreSQL - Session Pooler)
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # IMPORTANT: This bypasses RLS

# AI (Week 3 - Not yet configured)
OPENAI_API_KEY="sk-..."  # For embeddings and GPT
PINECONE_API_KEY="..."   # If using Pinecone for vectors
PINECONE_ENVIRONMENT="..."
PINECONE_INDEX_NAME="jobtracker-resumes"
```

### Key Notes on Environment Variables:

1. **DATABASE_URL**: Use Supabase **Session Pooler** (not Direct Connection) for IPv4 compatibility
2. **SUPABASE_SERVICE_ROLE_KEY**: Critical for file uploads (see authentication section below)
3. **NEXTAUTH_SECRET**: Must be set for production

---

## 🔑 Authentication Architecture

### Important Design Decision: NextAuth + Prisma (Not Supabase Auth)

We use **NextAuth.js with our own Prisma User model** instead of Supabase Auth. This means:

#### ✅ What We Have:

- Custom user management in PostgreSQL via Prisma
- Flexible authentication (Credentials + Google OAuth)
- JWT sessions managed by NextAuth
- User IDs stored in `session.user.id`

#### ⚠️ Critical Implication for Supabase Storage:

- Supabase Storage RLS policies expect Supabase Auth users
- We don't have Supabase Auth users (we have Prisma users)
- **Solution**: Use `SUPABASE_SERVICE_ROLE_KEY` in server-side code to bypass RLS

#### Implementation:

```typescript
// lib/supabase-server.ts - Used for file operations
import { createClient } from "@supabase/supabase-js"

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Bypasses RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
```

**Security**: This is safe because we validate authentication via NextAuth **before** any Supabase operations.

---

## 🚨 Known Issues & Gotchas

### 1. PDF/DOCX Parsing in Next.js

**Problem**: `pdf-parse` and `mammoth` have Node.js dependencies that cause bundling issues.

**Solution**: Use dynamic imports in API routes:

```typescript
// ✅ Correct (in app/api/resumes/upload/route.ts)
const pdf = (await import("pdf-parse")).default
const pdfData = await pdf(buffer)

// ❌ Wrong (causes ENOENT errors)
import pdf from "pdf-parse" // Don't do this!
```

### 2. Next.js 15 Async Params

**Warning**: You may see warnings about `params.id` needing to be awaited. This is a Next.js 15 requirement but doesn't break functionality. Can be fixed later with:

```typescript
const { id } = await params // Next.js 15 style
```

### 3. Supabase RLS with Custom Auth

- Don't create RLS policies that check `auth.uid()` - they won't work
- Use service role key for server-side operations
- Client-side Supabase client (anon key) is only for public reads if needed

### 4. File Upload Path Structure

Files are stored as: `{userId}/{timestamp}-{filename}`

- Ensures unique file names
- Easy to filter by user
- Proper for cleanup when deleting users

---

## 📡 Current API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/signin` - NextAuth handles this
- `GET /api/auth/session` - Get current session

### Jobs

- `GET /api/jobs` - Get all jobs for current user
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get single job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Resumes

- `GET /api/resumes` - Get all resumes for current user
- `POST /api/resumes/upload` - Upload resume (returns parsed text)
- `DELETE /api/resumes/[id]` - Delete resume (storage + database)

---

## 🎯 Week 3 Plan: AI-Powered Matching

### Objectives

1. Generate embeddings for resumes and job descriptions
2. Store embeddings in vector database
3. Calculate similarity scores (cosine similarity)
4. Generate AI suggestions for resume tailoring

### Implementation Steps

#### Step 1: Set Up OpenAI Integration

```typescript
// lib/openai.ts (to be created)
import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate embeddings
export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // Or text-embedding-ada-002
    input: text,
  })
  return response.data[0].embedding
}
```

#### Step 2: Vector Storage Decision

**Option A: Pinecone** (Managed vector DB)

- Pros: Easy setup, fast, scalable
- Cons: Additional service, costs money
- Setup: Create index, store embeddings with metadata

**Option B: pgvector** (PostgreSQL extension)

- Pros: Same database, no extra service, free
- Cons: Requires Supabase pgvector extension, slightly more complex queries
- Setup: Enable extension in Supabase, add vector columns to Prisma schema

**Recommendation**: Start with **pgvector** (simpler architecture, already have Supabase)

#### Step 3: Update Database Schema

```prisma
model Resume {
  id         String   @id @default(cuid())
  userId     String
  fileName   String
  fileUrl    String
  parsedText String   @db.Text
  embedding  Unsupported("vector(1536)")?  // pgvector - 1536 for ada-002
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Job {
  // ... existing fields ...
  embedding    Unsupported("vector(1536)")?  // pgvector
  matchScore   Float?
  suggestions  String?   @db.Text

  // ... rest of model ...
}
```

#### Step 4: Matching Workflow

1. User uploads resume → extract text → generate embedding → store in DB
2. User pastes job description → generate embedding
3. Calculate cosine similarity between resume and job embeddings
4. Display match score (0-100%)
5. Generate suggestions via GPT-4 if score < 80%

#### Step 5: New API Routes Needed

- `POST /api/embeddings/generate` - Generate embedding for text
- `POST /api/jobs/[id]/match` - Calculate match score with resume
- `POST /api/jobs/[id]/suggestions` - Get AI suggestions for tailoring

### AI Prompts (for GPT-4 Suggestions)

```typescript
const suggestionPrompt = `
You are a professional resume advisor. Given a job description and a resume, 
provide specific, actionable suggestions to tailor the resume for this position.

Job Description:
${jobDescription}

Resume:
${resumeText}

Match Score: ${matchScore}%

Provide 3-5 specific suggestions focusing on:
1. Keywords to add
2. Skills to emphasize
3. Experience to highlight
4. Sections to expand

Be concise and actionable.
`
```

---

## 📦 Required Dependencies for Week 3

Install these packages:

```bash
npm install openai
npm install @pinecone-database/pinecone  # If using Pinecone
npm install pgvector                      # If using pgvector
```

---

## 🧪 Testing Recommendations

### Week 3 Testing Checklist:

1. Test embedding generation with sample resume text
2. Verify vector storage (check Supabase or Pinecone dashboard)
3. Test similarity calculation with known similar/dissimilar texts
4. Validate match scores are in 0-100 range
5. Test GPT suggestions generation
6. Performance test: embedding generation speed
7. Error handling: OpenAI API failures, rate limits

---

## 🚀 Deployment Notes (For Later)

### Vercel Deployment Checklist:

- [ ] Add all environment variables in Vercel dashboard
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Enable Google OAuth redirect URIs for production
- [ ] Configure Supabase RLS policies if needed
- [ ] Test file uploads in production (ensure service role key works)
- [ ] Set up proper CORS for Supabase Storage if needed

---

## 💡 Architectural Decisions Log

### 1. Why NextAuth instead of Supabase Auth?

- More flexible (multiple providers easily)
- Full control over user model
- Better integration with Prisma
- No vendor lock-in

### 2. Why Supabase Storage instead of AWS S3?

- Easier setup (same platform as DB)
- Built-in PostgreSQL integration
- Good free tier
- Service role key pattern works well

### 3. Why Prisma instead of raw SQL?

- Type safety
- Easy migrations
- Better DX with autocompletion
- Clean schema definitions

### 4. Why Next.js App Router?

- Modern React patterns
- Server components for better performance
- Built-in API routes
- Excellent for full-stack TypeScript

---

## 📚 Important Documentation Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [pgvector](https://github.com/pgvector/pgvector)
- [Pinecone](https://docs.pinecone.io/)

---

## 🎓 What the Next Developer Should Know

1. **The app works end-to-end** - Auth, job tracking, and resume uploads are fully functional
2. **All fixes are in place** - RLS issues solved, dynamic imports working, database connected
3. **Architecture is solid** - Ready to add AI features without major refactoring
4. **Week 3 is mostly net-new code** - You'll be adding AI features, not debugging existing ones
5. **Service role key is critical** - Don't try to use RLS policies with NextAuth users

### Quick Start Commands:

```bash
npm install                  # Install dependencies
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema to DB (if schema changed)
npm run dev                  # Start dev server
```

---

## ✨ Final Notes

This project is in a **clean, working state**. Week 1 and Week 2 are complete with all major issues resolved. The codebase is ready for Week 3's AI integration.

The main challenge for Week 3 will be:

1. Setting up OpenAI API integration
2. Choosing and configuring vector storage (recommend pgvector)
3. Implementing the embedding generation pipeline
4. Building the matching algorithm
5. Creating the GPT suggestions feature

Good luck with Week 3! The foundation is solid. 🚀
