// Para guardar en: components/stock/AddProductForm.tsx
'use client'

import { useState } from 'react'

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    unidadMedida: 'unidad',
    categoria: '',
    proveedor: '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    // Validación básica
    if (!formData.codigo || !formData.nombre) {
      setMessage('El código y nombre son obligatorios')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el producto')
      }
      
      // Mostrar mensaje de éxito
      setMessage('Producto creado exitosamente')
      
      // Limpiar formulario
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        unidadMedida: 'unidad',
        categoria: '',
        proveedor: '',
      })
      
      // Recargar página para actualizar lista
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage(error instanceof Error ? error.message : 'Error al crear el producto')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('exitosamente') 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            value={formData.codigo}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </div>
        
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </div>
        
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Inicial
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        
        <div>
          <label htmlFor="unidadMedida" className="block text-sm font-medium text-gray-700 mb-1">
            Unidad de Medida
          </label>
          <select
            id="unidadMedida"
            name="unidadMedida"
            value={formData.unidadMedida}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="unidad">Unidad</option>
            <option value="kg">Kilogramo</option>
            <option value="g">Gramo</option>
            <option value="l">Litro</option>
            <option value="ml">Mililitro</option>
            <option value="paquete">Paquete</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <input
            id="categoria"
            name="categoria"
            type="text"
            value={formData.categoria}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={2}
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>
      
      <div>
        <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-1">
          Proveedor
        </label>
        <input
          id="proveedor"
          name="proveedor"
          type="text"
          value={formData.proveedor}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  )
}