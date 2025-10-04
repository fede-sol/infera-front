"use client"
import { Search, RefreshCw } from "lucide-react"
import { useAppState } from "@/context/AppStateContext"
import toast from "react-hot-toast"
import styles from "./Topbar.module.css"

export default function Topbar() {
  const { dispatch } = useAppState()

  const handleForzarSync = () => {
    // Agregar decisiones mock
    const nuevasDecisiones = [
      {
        id: `dec-${Date.now()}-1`,
        titulo: "Migración a arquitectura de microservicios",
        fuente: "slack",
        canal: "#arquitectura",
        score: 0.87,
        estado: "created",
        fecha: new Date().toISOString(),
        preview: "Se decidió migrar el monolito a microservicios...",
        notionUrl: "https://notion.so/fake-demo-1",
      },
      {
        id: `dec-${Date.now()}-2`,
        titulo: "Adopción de TypeScript en frontend",
        fuente: "github",
        repo: "org/webapp",
        score: 0.92,
        estado: "created",
        fecha: new Date().toISOString(),
        preview: "El equipo acordó migrar gradualmente a TypeScript...",
        notionUrl: "https://notion.so/fake-demo-2",
      },
    ]

    dispatch({ type: "PUSH_DECISIONES", payload: nuevasDecisiones })
    dispatch({
      type: "LOG_EVENTO",
      payload: {
        tipo: "capturado",
        mensaje: `${nuevasDecisiones.length} decisiones capturadas`,
        fecha: new Date().toISOString(),
      },
    })
    toast.success(`${nuevasDecisiones.length} nuevas decisiones capturadas`)
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.search}>
        <Search size={18} />
        <input type="text" placeholder="Buscar decisiones..." />
      </div>
      <button className={styles.syncButton} onClick={handleForzarSync}>
        <RefreshCw size={18} />
        <span>Forzar sincronización</span>
      </button>
    </header>
  )
}
