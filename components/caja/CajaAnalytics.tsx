// components/caja/CajaAnalytics.tsx
'use client'

import { useState, useMemo } from 'react'
import { BarChart3, PieChart, TrendingUp, Calendar, DollarSign, AlertTriangle } from 'lucide-react'

interface RegistroCaja {
  id: string
  fecha: string
  montoInicial: number
  montoFinal: number
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  gastos: number
  cerrada: boolean
  usuario: {
    nombre: string
  }
}

interface CajaAnalyticsProps {
  historialCajas: RegistroCaja[]
}

export default function CajaAnalytics({ historialCajas }: CajaAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30')
  const [selectedMetric, setSelectedMetric] = useState('ventas')
  
  // Filtrar datos por rango de tiempo
  const filteredData = useMemo(() => {
    const days = parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return historialCajas.filter(caja => {
      const cajaDate = new Date(caja.fecha)
      return cajaDate >= cutoffDate && caja.cerrada
    })
  }, [historialCajas, timeRange])
  
  // Calcular métricas generales
  const metrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalVentas: 0,
        promedioVentasDiarias: 0,
        totalDiferencias: 0,
        porcentajeDiferencias: 0,
        ventasPorMetodo: { efectivo: 0, tarjeta: 0, transferencia: 0 },
        ventasPorUsuario: {},
        totalGastos: 0
      }
    }
    
    const totalVentas = filteredData.reduce((sum, caja) => 
      sum + caja.ventasEfectivo + caja.ventasTarjeta + caja.ventasTransferencia, 0)
    
    const totalGastos = filteredData.reduce((sum, caja) => sum + caja.gastos, 0)
    
    const ventasPorMetodo = filteredData.reduce((acc, caja) => {
      acc.efectivo += caja.ventasEfectivo
      acc.tarjeta += caja.ventasTarjeta
      acc.transferencia += caja.ventasTransferencia
      return acc
    }, { efectivo: 0, tarjeta: 0, transferencia: 0 })
    
    const diferenciasData = filteredData.map(caja => {
      const esperado = caja.montoInicial + caja.ventasEfectivo - caja.gastos
      return Math.abs(caja.montoFinal - esperado)
    })
    
    const totalDiferencias = diferenciasData.reduce((sum, diff) => sum + diff, 0)
    const cajasConDiferencias = diferenciasData.filter(diff => diff > 0.01).length
    
    const ventasPorUsuario = filteredData.reduce((acc, caja) => {
      const total = caja.ventasEfectivo + caja.ventasTarjeta + caja.ventasTransferencia
      acc[caja.usuario.nombre] = (acc[caja.usuario.nombre] || 0) + total
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalVentas,
      promedioVentasDiarias: totalVentas / Math.max(1, filteredData.length),
      totalDiferencias,
      porcentajeDiferencias: (cajasConDiferencias / filteredData.length) * 100,
      ventasPorMetodo,
      ventasPorUsuario,
      totalGastos
    }
  }, [filteredData])
  
  // Datos para gráfico de ventas diarias
  const ventasDiarias = useMemo(() => {
    const ventasPorDia = filteredData.reduce((acc, caja) => {
      const fecha = new Date(caja.fecha).toLocaleDateString('es-AR')
      const total = caja.ventasEfectivo + caja.ventasTarjeta + caja.ventasTransferencia
      acc[fecha] = (acc[fecha] || 0) + total
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(ventasPorDia)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7) // Últimos 7 días
  }, [filteredData])
  
  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <TrendingUp className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </div>
  )
  
  return (
    <div className="space-y-8">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Período de análisis
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Métrica principal
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ventas">Ventas</option>
            <option value="diferencias">Diferencias</option>
            <option value="gastos">Gastos</option>
          </select>
        </div>
      </div>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Ventas"
          value={`$${metrics.totalVentas.toLocaleString()}`}
          subtitle={`${filteredData.length} cajas`}
          icon={DollarSign}
          color="text-green-600"
        />
        <MetricCard
          title="Promedio Diario"
          value={`$${metrics.promedioVentasDiarias.toLocaleString()}`}
          subtitle="Ventas por día"
          icon={TrendingUp}
          color="text-blue-600"
        />
        <MetricCard
          title="Total Gastos"
          value={`$${metrics.totalGastos.toLocaleString()}`}
          subtitle="Egresos registrados"
          icon={BarChart3}
          color="text-orange-600"
        />
        <MetricCard
          title="Diferencias"
          value={`${metrics.porcentajeDiferencias.toFixed(1)}%`}
          subtitle={`$${metrics.totalDiferencias.toFixed(2)} total`}
          icon={AlertTriangle}
          color={metrics.porcentajeDiferencias > 5 ? "text-red-600" : "text-yellow-600"}
        />
      </div>
      
      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ventas por método de pago */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Ventas por Método de Pago
          </h3>
          <div className="space-y-4">
            {Object.entries(metrics.ventasPorMetodo).map(([metodo, valor]) => {
              const porcentaje = metrics.totalVentas > 0 ? (valor / metrics.totalVentas) * 100 : 0
              const colors = {
                efectivo: 'bg-green-500',
                tarjeta: 'bg-blue-500',
                transferencia: 'bg-purple-500'
              }
              return (
                <div key={metodo} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded ${colors[metodo as keyof typeof colors]} mr-3`}></div>
                    <span className="font-medium capitalize">{metodo}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${valor.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{porcentaje.toFixed(1)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Ventas por usuario */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Ventas por Usuario
          </h3>
          <div className="space-y-4">
            {Object.entries(metrics.ventasPorUsuario)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([usuario, ventas]) => {
                const porcentaje = metrics.totalVentas > 0 ? (ventas / metrics.totalVentas) * 100 : 0
                return (
                  <div key={usuario} className="flex items-center justify-between">
                    <span className="font-medium">{usuario}</span>
                    <div className="text-right">
                      <div className="font-semibold">${ventas.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{porcentaje.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
      
      {/* Gráfico de tendencias - Simulado */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Tendencia de Ventas (Últimos 7 días)
        </h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {ventasDiarias.map(([fecha, ventas], index) => {
            const maxVentas = Math.max(...ventasDiarias.map(([, v]) => v))
            const altura = maxVentas > 0 ? (ventas / maxVentas) * 100 : 0
            return (
              <div key={fecha} className="flex flex-col items-center flex-1">
                <div className="w-full bg-blue-100 rounded-t-sm relative group cursor-pointer">
                  <div 
                    className="bg-blue-600 rounded-t-sm transition-all duration-300 group-hover:bg-blue-700"
                    style={{ height: `${Math.max(altura, 5)}%` }}
                  ></div>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${ventas.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                  {new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Resumen estadístico */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resumen Estadístico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Ventas</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Total en período: ${metrics.totalVentas.toLocaleString()}</li>
              <li>• Promedio por caja: ${metrics.promedioVentasDiarias.toLocaleString()}</li>
              <li>• Efectivo: {((metrics.ventasPorMetodo.efectivo / metrics.totalVentas) * 100 || 0).toFixed(1)}%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Control</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Cajas procesadas: {filteredData.length}</li>
              <li>• % con diferencias: {metrics.porcentajeDiferencias.toFixed(1)}%</li>
              <li>• Total diferencias: ${metrics.totalDiferencias.toFixed(2)}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Operaciones</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Total gastos: ${metrics.totalGastos.toLocaleString()}</li>
              <li>• Usuarios activos: {Object.keys(metrics.ventasPorUsuario).length}</li>
              <li>• Promedio gastos: ${(metrics.totalGastos / Math.max(1, filteredData.length)).toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Alertas y recomendaciones */}
      {(metrics.porcentajeDiferencias > 10 || metrics.totalDiferencias > 100) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertas de Control
          </h3>
          <ul className="text-yellow-700 space-y-1">
            {metrics.porcentajeDiferencias > 10 && (
              <li>• Alto porcentaje de cajas con diferencias ({metrics.porcentajeDiferencias.toFixed(1)}%)</li>
            )}
            {metrics.totalDiferencias > 100 && (
              <li>• Diferencias acumuladas significativas (${metrics.totalDiferencias.toFixed(2)})</li>
            )}
            <li>• Recomendación: Revisar procedimientos de arqueo y capacitar al personal</li>
          </ul>
        </div>
      )}
    </div>
  )
}