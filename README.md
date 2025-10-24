# JobTracker - AI-Powered Job Application Manager

A modern web application to help job seekers track their applications, upload resumes, and get AI-powered insights on resume-to-job matching.

## 🚀 Features (Week 1 MVP)

- ✅ **User Authentication**: Sign up/login with email & password, Google OAuth support
- ✅ **Job Tracking**: Add, edit, delete job applications
- ✅ **Status Management**: Track applications through Applied → Interview → Offer/Rejected
- ✅ **Dashboard**: View all applications with filtering and statistics
- ✅ **Job Details**: Detailed view with notes and deadlines
- 🔜 **Resume Upload** (Phase 2): Upload and manage multiple resumes
- 🔜 **AI Matching** (Phase 3): Get match scores and AI suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: Zustand (for future features)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- npm or yarn

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd jobtracker
npm install
```

### 2. Set Up Database

Create a PostgreSQL database (locally or use a service like Supabase, Neon, or Railway).

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Generate NEXTAUTH_SECRET with:
# openssl rand -base64 32

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
jobtracker/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── jobs/            # Job CRUD endpoints
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── jobs/           # Job management
│   │   └── resumes/        # Resume management (Phase 2)
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/              # Reusable components
│   ├── Navbar.tsx
│   └── JobCard.tsx
├── lib/                     # Utilities
│   ├── prisma.ts           # Prisma client
│   └── auth.ts             # NextAuth config
├── prisma/                  # Database schema
│   └── schema.prisma
└── types/                   # TypeScript types
```

## 🗄️ Database Schema

### User

- id, email, password, name, image
- Relations: resumes[], jobs[]

### Job

- id, userId, company, position, description
- status (APPLIED, INTERVIEW, OFFER, REJECTED)
- deadline, notes, appliedDate
- matchScore (future AI feature)
- suggestions (future AI feature)

### Resume (Phase 2)

- id, userId, fileName, fileUrl, parsedText

## 🎯 Roadmap

### ✅ Week 1 - MVP Foundation (Current)

- [x] Next.js setup with TailwindCSS
- [x] Authentication (email/password + Google)
- [x] Database schema with Prisma
- [x] Job CRUD operations
- [x] Dashboard with filters
- [x] Responsive UI

### 📅 Week 2 - Resume Management

- [ ] File upload (PDF/DOCX)
- [ ] Cloud storage integration (AWS S3/Supabase)
- [ ] Resume parsing (extract text)
- [ ] Multiple resume management

### 📅 Week 3 - AI Integration

- [ ] OpenAI API integration
- [ ] Resume-to-job embeddings
- [ ] Match score calculation
- [ ] AI-powered suggestions (GPT-4)

### 📅 Week 4 - Enhanced Features

- [ ] Email reminders
- [ ] Analytics dashboard with charts
- [ ] Advanced filtering and search
- [ ] Export functionality

### 📅 Week 5 - Deployment & Polish

- [ ] Deploy to Vercel
- [ ] Production database setup
- [ ] Performance optimization
- [ ] UI/UX refinements

## 🔐 Authentication

### Email/Password

1. Users can register with email and password
2. Passwords are hashed with bcrypt
3. JWT-based sessions with NextAuth

### Google OAuth

1. Configure Google OAuth in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Add credentials to `.env` file

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (if using OAuth)
- `GOOGLE_CLIENT_SECRET` (if using OAuth)

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Jobs

- `GET /api/jobs` - Get all jobs (query: ?status=APPLIED)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get single job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

ISC

## 📚 Documentation

For detailed documentation, guides, and project information, see the [`/docs`](./docs) folder:

- [Setup Guide](./docs/SETUP.md) - Complete setup instructions
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Deploy to Vercel
- [Features Guide](./docs/FEATURES_GUIDE.md) - Complete features documentation
- [Portfolio Guide](./docs/PORTFOLIO_PRESENTATION.md) - For showcasing this project
- [Security Audit](./docs/SECURITY_AUDIT.md) - Security review report
- [View All Documentation](./docs/README.md)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Vercel for hosting solutions
- OpenAI for AI capabilities (Phase 3)
