import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Obtener estadísticas paralelas
    const [
      totalProducts,
      lowStockProducts,
      todaySalesResult,
      openCashRegister
    ] = await Promise.all([
      // Total de productos
      prisma.producto.count(),
      
      // Productos con stock bajo (<=5)
      prisma.producto.count({
        where: {
          stock: {
            lte: 5
          }
        }
      }),
      
      // Ventas de hoy
      prisma.registroCaja.findMany({
        where: {
          fecha: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999))
          }
        },
        select: {
          ventasEfectivo: true,
          ventasTarjeta: true,
          ventasTransferencia: true
        }
      }),
      
      // Verificar si hay caja abierta
      prisma.registroCaja.findFirst({
        where: {
          cerrada: false,
          fecha: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ])
    
    // Calcular ventas totales del día
    const todaySales = todaySalesResult.reduce((total, registro) => {
      return total + registro.ventasEfectivo + registro.ventasTarjeta + registro.ventasTransferencia
    }, 0)
    
    const stats = {
      totalProducts,
      lowStockProducts,
      todaySales,
      openCashRegister: !!openCashRegister,
      monthlyRevenue: 0 // Por implementar si es necesario
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}