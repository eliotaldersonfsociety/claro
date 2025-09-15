import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: 'Rifa Los 4 Fantásticos',
  description: 'Rifa de los 4 Fantásticos de la Rifa anivel mundial.',
  icons: {
    icon: "/boleto.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* 🔑 Aquí envolvemos todo con AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}
