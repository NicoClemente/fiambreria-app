// app/page.tsx (diseño mejorado)
'use client'

import Link from 'next/link'
import { SessionProvider, useSession } from 'next-auth/react'
import LoginButton from '@/components/LoginButton'

function HomePage() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Fiambrería App
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sistema de gestión integral
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado de bienvenida */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido, {session.user.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            ¿Qué deseas gestionar hoy?
          </p>
        </div>

        {/* Tarjetas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Stock */}
          <Link href="/stock" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-3xl">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Gestión de Stock
                </h2>
                <p className="text-gray-600 mb-6">
                  Administra inventario, añade productos y controla el stock en tiempo real.
                </p>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg inline-flex items-center font-medium">
                  Ir a Stock
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Caja */}
          <Link href="/caja" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-3xl">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Registro de Caja
                </h2>
                <p className="text-gray-600 mb-6">
                  Gestiona ventas diarias, registra ingresos y controla el flujo de efectivo.
                </p>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-flex items-center font-medium">
                  Ir a Caja
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin (solo para admin y encargados) */}
          {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
            <Link href="/admin" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-6 border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Panel de Admin
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Reportes detallados, gestión de usuarios y configuración del sistema.
                  </p>
                  <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg inline-flex items-center font-medium">
                    Ir a Admin
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Información del usuario */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Información de la Sesión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600">Usuario</label>
              <p className="text-lg font-semibold text-gray-900">
                {session.user.name || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg font-semibold text-gray-900">
                {session.user.email || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600">Rol</label>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                session.user.role === 'ADMIN' 
                  ? 'bg-red-100 text-red-800' 
                  : session.user.role === 'ENCARGADO'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {session.user.role || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            🚀 Accesos Rápidos
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/stock?action=add" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm border transition-colors inline-flex items-center"
            >
              ➕ Agregar Producto
            </Link>
            <Link 
              href="/stock?action=movement" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm border transition-colors inline-flex items-center"
            >
              📝 Registrar Movimiento
            </Link>
            <Link 
              href="/caja?action=new" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm border transition-colors inline-flex items-center"
            >
              💵 Nueva Caja
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Envolver con SessionProvider
export default function Home() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  )
}