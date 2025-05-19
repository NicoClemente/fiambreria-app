import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import StockDashboard from '@/components/stock/StockDashboard'

const prisma = new PrismaClient()

export default async function StockPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // Obtener todos los productos con información adicional
  const productos = await prisma.producto.findMany({
    orderBy: {
      nombre: 'asc',
    },
  })
  
  // Obtener movimientos recientes (últimos 50)
  const movimientosRecientesRaw = await prisma.movimientoStock.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      producto: {
        select: {
          codigo: true,
          nombre: true,
        },
      },
      usuario: {
        select: {
          nombre: true,
        },
      },
    },
  })
  
  // Convertir las fechas a string para que coincidan con el tipo esperado
  const movimientosRecientes = movimientosRecientesRaw.map(movimiento => ({
    ...movimiento,
    createdAt: movimiento.createdAt.toISOString()
  }))
  
  // Calcular estadísticas
  const totalProductos = productos.length
  const productosStockBajo = productos.filter(p => p.stock <= 5).length
  const valorTotalInventario = productos.reduce((total, producto) => {
    return total + (producto.precio * producto.stock)
  }, 0)
  
  const stats = {
    totalProductos,
    productosStockBajo,
    valorTotalInventario,
    movimientosHoy: movimientosRecientes.filter(m => {
      const today = new Date()
      const movDate = new Date(m.createdAt)
      return movDate.toDateString() === today.toDateString()
    }).length
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Stock</h1>
            <p className="text-lg text-gray-600">
              Control integral de inventario y movimientos de stock
            </p>
          </div>
          
          <StockDashboard 
            productos={productos}
            movimientosRecientes={movimientosRecientes}
            stats={stats}
            userRole={session.user.role as string}
            userId={session.user.id}
          />
        </div>
      </div>
    </main>
  )
}