// components/caja/CajaForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

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
}

interface CajaFormProps {
  cajaActual?: CajaActual | null
  userId: string
}

export default function CajaForm({ cajaActual = null, userId }: CajaFormProps) {
  const [formData, setFormData] = useState({
    id: cajaActual?.id || '',
    montoInicial: cajaActual?.montoInicial?.toString() || '',
    montoFinal: cajaActual?.montoFinal?.toString() || '',
    ventasEfectivo: cajaActual?.ventasEfectivo?.toString() || '',
    ventasTarjeta: cajaActual?.ventasTarjeta?.toString() || '',
    ventasTransferencia: cajaActual?.ventasTransferencia?.toString() || '',
    gastos: cajaActual?.gastos?.toString() || '',
    observaciones: cajaActual?.observaciones || '',
    cerrada: cajaActual?.cerrada || false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación antes de cerrar caja
    if (formData.cerrada && (!formData.montoFinal || !formData.ventasEfectivo)) {
      toast.error('Para cerrar caja debe completar el monto final y las ventas en efectivo')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/caja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el registro de caja')
      }
      
      // Mostrar mensaje de éxito
      if (formData.cerrada) {
        toast.success('Caja cerrada exitosamente')
      } else {
        toast.success('Registro de caja guardado exitosamente')
      }
      
      // Recargar página
      window.location.reload()
      
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al procesar el registro de caja')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Calcular total de ventas
  const totalVentas = 
    (parseFloat(formData.ventasEfectivo) || 0) + 
    (parseFloat(formData.ventasTarjeta) || 0) + 
    (parseFloat(formData.ventasTransferencia) || 0)
  
  // Calcular monto esperado de cierre (inicial + ventas - gastos)
  const montoEsperado = 
    (parseFloat(formData.montoInicial) || 0) + 
    (parseFloat(formData.ventasEfectivo) || 0) - 
    (parseFloat(formData.gastos) || 0)
  
  // Calcular diferencia
  const diferencia = 
    (parseFloat(formData.montoFinal) || 0) - montoEsperado
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Modo de solo visualización si ya está cerrada la caja */}
      {cajaActual?.cerrada ? (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mb-4">
          Esta caja ya está cerrada y no se puede modificar.
        </div>
      ) : (
        <>
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="montoInicial" className="block text-sm font-medium text-gray-700 mb-1">
                Monto Inicial *
              </label>
              <input
                id="montoInicial"
                name="montoInicial"
                type="number"
                step="0.01"
                min="0"
                value={formData.montoInicial}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                required
                disabled={cajaActual?.cerrada}
              />
            </div>
            
            <div>
              <label htmlFor="montoFinal" className="block text-sm font-medium text-gray-700 mb-1">
                Monto Final {formData.cerrada ? '*' : ''}
              </label>
              <input
                id="montoFinal"
                name="montoFinal"
                type="number"
                step="0.01"
                min="0"
                value={formData.montoFinal}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                required={formData.cerrada}
                disabled={cajaActual?.cerrada}
              />
            </div>
          </div>
          
          {/* Ventas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ventasEfectivo" className="block text-sm font-medium text-gray-700 mb-1">
                Ventas en Efectivo {formData.cerrada ? '*' : ''}
              </label>
              <input
                id="ventasEfectivo"
                name="ventasEfectivo"
                type="number"
                step="0.01"
                min="0"
                value={formData.ventasEfectivo}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                required={formData.cerrada}
                disabled={cajaActual?.cerrada}
              />
            </div>
            
            <div>
              <label htmlFor="ventasTarjeta" className="block text-sm font-medium text-gray-700 mb-1">
                Ventas con Tarjeta
              </label>
              <input
                id="ventasTarjeta"
                name="ventasTarjeta"
                type="number"
                step="0.01"
                min="0"
                value={formData.ventasTarjeta}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                disabled={cajaActual?.cerrada}
              />
            </div>
            
            <div>
              <label htmlFor="ventasTransferencia" className="block text-sm font-medium text-gray-700 mb-1">
                Ventas por Transferencia
              </label>
              <input
                id="ventasTransferencia"
                name="ventasTransferencia"
                type="number"
                step="0.01"
                min="0"
                value={formData.ventasTransferencia}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                disabled={cajaActual?.cerrada}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="gastos" className="block text-sm font-medium text-gray-700 mb-1">
              Gastos
            </label>
            <input
              id="gastos"
              name="gastos"
              type="number"
              step="0.01"
              min="0"
              value={formData.gastos}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled={cajaActual?.cerrada}
            />
          </div>
          
          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={2}
              className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled={cajaActual?.cerrada}
            />
          </div>
          
          {/* Sección de totales y diferencias */}
          {(formData.montoInicial || formData.ventasEfectivo || formData.ventasTarjeta || formData.ventasTransferencia || formData.gastos || formData.montoFinal) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Resumen</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Total Ventas:</div>
                <div className="text-right">${totalVentas.toFixed(2)}</div>
                
                <div className="font-medium">Monto Esperado en Caja:</div>
                <div className="text-right">${montoEsperado.toFixed(2)}</div>
                
                {formData.montoFinal && (
                  <>
                    <div className="font-medium">Diferencia:</div>
                    <div className={`text-right ${diferencia < 0 ? 'text-red-600' : diferencia > 0 ? 'text-green-600' : ''}`}>
                      ${diferencia.toFixed(2)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {!cajaActual?.cerrada && (
            <div className="pt-2 flex justify-between">
              <div className="flex items-center">
                <input
                  id="cerrada"
                  name="cerrada"
                  type="checkbox"
                  checked={formData.cerrada}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={cajaActual?.cerrada}
                />
                <label htmlFor="cerrada" className="ml-2 block text-sm text-gray-700">
                  Cerrar caja
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || cajaActual?.cerrada}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : formData.cerrada ? 'Cerrar Caja' : 'Guardar'}
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Vista de solo lectura para cajas cerradas */}
      {cajaActual?.cerrada && (
        <div className="space-y-4">
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Resumen de Cierre</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Monto Inicial:</div>
              <div className="text-right">${parseFloat(cajaActual.montoInicial.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Ventas en Efectivo:</div>
              <div className="text-right">${parseFloat(cajaActual.ventasEfectivo.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Ventas con Tarjeta:</div>
              <div className="text-right">${parseFloat(cajaActual.ventasTarjeta.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Ventas por Transferencia:</div>
              <div className="text-right">${parseFloat(cajaActual.ventasTransferencia.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Total Ventas:</div>
              <div className="text-right font-bold">
                ${(parseFloat(cajaActual.ventasEfectivo.toString()) + parseFloat(cajaActual.ventasTarjeta.toString()) + parseFloat(cajaActual.ventasTransferencia.toString())).toFixed(2)}
              </div>
              
              <div className="font-medium">Gastos:</div>
              <div className="text-right">${parseFloat(cajaActual.gastos.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Monto Final:</div>
              <div className="text-right">${parseFloat(cajaActual.montoFinal.toString()).toFixed(2)}</div>
              
              <div className="font-medium">Monto Esperado:</div>
              <div className="text-right">
                ${(parseFloat(cajaActual.montoInicial.toString()) + parseFloat(cajaActual.ventasEfectivo.toString()) - parseFloat(cajaActual.gastos.toString())).toFixed(2)}
              </div>
              
              <div className="font-medium">Diferencia:</div>
              <div className="text-right font-bold">
                ${(parseFloat(cajaActual.montoFinal.toString()) - (parseFloat(cajaActual.montoInicial.toString()) + parseFloat(cajaActual.ventasEfectivo.toString()) - parseFloat(cajaActual.gastos.toString()))).toFixed(2)}
              </div>
            </div>
            
            {cajaActual.observaciones && (
              <div className="mt-3">
                <div className="font-medium">Observaciones:</div>
                <div className="mt-1 text-sm">{cajaActual.observaciones}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  )
}