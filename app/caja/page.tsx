import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import CajaDashboard from '@/components/caja/CajaDashboard'

const prisma = new PrismaClient()

export default async function CajaPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // Verificar si hay una caja abierta para hoy (para empleados)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const cajaHoyRaw = await prisma.registroCaja.findFirst({
    where: {
      fecha: {
        gte: today,
      },
      usuarioId: session.user.id,
      cerrada: false,
    },
  })
  
  // Convertir Date a string para que coincida con el tipo esperado
  const cajaHoy = cajaHoyRaw ? {
    ...cajaHoyRaw,
    fecha: cajaHoyRaw.fecha.toISOString()
  } : null
  
  // Para administradores, obtener historial de cajas con más detalles
  let historialCajas: any = []
  if (session.user.role === 'ADMIN' || session.user.role === 'ENCARGADO') {
    const historialRaw = await prisma.registroCaja.findMany({
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
      take: 100, // Últimas 100 cajas
    })
    
    // Convertir todas las fechas a string
    historialCajas = historialRaw.map(caja => ({
      ...caja,
      fecha: caja.fecha.toISOString(),
      createdAt: caja.createdAt.toISOString(),
      updatedAt: caja.updatedAt.toISOString()
    }))
  }
  
  // Estadísticas de caja
  const estadisticas = {
    cajasAbiertasHoy: await prisma.registroCaja.count({
      where: {
        fecha: {
          gte: today,
        },
        cerrada: false,
      },
    }),
    ventasHoy: await prisma.registroCaja.aggregate({
      where: {
        fecha: {
          gte: today,
        },
      },
      _sum: {
        ventasEfectivo: true,
        ventasTarjeta: true,
        ventasTransferencia: true,
      },
    }),
    diferenciasHoy: historialCajas.filter((caja: any) => {
      const cajaDate = new Date(caja.fecha)
      const esHoy = cajaDate.toDateString() === new Date().toDateString()
      if (!esHoy || !caja.cerrada) return false
      
      const montoEsperado = caja.montoInicial + caja.ventasEfectivo - caja.gastos
      const diferencia = caja.montoFinal - montoEsperado
      return Math.abs(diferencia) > 0.01
    }).length
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Arqueo de Caja</h1>
            <p className="text-lg text-gray-600">
              Control de efectivo y registro de ventas diarias
            </p>
          </div>
          
          <CajaDashboard 
            cajaActual={cajaHoy}
            historialCajas={historialCajas}
            estadisticas={estadisticas}
            userRole={session.user.role as string}
            userId={session.user.id}
            userName={session.user.name as string}
          />
        </div>
      </div>
    </main>
  )
}