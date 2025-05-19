import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar un movimiento de stock
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validación básica
    if (!data.productoId || !data.cantidad || !data.tipo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    
    // Verificar que el producto existe
    const producto = await prisma.producto.findUnique({
      where: {
        id: data.productoId,
      },
    })
    
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    
    // Calcular nuevo stock
    let nuevoStock = producto.stock
    const cantidad = parseInt(data.cantidad)
    
    if (data.tipo === 'ENTRADA') {
      nuevoStock += cantidad
    } else if (data.tipo === 'SALIDA') {
      if (producto.stock < cantidad) {
        return NextResponse.json({ error: 'No hay suficiente stock disponible' }, { status: 400 })
      }
      nuevoStock -= cantidad
    } else if (data.tipo === 'AJUSTE') {
      nuevoStock = cantidad
    } else {
      return NextResponse.json({ error: 'Tipo de movimiento no válido' }, { status: 400 })
    }
    
    // Actualizar stock y registrar movimiento en una transacción
    const [updatedProduct, movement] = await prisma.$transaction([
      prisma.producto.update({
        where: {
          id: data.productoId,
        },
        data: {
          stock: nuevoStock,
        },
      }),
      prisma.movimientoStock.create({
        data: {
          productoId: data.productoId,
          cantidad: cantidad,
          tipo: data.tipo,
          usuarioId: session.user.id,
          observacion: data.observacion || null,
        },
      }),
    ])
    
    return NextResponse.json({
      message: 'Movimiento registrado correctamente',
      producto: updatedProduct,
      movimiento: movement,
    })
  } catch (error) {
    console.error('Error al registrar movimiento:', error)
    return NextResponse.json({ error: 'Error al registrar el movimiento' }, { status: 500 })
  }
}

// GET - Obtener historial de movimientos
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const movimientos = await prisma.movimientoStock.findMany({
      include: {
        producto: {
          select: {
            nombre: true,
            codigo: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Últimos 100 movimientos
    })
    
    return NextResponse.json(movimientos)
  } catch (error) {
    console.error('Error al obtener movimientos:', error)
    return NextResponse.json({ error: 'Error al obtener los movimientos' }, { status: 500 })
  }
}