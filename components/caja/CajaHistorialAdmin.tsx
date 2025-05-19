'use client'

import { useState } from 'react'

interface RegistroCaja {
  id: string
  fecha: string
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  gastos: number
  observaciones: string | null
  cerrada: boolean
  usuario: {
    nombre: string
  }
}

interface CajaHistorialAdminProps {
  historialCajas: RegistroCaja[]
}

export default function CajaHistorialAdmin({ historialCajas = [] }: CajaHistorialAdminProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Filtrar registros
  const filteredRegistros = historialCajas.filter(registro => {
    const matchesSearch = 
      registro.observaciones?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'open' && !registro.cerrada) ||
      (statusFilter === 'closed' && registro.cerrada)
    
    return matchesSearch && matchesStatus
  })
  
  // Calcular estadísticas
  const totalVentas = filteredRegistros.reduce((sum, registro) => 
    sum + (registro.ventasEfectivo + registro.ventasTarjeta + registro.ventasTransferencia), 0)
  
  const totalGastos = filteredRegistros.reduce((sum, registro) => sum + registro.gastos, 0)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div>
      {/* Filtros y búsqueda */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por usuario u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos</option>
            <option value="open">Abiertos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>
      </div>
      
      {/* Resumen general */}
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <h3 className="text-md font-medium text-blue-800 mb-2">Resumen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white p-2 rounded-md shadow-sm">
            <div className="text-sm text-gray-500">Registros</div>
            <div className="text-xl font-semibold">{filteredRegistros.length}</div>
          </div>
          <div className="bg-white p-2 rounded-md shadow-sm">
            <div className="text-sm text-gray-500">Total ventas</div>
            <div className="text-xl font-semibold text-green-700">${totalVentas.toFixed(2)}</div>
          </div>
          <div className="bg-white p-2 rounded-md shadow-sm">
            <div className="text-sm text-gray-500">Total gastos</div>
            <div className="text-xl font-semibold text-red-700">${totalGastos.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Tabla de registros */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Ventas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gastos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistros.length > 0 ? (
              filteredRegistros.map((registro) => {
                const totalVentasRegistro = registro.ventasEfectivo + registro.ventasTarjeta + registro.ventasTransferencia
                return (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(registro.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.usuario.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${totalVentasRegistro.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${registro.gastos.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${registro.cerrada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {registro.cerrada ? 'Cerrado' : 'Abierto'}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay registros disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}