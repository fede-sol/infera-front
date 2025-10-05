import { withAuth } from 'next-auth/middleware'

export default withAuth({


    pages: {
      signIn: '/ingresar',
      signOut: '/ingresar',
      error: '/ingresar'
    }
})

// rutas que necesitan autenticación
export const config = {
  matcher: [
    '/',
    '/activity',
    '/connections',
    '/integrations',
    '/onboarding',
    '/review',
    '/templates',
  ]
}
