'use client'

import { useState } from 'react'
import { Package, AlertTriangle, TrendingUp, Activity, Plus, ArrowUpDown, Search, Filter } from 'lucide-react'
import StockList from './StockList'
import AddProductForm from './AddProductForm'
import StockMovementForm from './StockMovementForm'
import StockMovementHistory from './StockMovementHistory'

interface Producto {
  id: string
  codigo: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  unidadMedida: string
  categoria: string | null
  proveedor: string | null
}

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

interface StockStats {
  totalProductos: number
  productosStockBajo: number
  valorTotalInventario: number
  movimientosHoy: number
}

interface StockDashboardProps {
  productos: Producto[]
  movimientosRecientes: MovimientoStock[]
  stats: StockStats
  userRole: string
  userId: string
}

export default function StockDashboard({ 
  productos, 
  movimientosRecientes, 
  stats, 
  userRole, 
  userId 
}: StockDashboardProps) {
  const [activeTab, setActiveTab] = useState('inventory')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showMovementForm, setShowMovementForm] = useState(false)
  
  const canManageProducts = userRole === 'ADMIN' || userRole === 'ENCARGADO'
  
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
  
  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  )
  
  return (
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProductos}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.productosStockBajo}
          icon={AlertTriangle}
          color="text-orange-600"
          subValue="≤ 5 unidades"
        />
        <StatCard
          title="Valor Inventario"
          value={`$${stats.valorTotalInventario.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="Movimientos Hoy"
          value={stats.movimientosHoy}
          icon={Activity}
          color="text-purple-600"
        />
      </div>
      
      {/* Navegación por pestañas */}
      <div className="flex flex-wrap gap-4">
        <TabButton
          id="inventory"
          label="Inventario"
          icon={Package}
          isActive={activeTab === 'inventory'}
          onClick={setActiveTab}
        />
        <TabButton
          id="movements"
          label="Movimientos"
          icon={ArrowUpDown}
          isActive={activeTab === 'movements'}
          onClick={setActiveTab}
        />
        <TabButton
          id="history"
          label="Historial"
          icon={Activity}
          isActive={activeTab === 'history'}
          onClick={setActiveTab}
        />
        
        {/* Botones de acción */}
        <div className="ml-auto flex gap-3">
          <button
            onClick={() => setShowMovementForm(!showMovementForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Registrar Movimiento
          </button>
          
          {canManageProducts && (
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </button>
          )}
        </div>
      </div>
      
      {/* Formularios desplegables */}
      {showMovementForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Registrar Movimiento de Stock</h3>
            <button
              onClick={() => setShowMovementForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <StockMovementForm productos={productos} userId={userId} />
        </div>
      )}
      
      {showAddProduct && canManageProducts && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Agregar Nuevo Producto</h3>
            <button
              onClick={() => setShowAddProduct(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <AddProductForm />
        </div>
      )}
      
      {/* Contenido principal según la pestaña activa */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {activeTab === 'inventory' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Inventario Actual</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Stock bajo (≤5)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Stock normal
                </div>
              </div>
            </div>
            <StockList productos={productos} />
          </div>
        )}
        
        {activeTab === 'movements' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Movimientos de Stock</h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Tipos de Movimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span><strong>Entrada:</strong> Aumenta el stock</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span><strong>Salida:</strong> Reduce el stock</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span><strong>Ajuste:</strong> Corrección de inventario</span>
                </div>
              </div>
            </div>
            <StockMovementForm productos={productos} userId={userId} />
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Historial de Movimientos</h2>
            <StockMovementHistory movimientos={movimientosRecientes} />
          </div>
        )}
      </div>
    </div>
  )
}