import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/shared/sidebar"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A calm personal life dashboard.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-8 py-10">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
