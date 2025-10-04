"use client"
import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { CheckCircle, Edit, XCircle, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./review.module.css"

export default function ReviewPage() {
  const { state, dispatch } = useAppState()
  const [editando, setEditando] = useState(null)
  const [textoEditado, setTextoEditado] = useState("")

  const pendientes = state.decisiones.filter((d) => d.estado === "created")

  const handleAprobar = (decision) => {
    dispatch({ type: "APROBAR_DECISION", payload: decision.id })
    dispatch({
      type: "LOG_EVENTO",
      payload: {
        tipo: "actualizado",
        mensaje: `Decisión "${decision.titulo}" aprobada`,
        fecha: new Date().toISOString(),
      },
    })
    toast.success("Decisión aprobada y publicada")
  }

  const handleEditarYAprobar = (decision) => {
    if (!textoEditado.trim()) {
      toast.error("El contenido no puede estar vacío")
      return
    }
    dispatch({
      type: "EDITAR_Y_APROBAR_DECISION",
      payload: { id: decision.id, contenido: textoEditado },
    })
    dispatch({
      type: "LOG_EVENTO",
      payload: {
        tipo: "actualizado",
        mensaje: `Decisión "${decision.titulo}" editada y aprobada`,
        fecha: new Date().toISOString(),
      },
    })
    toast.success("Decisión editada y publicada")
    setEditando(null)
    setTextoEditado("")
  }

  const handleDescartar = (decision) => {
    dispatch({ type: "DESCARTAR_DECISION", payload: decision.id })
    dispatch({
      type: "LOG_EVENTO",
      payload: {
        tipo: "descartado",
        mensaje: `Decisión "${decision.titulo}" descartada`,
        fecha: new Date().toISOString(),
      },
    })
    toast.success("Decisión descartada")
  }

  const iniciarEdicion = (decision) => {
    setEditando(decision.id)
    setTextoEditado(decision.preview)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Revisión de Decisiones</h1>
          <p className={styles.subtitle}>
            {pendientes.length} decisión{pendientes.length !== 1 ? "es" : ""} pendiente
            {pendientes.length !== 1 ? "s" : ""} de revisión
          </p>
        </div>
      </div>

      {pendientes.length === 0 ? (
        <div className={styles.empty}>
          <CheckCircle size={48} />
          <h2>No hay decisiones pendientes</h2>
          <p>Todas las decisiones han sido revisadas</p>
        </div>
      ) : (
        <div className={styles.list}>
          {pendientes.map((decision) => (
            <div key={decision.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{decision.titulo}</h3>
                  <div className={styles.meta}>
                    <span className={styles.source}>
                      {decision.fuente === "slack" ? `📢 ${decision.canal}` : `💻 ${decision.repo}`}
                    </span>
                    <span className={styles.score}>Score: {decision.score}</span>
                    <span className={styles.date}>{new Date(decision.fecha).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>
              </div>

              {editando === decision.id ? (
                <div className={styles.editor}>
                  <textarea
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                    rows={8}
                    placeholder="Edita el contenido de la decisión..."
                  />
                  <div className={styles.editorActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditando(null)
                        setTextoEditado("")
                      }}
                    >
                      Cancelar
                    </button>
                    <button className={styles.approveButton} onClick={() => handleEditarYAprobar(decision)}>
                      <CheckCircle size={18} />
                      Guardar y aprobar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.preview}>
                    <p>{decision.preview}</p>
                    <a href={decision.notionUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Ver en Notion <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.discardButton} onClick={() => handleDescartar(decision)}>
                      <XCircle size={18} />
                      Descartar
                    </button>
                    <button className={styles.editButton} onClick={() => iniciarEdicion(decision)}>
                      <Edit size={18} />
                      Editar y aprobar
                    </button>
                    <button className={styles.approveButton} onClick={() => handleAprobar(decision)}>
                      <CheckCircle size={18} />
                      Aprobar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
