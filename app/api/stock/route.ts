// 2. app/api/stock/route.ts (usando auth())
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los productos
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const productos = await prisma.producto.findMany({
      orderBy: {
        nombre: 'asc',
      },
    })
    
    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 })
  }
}

// POST - Crear un nuevo producto
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'ENCARGADO')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validación básica
    if (!data.nombre || !data.codigo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    
    // Verificar si ya existe un producto con el mismo código
    const existingProduct = await prisma.producto.findUnique({
      where: {
        codigo: data.codigo,
      },
    })
    
    if (existingProduct) {
      return NextResponse.json({ error: 'Ya existe un producto con este código' }, { status: 400 })
    }
    
    // Crear el producto
    const newProduct = await prisma.producto.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: parseFloat(data.precio) || 0,
        stock: parseInt(data.stock) || 0,
        unidadMedida: data.unidadMedida || 'unidad',
        categoria: data.categoria || null,
        proveedor: data.proveedor || null,
      },
    })
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 })
  }
}

