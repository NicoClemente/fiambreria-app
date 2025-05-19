// components/Navbar.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!session) return null

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                Fiambrería App
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/stock" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              📦 Stock
            </Link>
            <Link 
              href="/caja" 
              className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              💰 Caja
            </Link>
            {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Usuario y menú */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              <Link 
                href="/stock" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-white"
                onClick={() => setIsMenuOpen(false)}
              >
                📦 Stock
              </Link>
              <Link 
                href="/caja" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-white"
                onClick={() => setIsMenuOpen(false)}
              >
                💰 Caja
              </Link>
              {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
                <Link 
                  href="/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}