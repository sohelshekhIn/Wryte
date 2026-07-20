import type { Metadata } from "next"
import { Poppins, Lora, JetBrains_Mono } from "next/font/google"

import { AuthProvider } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

const lora = Lora({
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Wryte",
  description: "A quiet place to write your book",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        poppins.variable,
        lora.variable,
        jetbrainsMono.variable,
        "h-full antialiased",
      )}
    >
      <body className="h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
