import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "JobTracker - AI-Powered Job Application Manager",
  description: "Track your job applications and get AI-powered resume matching suggestions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
