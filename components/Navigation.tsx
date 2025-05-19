// components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X, Home, Package, DollarSign, Settings, LogOut, User } from 'lucide-react'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Stock', href: '/stock', icon: Package },
    { name: 'Caja', href: '/caja', icon: DollarSign },
  ]
  
  // Menú de administrador (solo visible para admin)
  const adminNavigation = [
    { name: 'Administración', href: '/admin', icon: Settings },
  ]
  
  const isActive = (path: string) => pathname === path
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }
  
  if (!session) {
    return null // No mostrar navegación si no hay sesión
  }
  
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">Fiambrería App</span>
            </div>
            
            {/* Navegación desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                    >
                      <Icon className="mr-1.5 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
                
                {session.user.role === 'ADMIN' &&
                  adminNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive(item.href)
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                      >
                        <Icon className="mr-1.5 h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
              </div>
            </div>
          </div>
          
          {/* Perfil de usuario */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <button className="max-w-xs bg-gray-700 flex items-center text-sm rounded-full text-white focus:outline-none">
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </button>
                  <div className="ml-2">
                    <div className="text-sm font-medium text-white">{session.user.name}</div>
                    <div className="text-xs text-gray-300">
                      {session.user.role === 'ADMIN' 
                        ? 'Administrador' 
                        : session.user.role === 'ENCARGADO' 
                          ? 'Encargado' 
                          : 'Empleado'}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-3 text-gray-300 hover:text-white flex items-center text-sm focus:outline-none"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-1">Salir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                  onClick={toggleMobileMenu}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            
            {session.user.role === 'ADMIN' &&
              adminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                    onClick={toggleMobileMenu}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{session.user.name}</div>
                <div className="text-sm text-gray-400">{session.user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}