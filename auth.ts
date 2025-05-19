// auth.ts (con tipos corregidos)
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔍 [SERVER] Intento de autenticación para:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [SERVER] Credenciales faltantes')
          console.log('Email:', !!credentials?.email)
          console.log('Password:', !!credentials?.password)
          return null
        }

        // Convertir a string explícitamente
        const email = String(credentials.email)
        const password = String(credentials.password)

        try {
          console.log('📊 [SERVER] Buscando usuario en BD...')
          
          // Buscar usuario
          const user = await prisma.usuario.findUnique({
            where: {
              email: email.toLowerCase(), // Ahora email es string
            },
          })

          console.log('👤 [SERVER] Usuario encontrado:', user ? `${user.nombre} (${user.email})` : 'No encontrado')
          
          if (!user) {
            console.log('❌ [SERVER] Usuario no existe en la base de datos')
            
            // Listar todos los usuarios para debug
            const allUsers = await prisma.usuario.findMany({
              select: { email: true, nombre: true }
            })
            console.log('📋 [SERVER] Usuarios existentes en BD:', allUsers)
            return null
          }

          console.log('🔑 [SERVER] Verificando contraseña...')
          console.log('Password ingresada length:', password.length) // Ahora password es string
          console.log('Hash en BD length:', user.password.length)
          
          // Verificar contraseña
          const passwordMatch = await bcrypt.compare(
            password, // Ahora es string
            user.password
          )

          console.log('🔑 [SERVER] Resultado verificación contraseña:', passwordMatch)

          if (!passwordMatch) {
            console.log('❌ [SERVER] Contraseña incorrecta')
            
            // Test manual del hash
            const testHash = await bcrypt.hash(password, 10) // Ahora es string
            console.log('🔍 [SERVER] Test hash de la contraseña:', testHash)
            return null
          }

          const returnUser = {
            id: user.id,
            email: user.email,
            name: user.nombre,
            role: user.rol,
          }
          
          console.log('✅ [SERVER] Autenticación exitosa, retornando:', returnUser)
          return returnUser
          
        } catch (error) {
          console.error('💥 [SERVER] Error durante autenticación:', error)
          console.error('Stack trace:', (error as Error).stack) // Tipo corregido
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🪙 [SERVER] JWT Callback')
      console.log('User recibido en JWT:', user)
      console.log('Token actual:', token)
      
      if (user) {
        token.role = user.role
        token.name = user.name
        console.log('Token actualizado con:', { role: user.role, name: user.name })
      }
      return token
    },
    async session({ session, token }) {
      console.log('📋 [SERVER] Session Callback')
      console.log('Token recibido:', token)
      console.log('Session actual:', session)
      
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.name = token.name as string
      }
      
      console.log('Session final:', session)
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: "mi-secreto-super-seguro-para-desarrollo-2024-fiambreria",
  debug: true,
})