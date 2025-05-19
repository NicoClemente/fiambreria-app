// components/Navbar.tsx - Navbar mejorada
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { 
  Home, Package, DollarSign, BarChart3, User, LogOut, Menu, X, 
  ChevronDown, Bell, Settings 
} from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const navigation = [
    { 
      name: 'Inicio', 
      href: '/', 
      icon: Home,
      color: 'text-blue-600'
    },
    { 
      name: 'Stock', 
      href: '/stock', 
      icon: Package,
      color: 'text-green-600'
    },
    { 
      name: 'Caja', 
      href: '/caja', 
      icon: DollarSign,
      color: 'text-emerald-600'
    },
  ]

  const adminNavigation = [
    { 
      name: 'Panel Admin', 
      href: '/admin', 
      icon: BarChart3,
      color: 'text-purple-600'
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  if (!session) return null

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador'
      case 'ENCARGADO':
        return 'Encargado'
      case 'EMPLEADO':
        return 'Empleado'
      default:
        return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ENCARGADO':
        return 'bg-yellow-100 text-yellow-800'
      case 'EMPLEADO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Fiambrería App
                </span>
                <div className="text-xs text-gray-500">Sistema de gestión</div>
              </div>
            </Link>
          </div>

          {/* Enlaces de navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? `bg-blue-50 ${item.color} shadow-sm`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${active ? item.color : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
            
            {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') &&
              adminNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? `bg-purple-50 ${item.color} shadow-sm`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${active ? item.color : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
          </div>

          {/* Usuario y menú */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones (placeholder) */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Perfil del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">
                      {getUserInitials(session.user.name || 'U')}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(session.user.role || '')}`}>
                      {getRoleDisplayName(session.user.role || '')}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown del perfil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                    <div className="text-sm text-gray-500">{session.user.email}</div>
                    <div className={`inline-flex items-center mt-1 text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(session.user.role || '')}`}>
                      {getRoleDisplayName(session.user.role || '')}
                    </div>
                  </div>
                  
                  <Link
                    href="/perfil"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Mi Perfil
                  </Link>
                  
                  <Link
                    href="/configuracion"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    Configuración
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      active
                        ? `bg-blue-50 ${item.color} shadow-sm`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? item.color : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
              
              {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') &&
                adminNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        active
                          ? `bg-purple-50 ${item.color} shadow-sm`
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${active ? item.color : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  )
                })}
            </div>
            
            {/* Información del usuario en móvil */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center px-4 py-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-base font-bold text-white">
                    {getUserInitials(session.user.name || 'U')}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">{session.user.name}</div>
                  <div className="text-sm text-gray-500">{session.user.email}</div>
                  <div className={`inline-flex items-center mt-1 text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(session.user.role || '')}`}>
                    {getRoleDisplayName(session.user.role || '')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 mt-3">
                <Link
                  href="/perfil"
                  className="flex items-center px-4 py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  Mi Perfil
                </Link>
                
                <Link
                  href="/configuracion"
                  className="flex items-center px-4 py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-400" />
                  Configuración
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-base text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3 text-red-500" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar el menú de perfil */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  )
}