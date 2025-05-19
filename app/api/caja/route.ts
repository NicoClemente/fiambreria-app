import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Crear o actualizar registro de caja
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validación antes de cerrar caja
    if (data.cerrada && (!data.montoFinal || !data.ventasEfectivo)) {
      return NextResponse.json({ error: 'Faltan campos requeridos para cerrar caja' }, { status: 400 })
    }
    
    // Si se está actualizando un registro existente
    if (data.id) {
      // Verificar que el registro existe
      const registro = await prisma.registroCaja.findUnique({
        where: {
          id: data.id,
        },
      })
      
      if (!registro) {
        return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 })
      }
      
      // Solo el usuario que creó el registro o un admin pueden modificarlo
      if (registro.usuarioId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado para modificar este registro' }, { status: 401 })
      }
      
      // No se puede modificar un registro ya cerrado (excepto admin)
      if (registro.cerrada && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No se puede modificar un registro ya cerrado' }, { status: 400 })
      }
      
      // Actualizar el registro
      const updatedRegistro = await prisma.registroCaja.update({
        where: {
          id: data.id,
        },
        data: {
          montoInicial: data.montoInicial !== undefined ? parseFloat(data.montoInicial) : registro.montoInicial,
          montoFinal: data.montoFinal !== undefined ? parseFloat(data.montoFinal) : registro.montoFinal,
          ventasEfectivo: data.ventasEfectivo !== undefined ? parseFloat(data.ventasEfectivo) : registro.ventasEfectivo,
          ventasTarjeta: data.ventasTarjeta !== undefined ? parseFloat(data.ventasTarjeta) : registro.ventasTarjeta,
          ventasTransferencia: data.ventasTransferencia !== undefined ? parseFloat(data.ventasTransferencia) : registro.ventasTransferencia,
          gastos: data.gastos !== undefined ? parseFloat(data.gastos) : registro.gastos,
          observaciones: data.observaciones !== undefined ? data.observaciones : registro.observaciones,
          cerrada: data.cerrada !== undefined ? data.cerrada : registro.cerrada,
        },
      })
      
      return NextResponse.json(updatedRegistro)
    } else {
      // Crear un nuevo registro
      const newRegistro = await prisma.registroCaja.create({
        data: {
          usuarioId: session.user.id,
          montoInicial: parseFloat(data.montoInicial) || 0,
          montoFinal: parseFloat(data.montoFinal) || 0,
          ventasEfectivo: parseFloat(data.ventasEfectivo) || 0,
          ventasTarjeta: parseFloat(data.ventasTarjeta) || 0,
          ventasTransferencia: parseFloat(data.ventasTransferencia) || 0,
          gastos: parseFloat(data.gastos) || 0,
          observaciones: data.observaciones || '',
          cerrada: data.cerrada || false,
        },
      })
      
      return NextResponse.json(newRegistro, { status: 201 })
    }
  } catch (error) {
    console.error('Error en registro de caja:', error)
    return NextResponse.json({ error: 'Error al procesar el registro de caja' }, { status: 500 })
  }
}

// GET - Obtener registros de caja
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    const usuarioId = searchParams.get('usuarioId')
    const soloAbiertos = searchParams.get('soloAbiertos') === 'true'
    
    // Preparar filtros de búsqueda
    const where: any = {}
    
    // Si no es admin, solo ve sus propios registros
    if (session.user.role !== 'ADMIN') {
      where.usuarioId = session.user.id
    } else if (usuarioId) {
      where.usuarioId = usuarioId
    }
    
    // Filtro por fecha
    if (fecha) {
      const fechaInicio = new Date(fecha)
      fechaInicio.setHours(0, 0, 0, 0)
      
      const fechaFin = new Date(fecha)
      fechaFin.setHours(23, 59, 59, 999)
      
      where.fecha = {
        gte: fechaInicio,
        lte: fechaFin,
      }
    }
    
    // Filtro por cajas abiertas/cerradas
    if (soloAbiertos) {
      where.cerrada = false
    }
    
    const registros = await prisma.registroCaja.findMany({
      where,
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    })
    
    return NextResponse.json(registros)
  } catch (error) {
    console.error('Error al obtener registros:', error)
    return NextResponse.json({ error: 'Error al obtener los registros de caja' }, { status: 500 })
  }
}