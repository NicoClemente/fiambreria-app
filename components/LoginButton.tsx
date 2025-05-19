
// components/LoginButton.tsx (actualizado)
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        Cargando...
      </button>
    )
  }

  if (session) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            Sesión activa como {session.user?.name}
          </p>
          <p className="text-sm text-green-600">
            {session.user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
        >
          <span className="mr-2">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
    >
      <span className="mr-2">🔐</span>
      Iniciar Sesión
    </button>
  )
}