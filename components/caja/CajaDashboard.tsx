'use client'

import { useState } from 'react'
import { DollarSign, Clock, CheckCircle, AlertTriangle, Calculator, History, TrendingUp, Users } from 'lucide-react'
import CajaForm from './CajaForm'
import CajaHistorialAdmin from './CajaHistorialAdmin'
import CajaAnalytics from './CajaAnalytics'

interface CajaActual {
  id: string
  montoInicial: number
  montoFinal: number
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  gastos: number
  observaciones: string | null
  cerrada: boolean
  fecha: string
}

interface CajaDashboardProps {
  cajaActual?: CajaActual | null
  historialCajas: any[]
  estadisticas: {
    cajasAbiertasHoy: number
    ventasHoy: {
      _sum: {
        ventasEfectivo: number | null
        ventasTarjeta: number | null
        ventasTransferencia: number | null
      }
    }
    diferenciasHoy: number
  }
  userRole: string
  userId: string
  userName: string
}

export default function CajaDashboard({ 
  cajaActual = null, 
  historialCajas, 
  estadisticas, 
  userRole, 
  userId, 
  userName 
}: CajaDashboardProps) {
  const [activeTab, setActiveTab] = useState('current')
  
  const canViewHistory = userRole === 'ADMIN' || userRole === 'ENCARGADO'
  
  // Calcular totales de ventas
  const ventasHoy = {
    efectivo: estadisticas.ventasHoy._sum.ventasEfectivo || 0,
    tarjeta: estadisticas.ventasHoy._sum.ventasTarjeta || 0,
    transferencia: estadisticas.ventasHoy._sum.ventasTransferencia || 0
  }
  const totalVentasHoy = ventasHoy.efectivo + ventasHoy.tarjeta + ventasHoy.transferencia
  
  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  )
  
  const TabButton = ({ id, label, icon: Icon, isActive, onClick, disabled = false }: any) => (
    <button
      onClick={() => !disabled && onClick(id)}
      disabled={disabled}
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  )
  
  const getCajaStatus = () => {
    if (!cajaActual) {
      return {
        status: 'closed',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        text: 'Sin caja abierta',
        icon: Clock
      }
    }
    
    if (cajaActual.cerrada) {
      return {
        status: 'closed',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: 'Caja cerrada',
        icon: CheckCircle
      }
    }
    
    return {
      status: 'open',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      text: 'Caja abierta',
      icon: Clock
    }
  }
  
  const cajaStatus = getCajaStatus()
  
  return (
    <div className="space-y-8">
      {/* Estado de la caja actual */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-4 rounded-xl ${cajaStatus.bgColor} mr-4`}>
              <cajaStatus.icon className={`w-8 h-8 ${cajaStatus.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Estado de Caja Actual</h2>
              <p className={`text-lg font-medium ${cajaStatus.color}`}>{cajaStatus.text}</p>
              <p className="text-sm text-gray-500">Usuario: {userName}</p>
            </div>
          </div>
          
          {cajaActual && !cajaActual.cerrada && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Abierta desde</p>
              <p className="text-lg font-semibold">
                {new Date(cajaActual.fecha).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
        
        {/* Resumen rápido si hay caja abierta */}
        {cajaActual && !cajaActual.cerrada && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Monto Inicial</p>
              <p className="text-xl font-bold text-gray-900">
                ${cajaActual.montoInicial.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Ventas Registradas</p>
              <p className="text-xl font-bold text-green-600">
                ${(cajaActual.ventasEfectivo + cajaActual.ventasTarjeta + cajaActual.ventasTransferencia).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Efectivo Esperado</p>
              <p className="text-xl font-bold text-blue-600">
                ${(cajaActual.montoInicial + cajaActual.ventasEfectivo - cajaActual.gastos).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cajas Abiertas"
          value={estadisticas.cajasAbiertasHoy}
          icon={Clock}
          color="text-blue-600"
          subValue="Hoy"
        />
        <StatCard
          title="Total Ventas"
          value={`$${totalVentasHoy.toFixed(2)}`}
          icon={TrendingUp}
          color="text-green-600"
          subValue="Todas las formas de pago"
        />
        <StatCard
          title="Efectivo Hoy"
          value={`$${ventasHoy.efectivo.toFixed(2)}`}
          icon={DollarSign}
          color="text-emerald-600"
          subValue="Solo efectivo"
        />
        <StatCard
          title="Diferencias"
          value={estadisticas.diferenciasHoy}
          icon={AlertTriangle}
          color={estadisticas.diferenciasHoy > 0 ? "text-orange-600" : "text-gray-600"}
          subValue="Cajas con diferencias hoy"
        />
      </div>
      
      {/* Navegación por pestañas */}
      <div className="flex flex-wrap gap-4">
        <TabButton
          id="current"
          label="Caja Actual"
          icon={Calculator}
          isActive={activeTab === 'current'}
          onClick={setActiveTab}
        />
        <TabButton
          id="history"
          label="Historial"
          icon={History}
          isActive={activeTab === 'history'}
          onClick={setActiveTab}
          disabled={!canViewHistory}
        />
        <TabButton
          id="analytics"
          label="Análisis"
          icon={TrendingUp}
          isActive={activeTab === 'analytics'}
          onClick={setActiveTab}
          disabled={!canViewHistory}
        />
      </div>
      
      {/* Contenido principal según la pestaña activa */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {activeTab === 'current' && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {cajaActual ? (cajaActual.cerrada ? 'Resumen de Caja Cerrada' : 'Completar Registro de Caja') : 'Abrir Nueva Caja'}
              </h2>
              <p className="text-gray-600">
                {cajaActual 
                  ? cajaActual.cerrada 
                    ? 'Información de la caja ya cerrada'
                    : 'Complete los datos para cerrar la caja del día'
                  : 'Inicie una nueva caja con el monto inicial'
                }
              </p>
            </div>
            <CajaForm cajaActual={cajaActual} userId={userId} />
          </div>
        )}
        
        {activeTab === 'history' && canViewHistory && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Historial de Cajas</h2>
              <p className="text-gray-600">
                Registro completo de todas las cajas procesadas
              </p>
            </div>
            <CajaHistorialAdmin historialCajas={historialCajas} />
          </div>
        )}
        
        {activeTab === 'analytics' && canViewHistory && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Análisis y Reportes</h2>
              <p className="text-gray-600">
                Estadísticas detalladas y tendencias de ventas
              </p>
            </div>
            <CajaAnalytics historialCajas={historialCajas} />
          </div>
        )}
      </div>
      
      {/* Información adicional */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Consejos para el Arqueo de Caja
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Verifique que el efectivo coincida antes de cerrar la caja</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Documente cualquier diferencia en las observaciones</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Registre todos los gastos realizados durante el día</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Una vez cerrada, la caja no puede modificarse</span>
          </div>
        </div>
      </div>
    </div>
  )
}