import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import CajaForm from '@/components/caja/CajaForm'
import CajaHistorialAdmin from '@/components/caja/CajaHistorialAdmin'

const prisma = new PrismaClient()

export default async function CajaPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // Verificar si hay una caja abierta para hoy (para empleados)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const cajaHoy = await prisma.registroCaja.findFirst({
    where: {
      fecha: {
        gte: today,
      },
      usuarioId: session.user.id,
      cerrada: false,
    },
  })
  
  // Para administradores, obtener historial de cajas
  let historialCajas: any = []
  if (session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') {
    historialCajas = await prisma.registroCaja.findMany({
      orderBy: {
        fecha: 'desc',
      },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
      take: 50, // Últimas 50 cajas
    })
  }
  
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Registro de Caja Diaria</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel de registro de caja */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {cajaHoy ? 'Completar Registro de Caja' : 'Iniciar Registro de Caja'}
              </h2>
              <CajaForm cajaActual={cajaHoy} userId={session.user.id} />
            </div>
          </div>
          
          {/* Historial de cajas (solo para admin y encargados) */}
          {(session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') && (
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Registros</h2>
                <CajaHistorialAdmin historialCajas={historialCajas} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}