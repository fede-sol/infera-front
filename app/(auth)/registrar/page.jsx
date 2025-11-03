"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, User, UserPlus } from "lucide-react"
import { signIn } from "next-auth/react"
import styles from "./registrar.module.css"

export default function PaginaRegistrar() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (password !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setCargando(true)

    try {
      const response = await signIn("register", {
        email,
        password,
        full_name: nombre,
        username: nombre,
        redirect: false,
      })

      if (response?.error) {
        toast.error(response.error)
        return
      }

      toast.success("Cuenta creada correctamente")
      router.push("/")
    } catch (error) {
      console.error("Error al registrar usuario", error)
      toast.error("Error al crear la cuenta")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.tarjeta}>
        <div className={styles.encabezado}>
          <h1 className={styles.titulo}>Crear cuenta</h1>
          <p className={styles.subtitulo}>Comienza a capturar decisiones técnicas</p>
        </div>

        <form onSubmit={manejarEnvio} className={styles.formulario}>
          <div className={styles.campo}>
            <label htmlFor="nombre" className={styles.etiqueta}>
              <User size={16} />
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
              className={styles.input}
              disabled={cargando}
            />
          </div>

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
              placeholder="tu@email.com"
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
              placeholder="Mínimo 6 caracteres"
              required
              className={styles.input}
              disabled={cargando}
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="confirmarPassword" className={styles.etiqueta}>
              <Lock size={16} />
              Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              className={styles.input}
              disabled={cargando}
            />
          </div>

          <button type="submit" disabled={cargando} className={styles.boton}>
            <UserPlus size={18} />
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className={styles.pie}>
          <p className={styles.textoPie}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/ingresar" className={styles.enlace}>
              Ingresa aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
