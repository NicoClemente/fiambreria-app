// components/stock/StockList.tsx
'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface Producto {
  id: string
  codigo: string
  nombre: string
  stock: number
  precio: number
  unidadMedida: string
  categoria: string | null
}

interface StockListProps {
  productos: Producto[]
}

export default function StockList({ productos = [] }: StockListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('nombre')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Filtrar productos por búsqueda
  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let fieldA = a[sortField as keyof Producto]
    let fieldB = b[sortField as keyof Producto]
    
    // Convertir a minúsculas si es una cadena
    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase()
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase()
    
    if (fieldA! < fieldB!) return sortDirection === 'asc' ? -1 : 1
    if (fieldA! > fieldB!) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  
  // Manejar clic en cabecera para cambiar ordenamiento
  const handleSortClick = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Obtener icono de ordenamiento
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }
  
  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, código o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>
      
      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('codigo')}
              >
                Código {getSortIcon('codigo')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('nombre')}
              >
                Nombre {getSortIcon('nombre')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('stock')}
              >
                Stock {getSortIcon('stock')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('precio')}
              >
                Precio {getSortIcon('precio')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('categoria')}
              >
                Categoría {getSortIcon('categoria')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${producto.stock <= 5 ? 'text-red-600 font-bold' : ''}`}>
                    {producto.stock} {producto.unidadMedida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${producto.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {producto.categoria || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No se encontraron productos con esa búsqueda' : 'No hay productos disponibles'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Conteo de productos */}
      <div className="mt-4 text-sm text-gray-600">
        {filteredProducts.length} producto(s) encontrado(s)
      </div>
    </div>
  )
}