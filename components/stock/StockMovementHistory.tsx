'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, RotateCcw, Search, Filter, Calendar } from 'lucide-react'

interface MovimientoStock {
  id: string
  cantidad: number
  tipo: string
  observacion: string | null
  createdAt: string
  producto: {
    codigo: string
    nombre: string
  }
  usuario: {
    nombre: string
  }
}

interface StockMovementHistoryProps {
  movimientos: MovimientoStock[]
}

export default function StockMovementHistory({ movimientos }: StockMovementHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  
  // Filtrar movimientos
  const filteredMovimientos = movimientos.filter(movimiento => {
    const matchesSearch = 
      movimiento.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movimiento.observacion && movimiento.observacion.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || movimiento.tipo === filterType
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const movDate = new Date(movimiento.createdAt)
      const today = new Date()
      
      switch (dateFilter) {
        case 'today':
          matchesDate = movDate.toDateString() === today.toDateString()
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = movDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = movDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesType && matchesDate
  })
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getMovementIcon = (tipo: string) => {
    switch (tipo) {
      case 'ENTRADA':
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'SALIDA':
        return <ArrowDown className="w-4 h-4 text-red-600" />
      case 'AJUSTE':
        return <RotateCcw className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }
  
  const getMovementBadge = (tipo: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (tipo) {
      case 'ENTRADA':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'SALIDA':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'AJUSTE':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por producto, código, usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
            <option value="AJUSTE">Ajustes</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todo el tiempo</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
        </div>
      </div>
      
      {/* Resumen de filtros */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <strong>{filteredMovimientos.length}</strong> movimientos encontrados
          </div>
          <div className="text-xs text-blue-600">
            {filterType !== 'all' && `Tipo: ${filterType} • `}
            {dateFilter !== 'all' && `Período: ${dateFilter === 'today' ? 'Hoy' : dateFilter === 'week' ? 'Última semana' : 'Último mes'}`}
          </div>
        </div>
      </div>
      
      {/* Tabla de movimientos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovimientos.length > 0 ? (
              filteredMovimientos.map((movimiento) => (
                <tr key={movimiento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(movimiento.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {movimiento.producto.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {movimiento.producto.codigo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMovementIcon(movimiento.tipo)}
                      <span className={`ml-2 ${getMovementBadge(movimiento.tipo)}`}>
                        {movimiento.tipo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      movimiento.tipo === 'ENTRADA' ? 'text-green-600' : 
                      movimiento.tipo === 'SALIDA' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movimiento.tipo === 'ENTRADA' ? '+' : movimiento.tipo === 'SALIDA' ? '-' : ''}
                      {movimiento.cantidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movimiento.usuario.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {movimiento.observacion || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium">No hay movimientos</p>
                    <p className="text-sm">No se encontraron movimientos que coincidan con los filtros seleccionados</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación si hay muchos movimientos */}
      {filteredMovimientos.length > 10 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Anterior
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
                <span className="font-medium">{filteredMovimientos.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  ←
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}