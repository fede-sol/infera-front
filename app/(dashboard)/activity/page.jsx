"use client"
import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Activity, Download, Filter } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./activity.module.css"

const tiposEvento = [
  { value: "todos", label: "Todos" },
  { value: "capturado", label: "Capturado" },
  { value: "creado", label: "Creado" },
  { value: "actualizado", label: "Actualizado" },
  { value: "descartado", label: "Descartado" },
  { value: "error", label: "Error" },
]

const iconosPorTipo = {
  capturado: "📥",
  creado: "✨",
  actualizado: "✅",
  descartado: "🗑️",
  error: "❌",
}

export default function ActivityPage() {
  const { state } = useAppState()
  const [filtro, setFiltro] = useState("todos")

  const actividadFiltrada = filtro === "todos" ? state.actividad : state.actividad.filter((a) => a.tipo === filtro)

  const handleExportar = () => {
    const data = JSON.stringify(actividadFiltrada, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `infera-activity-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Actividad exportada")
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Registro de Actividad</h1>
          <p className={styles.subtitle}>
            {actividadFiltrada.length} evento{actividadFiltrada.length !== 1 ? "s" : ""} registrado
            {actividadFiltrada.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              {tiposEvento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.exportButton} onClick={handleExportar}>
            <Download size={18} />
            Exportar JSON
          </button>
        </div>
      </div>

      {actividadFiltrada.length === 0 ? (
        <div className={styles.empty}>
          <Activity size={48} />
          <h2>No hay actividad registrada</h2>
          <p>Los eventos aparecerán aquí cuando ocurran</p>
        </div>
      ) : (
        <div className={styles.timeline}>
          {actividadFiltrada.map((evento, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <span>{iconosPorTipo[evento.tipo] || "📌"}</span>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <span className={`${styles.badge} ${styles[evento.tipo]}`}>{evento.tipo}</span>
                  <span className={styles.timelineDate}>{new Date(evento.fecha).toLocaleString("es-ES")}</span>
                </div>
                <p className={styles.timelineMessage}>{evento.mensaje}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
