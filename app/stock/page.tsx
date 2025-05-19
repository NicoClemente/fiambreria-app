// app/stock/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import StockList from '@/components/stock/StockList'
import AddProductForm from '@/components/stock/AddProductForm'
import StockMovementForm from '@/components/stock/StockMovementForm'

const prisma = new PrismaClient()

export default async function StockPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // Obtener todos los productos
  const productos = await prisma.producto.findMany({
    orderBy: {
      nombre: 'asc',
    },
  })
  
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Stock</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Inventario Actual</h2>
              <StockList productos={productos} />
            </div>
          </div>
          
          {/* Panel de acciones */}
          <div className="space-y-6">
            {/* Formulario para registrar movimientos de stock */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Movimiento</h2>
              <StockMovementForm productos={productos} userId={session.user.id} />
            </div>
            
            {/* Formulario para agregar nuevo producto (solo admin y encargados) */}
            {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Nuevo Producto</h2>
                <AddProductForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}