'use client'

import Link from 'next/link'
import { SessionProvider, useSession } from 'next-auth/react'
import LoginButton from '@/components/LoginButton'
import { Package, DollarSign, TrendingUp, AlertTriangle, Users, BarChart3 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalProducts: number
  lowStockProducts: number
  todaySales: number
  openCashRegister: boolean
  monthlyRevenue: number
}

function HomePage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (session) {
      fetchDashboardStats()
    }
  }, [session])
  
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Cargando sistema...</p>
        </div>
      </div>
    )
  }
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Package className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Fiambrería App
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Sistema de gestión integral para tu negocio
              </p>
              <LoginButton />
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Funcionalidades</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Control de Stock
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    Arqueo de Caja
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                    Reportes
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-orange-600" />
                    Multi-usuario
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '¡Buenos días'
    if (hour < 18) return '¡Buenas tardes'
    return '¡Buenas noches'
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header de bienvenida */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {session.user.name}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Gestiona tu fiambrería de manera eficiente
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-sm opacity-90">Rol actual</div>
                <div className="text-lg font-semibold">
                  {session.user.role === 'ADMIN' ? 'Administrador' : 
                   session.user.role === 'ENCARGADO' ? 'Encargado' : 'Empleado'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ventas Hoy</p>
                  <p className="text-2xl font-bold text-green-600">${stats.todaySales.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estado Caja</p>
                  <p className={`text-lg font-semibold ${stats.openCashRegister ? 'text-green-600' : 'text-gray-500'}`}>
                    {stats.openCashRegister ? 'Abierta' : 'Cerrada'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stats.openCashRegister ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <TrendingUp className={`w-6 h-6 ${stats.openCashRegister ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Módulos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Stock */}
          <Link href="/stock" className="group">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-8 border border-gray-100 h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Gestión de Stock
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Control completo de inventario, movimientos de stock, alertas de bajo stock y reportes detallados.
                </p>
                <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg inline-flex items-center font-medium group-hover:bg-blue-100 transition-colors">
                  Administrar Stock
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Caja */}
          <Link href="/caja" className="group">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-8 border border-gray-100 h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Arqueo de Caja
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Registro de ventas, control de efectivo, arqueos diarios y seguimiento financiero completo.
                </p>
                <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg inline-flex items-center font-medium group-hover:bg-green-100 transition-colors">
                  Gestionar Caja
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin (solo para admin y encargados) */}
          {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
            <Link href="/admin" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-8 border border-gray-100 h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Panel de Control
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Reportes avanzados, gestión de usuarios, configuración del sistema y análisis de rendimiento.
                  </p>
                  <div className="bg-purple-50 text-purple-700 px-6 py-3 rounded-lg inline-flex items-center font-medium group-hover:bg-purple-100 transition-colors">
                    Panel Admin
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            🚀 Accesos Rápidos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/stock?action=add" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</div>
              <div className="font-medium">Agregar Producto</div>
            </Link>
            
            <Link 
              href="/stock?action=movement" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
              <div className="font-medium">Movimiento Stock</div>
            </Link>
            
            <Link 
              href="/caja?action=new" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</div>
              <div className="font-medium">Abrir Caja</div>
            </Link>
            
            <Link 
              href="/reportes" 
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <div className="font-medium">Ver Reportes</div>
            </Link>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Información de la Sesión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-600">Usuario</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {session.user.name || 'N/A'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {session.user.email || 'N/A'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-600">Rol</label>
              <span className={`inline-flex px-4 py-2 mt-1 rounded-full text-sm font-medium ${
                session.user.role === 'ADMIN' 
                  ? 'bg-red-100 text-red-800' 
                  : session.user.role === 'ENCARGADO'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {session.user.role === 'ADMIN' ? 'Administrador' : 
                 session.user.role === 'ENCARGADO' ? 'Encargado' : 'Empleado'}
              </span>
            </div>
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