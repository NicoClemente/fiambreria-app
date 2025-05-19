// components/stock/StockMovementForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface Producto {
  id: string
  codigo: string
  nombre: string
  stock: number
  precio: number
  unidadMedida: string
}

interface StockMovementFormProps {
  productos: Producto[]
  userId: string
}

export default function StockMovementForm({ productos = [], userId }: StockMovementFormProps) {
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [tipo, setTipo] = useState('ENTRADA')
  const [observacion, setObservacion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Producto seleccionado
  const selectedProduct = productos.find(p => p.id === productoId)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación básica
    if (!productoId || !cantidad || !tipo) {
      toast.error('Por favor complete todos los campos requeridos')
      return
    }
    
    if (isNaN(Number(cantidad)) || parseInt(cantidad) <= 0) {
      toast.error('La cantidad debe ser un número mayor a cero')
      return
    }
    
    // Para movimientos de salida, verificar que hay suficiente stock
    if (tipo === 'SALIDA' && selectedProduct && parseInt(cantidad) > selectedProduct.stock) {
      toast.error(`No hay suficiente stock disponible. Stock actual: ${selectedProduct.stock}`)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stock/movimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId,
          cantidad: parseInt(cantidad),
          tipo,
          observacion,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el movimiento')
      }
      
      // Mostrar mensaje de éxito
      toast.success('Movimiento registrado exitosamente')
      
      // Limpiar formulario
      setProductoId('')
      setCantidad('')
      setObservacion('')
      
      // Recargar página para actualizar stock
      window.location.reload()
      
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al registrar el movimiento')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-1">
          Producto *
        </label>
        <select
          id="producto"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          required
        >
          <option value="">Seleccionar producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.codigo} - {producto.nombre}
            </option>
          ))}
        </select>
      </div>
      
      {selectedProduct && (
        <div className="p-3 bg-blue-50 rounded-md text-sm">
          <p><span className="font-semibold">Stock actual:</span> {selectedProduct.stock} {selectedProduct.unidadMedida}</p>
          <p><span className="font-semibold">Precio:</span> ${selectedProduct.precio.toFixed(2)}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Movimiento *
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          required
        >
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
          <option value="AJUSTE">Ajuste</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad *
        </label>
        <input
          id="cantidad"
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">
          Observación
        </label>
        <textarea
          id="observacion"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Descripción o motivo del movimiento"
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          rows={2}
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Procesando...' : 'Registrar Movimiento'}
        </button>
      </div>
    </form>
  )
}