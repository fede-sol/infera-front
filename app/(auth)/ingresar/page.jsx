"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, LogIn } from "lucide-react"
import styles from "./ingresar.module.css"

export default function PaginaIngresar() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      const resultado = await signIn("login", {
        email,
        password,
        redirect: false,
      })

      if (resultado?.error) {
        toast.error("Credenciales incorrectas")
      } else {
        toast.success("¡Bienvenido!")
        router.push("/")
      }
    } catch (error) {
      toast.error("Error al iniciar sesión")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.tarjeta}>
        <div className={styles.encabezado}>
          <h1 className={styles.titulo}>Infera</h1>
          <p className={styles.subtitulo}>Captura decisiones técnicas automáticamente</p>
        </div>

        <form onSubmit={manejarEnvio} className={styles.formulario}>
          <div className={styles.campo}>
            <label htmlFor="email" className={styles.etiqueta}>
              <Mail size={16} />
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@infera.dev"
              required
              className={styles.input}
              disabled={cargando}
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="password" className={styles.etiqueta}>
              <Lock size={16} />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
              disabled={cargando}
            />
          </div>

          <button type="submit" disabled={cargando} className={styles.boton}>
            <LogIn size={18} />
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className={styles.pie}>
          <p className={styles.textoPie}>
            ¿No tienes cuenta?{" "}
            <Link href="/registrar" className={styles.enlace}>
              Regístrate aquí
            </Link>
          </p>
          <div className={styles.demo}>
            <p className={styles.textoDemo}>Demo: demo@infera.dev / demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
