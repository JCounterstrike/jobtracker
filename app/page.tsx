import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">JobTracker</h1>
          <p className="text-2xl text-gray-700 mb-4">
            AI-Powered Job Application Manager
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your job applications, upload resumes, and get AI-powered
            insights on how well your resume matches each job posting. Improve
            your chances of landing interviews with tailored suggestions.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Get Started
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
              <p className="text-gray-600">
                Keep all your job applications organized in one place with
                status tracking and deadlines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Resume Matching</h3>
              <p className="text-gray-600">
                Get instant match scores and AI-powered suggestions to tailor
                your resume.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Multiple Resumes</h3>
              <p className="text-gray-600">
                Store multiple resume versions and let AI suggest the best fit
                for each job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
