import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "react-hot-toast"
import { Suspense } from "react"
import "./globals.css"

export const metadata = {
  title: "Infera",
  description: 'Captura el "por qué" técnico desde Slack/GitHub y publica resúmenes en Notion',
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster position="top-right" />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
