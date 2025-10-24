# Week 3: AI Integration - Setup & Testing Guide

## ✅ What's Been Implemented

Week 3 AI integration is now **fully implemented**! Here's what's new:

### 🎯 New Features

1. **OpenAI Integration** (`lib/openai.ts`)

   - Embedding generation using `text-embedding-3-small` (1536 dimensions)
   - Cosine similarity calculation for resume-job matching
   - GPT-4o-mini powered tailoring suggestions

2. **Enhanced Database Schema**

   - Added `vector(1536)` columns to Resume and Job models
   - Stores embeddings for semantic similarity search

3. **New API Endpoints**

   - `POST /api/jobs/[id]/match` - Calculate match score between job and resume
   - `POST /api/jobs/[id]/suggestions` - Generate AI tailoring suggestions

4. **Enhanced UI**
   - Interactive AI matching interface on job detail pages
   - Resume selector with one-click match calculation
   - Visual match score display with color-coded progress bars
   - AI-generated suggestions panel

---

## 🚀 Setup Instructions

### Step 1: Enable pgvector Extension in Supabase

**IMPORTANT**: You must do this before pushing the schema!

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

5. Verify it worked:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

You should see a row with the vector extension.

### Step 2: Add OpenAI API Key to `.env`

Add your OpenAI API key to the `.env` file:

```bash
# Add this line to your .env file
OPENAI_API_KEY="sk-proj-your-key-here"
```

**How to get an API key:**

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file

### Step 3: Push Database Schema Changes

Now that pgvector is enabled, push the schema:

```bash
npx prisma db push
```

You should see:

```
✔ Generated Prisma Client
The database is now in sync with your Prisma schema.
```

### Step 4: Regenerate Prisma Client

```bash
npx prisma generate
```

### Step 5: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🧪 Testing Guide

### End-to-End Test Flow

#### 1. **Upload a Resume**

1. Go to **Dashboard** → **Resumes** (or visit `/dashboard/resumes`)
2. Drag and drop a PDF or DOCX resume
3. Wait for upload to complete
4. ✅ **Verify**: Resume appears in the list with text extracted
5. 🔍 **Behind the scenes**:
   - Text is extracted from the file
   - OpenAI generates an embedding
   - Embedding is stored in the database

#### 2. **Create a Job Application**

1. Go to **Dashboard** → **Add New Job**
2. Fill in the job details:
   - **Company**: e.g., "Google"
   - **Position**: e.g., "Senior Software Engineer"
   - **Job Description**: Paste a real job description (important for matching!)
   - **Status**: Applied
3. Click **Add Job Application**
4. ✅ **Verify**: Job appears in the dashboard

#### 3. **Calculate Match Score**

1. Click on the job you just created
2. In the **🤖 AI Resume Matching** section:
   - Select your resume from the dropdown
   - Click **"Calculate Match"**
3. Wait a few seconds (OpenAI API calls)
4. ✅ **Verify**: You should see:
   - Match score percentage (0-100%)
   - Color-coded progress bar (green/yellow/orange)
   - Feedback message about the match quality

**What's happening:**

- Job description is converted to an embedding (if not already done)
- Cosine similarity is calculated between job and resume embeddings
- Score is saved to the database

#### 4. **Generate AI Suggestions**

1. After calculating the match, click **"✨ Get AI Tailoring Suggestions"**
2. Wait ~5-10 seconds (GPT-4o-mini generation)
3. ✅ **Verify**: You should see:
   - A list of 3-5 specific, actionable suggestions
   - Keywords to add
   - Skills to emphasize
   - Experience to highlight

---

## 📊 Expected Results

### High Match Score (80%+)

- Green progress bar
- Message: "🎉 Excellent match! Your resume aligns well with this job."
- Suggestions will focus on minor optimizations

### Medium Match Score (60-79%)

- Yellow progress bar
- Message: "👍 Good match, but there's room for improvement."
- Suggestions will highlight areas to strengthen

### Low Match Score (<60%)

- Orange progress bar
- Message: "💡 Consider tailoring your resume for this position."
- Suggestions will recommend significant changes

---

## 🐛 Troubleshooting

### Error: "type 'vector' does not exist"

- **Fix**: Enable pgvector in Supabase (see Step 1)

### Error: "Failed to generate embedding"

- **Check**: Is your `OPENAI_API_KEY` in `.env` correct?
- **Check**: Do you have credits in your OpenAI account?
- **Test**: Run this in Node.js console:
  ```bash
  node -e "console.log(process.env.OPENAI_API_KEY)"
  ```

### Error: "Resume embedding not available"

- **Fix**: Re-upload the resume (old resumes don't have embeddings)
- **Or**: The resume text extraction failed - try a different format

### Match score seems wrong

- **Note**: Embeddings capture semantic meaning, not exact keyword matches
- If resume is very generic, it may score lower
- Try uploading a more detailed, tailored resume

### Suggestions are generic

- **Check**: Did you provide a detailed job description?
- The more specific the job description, the better the suggestions
- Try adding job requirements, tech stack, and responsibilities

---

## 💰 OpenAI API Costs

Approximate costs per operation:

- **Embedding Generation** (text-embedding-3-small): ~$0.00002 per 1K tokens
  - Average resume: ~1000 tokens = $0.00002
  - Average job: ~500 tokens = $0.00001
- **Suggestions** (GPT-4o-mini): ~$0.00015 per 1K input tokens, ~$0.0006 per 1K output tokens
  - Per suggestion generation: ~$0.001-0.002

**Total per job application with match + suggestions**: ~$0.002-0.003 (less than a penny!)

---

## 🔍 Verifying It Works

### Check Database (Supabase SQL Editor)

**Check if embeddings are being stored:**

```sql
SELECT
  id,
  "fileName",
  LENGTH("parsedText") as text_length,
  embedding IS NOT NULL as has_embedding
FROM "Resume"
ORDER BY "createdAt" DESC;
```

Expected: `has_embedding` should be `true` for newly uploaded resumes.

**Check job match scores:**

```sql
SELECT
  company,
  position,
  "matchScore",
  embedding IS NOT NULL as has_embedding,
  suggestions IS NOT NULL as has_suggestions
FROM "Job"
WHERE "matchScore" IS NOT NULL
ORDER BY "updatedAt" DESC;
```

---

## 🎉 Next Steps

Once everything is working, you can:

1. **Test with multiple resumes**

   - Upload different versions of your resume
   - See which one scores highest for different jobs

2. **Improve matching**

   - Consider adding more context to job descriptions
   - Use the suggestions to tailor your resumes

3. **Week 4 Features** (future)
   - Auto-match resumes to all jobs
   - Dashboard analytics showing match trends
   - Resume comparison tool
   - Email notifications for good matches

---

## 📝 Architecture Notes

### How Matching Works

1. **Text → Embeddings**: Both resume and job descriptions are converted to 1536-dimensional vectors
2. **Cosine Similarity**: Measures the angle between the two vectors (0 = opposite, 1 = identical)
3. **Score**: Similarity is converted to a 0-100% match score
4. **Storage**: Embeddings are cached in the database (no need to regenerate)

### Why pgvector?

- Uses your existing PostgreSQL database (no extra services)
- Efficient vector operations
- Can scale to thousands of resumes/jobs
- Free (included with Supabase)

### Why text-embedding-3-small?

- 1536 dimensions (same as ada-002)
- 5x cheaper than ada-002
- 80% of the performance
- Perfect for resume matching

---

## ✅ Completion Checklist

Before considering Week 3 complete:

- [ ] pgvector extension enabled in Supabase
- [ ] OpenAI API key added to `.env`
- [ ] Schema pushed to database successfully
- [ ] Can upload resume and see it in database with embedding
- [ ] Can create job application
- [ ] Can calculate match score and see percentage
- [ ] Match score updates in real-time
- [ ] Can generate AI suggestions
- [ ] Suggestions are specific and actionable
- [ ] No console errors in browser or terminal

---

**Congratulations!** 🎉 Week 3 is complete! You now have a fully functional AI-powered job tracker with semantic matching and intelligent suggestions.
