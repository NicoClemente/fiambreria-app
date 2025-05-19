import './globals.css'
import Navbar from '@/components/Navbar'
import { SessionProvider } from 'next-auth/react'

export const metadata = {
  title: 'Fiambrería App',
  description: 'Sistema de gestión para fiambrería',
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </SessionProvider>
      </body>
    </html>
  )
}