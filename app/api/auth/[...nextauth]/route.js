import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({

      id: 'register',
      credentials: {},
      async authorize (credentials, req) {
        // logica para realizar el register con la ruta de la api
        const res = await fetch(`${process.env.API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: credentials?.username,
            email: credentials?.email,
            password: credentials?.password,
            full_name: credentials?.full_name
          })
        })

        const data = await res.json()

        if (data.access_token) {
          return data
        } else {
          throw new Error(data.detail || 'No se pudo registrar el usuario')
        }
      }
    }),
    CredentialsProvider({

      id: 'login',
      credentials: {},
      async authorize (credentials, req) {
        // logica para realizar el login con la ruta de la api
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          })
        })

        const data = await res.json()

        if (data.access_token) {
          return data
        } else {
          throw new Error(data.detail || 'No se pudo iniciar sesion')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },

  pages: {
    signin: '/ingresar',
    signout: '/ingresar',
    error: '/ingresar'
  },
  callbacks: {

    // se ejecuta cuando se encripta la sesion
    async jwt ({ token, user, trigger, session }) {
      if (user) {
        return { id: user.user.id, full_name: user.user.full_name, email: user.user.email, access_token: user.access_token }
      }
      return token
    },

    // establece que datos va a guardar la sesion
    async session ({ session, token }) {
      Object.assign(session, token)
      return session
    },
  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
