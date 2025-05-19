// scripts/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando creación de datos de prueba...')
  
  // Crear usuarios de prueba
  const adminPassword = await bcrypt.hash('admin123', 10)
  const encargadoPassword = await bcrypt.hash('encargado123', 10)
  const empleadoPassword = await bcrypt.hash('empleado123', 10)
  
  // Usuario administrador
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@fiambreria.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@fiambreria.com',
      password: adminPassword,
      rol: 'ADMIN',
    },
  })
  console.log('✓ Usuario administrador creado')
  
  // Usuario encargado
  const encargado = await prisma.usuario.upsert({
    where: { email: 'encargado@fiambreria.com' },
    update: {},
    create: {
      nombre: 'María Encargada',
      email: 'encargado@fiambreria.com',
      password: encargadoPassword,
      rol: 'ENCARGADO',
    },
  })
  console.log('✓ Usuario encargado creado')
  
  // Usuario empleado
  const empleado = await prisma.usuario.upsert({
    where: { email: 'empleado@fiambreria.com' },
    update: {},
    create: {
      nombre: 'Juan Empleado',
      email: 'empleado@fiambreria.com',
      password: empleadoPassword,
      rol: 'EMPLEADO',
    },
  })
  console.log('✓ Usuario empleado creado')
  
  // Crear algunos productos de ejemplo
  const productos = [
    {
      codigo: 'JAM001',
      nombre: 'Jamón Cocido',
      descripcion: 'Jamón cocido premium',
      precio: 850.00,
      stock: 50,
      unidadMedida: 'kg',
      categoria: 'Fiambres',
      proveedor: 'Proveedor A',
    },
    {
      codigo: 'QUE001',
      nombre: 'Queso Cremoso',
      descripcion: 'Queso cremoso tradicional',
      precio: 750.00,
      stock: 30,
      unidadMedida: 'kg',
      categoria: 'Quesos',
      proveedor: 'Proveedor B',
    },
    {
      codigo: 'SAL001',
      nombre: 'Salame Milano',
      descripcion: 'Salame milano artesanal',
      precio: 1200.00,
      stock: 25,
      unidadMedida: 'kg',
      categoria: 'Embutidos',
      proveedor: 'Proveedor C',
    },
    {
      codigo: 'MOR001',
      nombre: 'Mortadela',
      descripcion: 'Mortadela clásica',
      precio: 650.00,
      stock: 40,
      unidadMedida: 'kg',
      categoria: 'Fiambres',
      proveedor: 'Proveedor A',
    },
    {
      codigo: 'QUE002',
      nombre: 'Queso Provoleta',
      descripcion: 'Queso provoleta para parrilla',
      precio: 900.00,
      stock: 20,
      unidadMedida: 'kg',
      categoria: 'Quesos',
      proveedor: 'Proveedor B',
    },
    {
      codigo: 'PAN001',
      nombre: 'Pan Integral',
      descripcion: 'Pan integral artesanal',
      precio: 180.00,
      stock: 100,
      unidadMedida: 'unidad',
      categoria: 'Panadería',
      proveedor: 'Proveedor D',
    },
    {
      codigo: 'ACE001',
      nombre: 'Aceitunas Verdes',
      descripcion: 'Aceitunas verdes rellenas',
      precio: 320.00,
      stock: 60,
      unidadMedida: 'kg',
      categoria: 'Conservas',
      proveedor: 'Proveedor E',
    },
    {
      codigo: 'LON001',
      nombre: 'Longaniza',
      descripcion: 'Longaniza casera',
      precio: 980.00,
      stock: 15,
      unidadMedida: 'kg',
      categoria: 'Embutidos',
      proveedor: 'Proveedor C',
    },
  ]
  
  for (const productoData of productos) {
    const producto = await prisma.producto.upsert({
      where: { codigo: productoData.codigo },
      update: {},
      create: productoData,
    })
    console.log(`✓ Producto ${producto.nombre} creado`)
  }
  
  console.log('✅ Datos de prueba creados exitosamente')
  console.log('\n--- Credenciales de acceso ---')
  console.log('Administrador: admin@fiambreria.com / admin123')
  console.log('Encargado: encargado@fiambreria.com / encargado123')
  console.log('Empleado: empleado@fiambreria.com / empleado123')
  console.log('\n--- Próximos pasos ---')
  console.log('1. Inicie el servidor: npm run dev')
  console.log('2. Visite http://localhost:3000')
  console.log('3. Use las credenciales de arriba para iniciar sesión')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })