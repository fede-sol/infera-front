"use client"
import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./connections.module.css"

export default function ConnectionsPage() {
  const { state, dispatch } = useAppState()

  // Estado local para el formulario de nueva asociación
  const [canalSeleccionado, setCanalSeleccionado] = useState("")
  const [bdSeleccionada, setBdSeleccionada] = useState("")

  // Verificar si las integraciones están conectadas
  const slackConectado = state.integraciones.slack.conectado
  const notionConectado = state.integraciones.notion.conectado

  // Agregar nueva asociación
  const agregarAsociacion = () => {
    if (!canalSeleccionado || !bdSeleccionada) {
      toast.error("Selecciona un canal y una base de datos")
      return
    }

    // Verificar si el canal ya tiene una asociación
    const canalYaAsociado = state.asociaciones.some((a) => a.canal === canalSeleccionado)
    if (canalYaAsociado) {
      toast.error("Este canal ya tiene una base de datos asociada")
      return
    }

    dispatch({
      type: "AGREGAR_ASOCIACION",
      payload: {
        canal: canalSeleccionado,
        baseDatos: bdSeleccionada,
      },
    })

    toast.success("Asociación creada correctamente")
    setCanalSeleccionado("")
    setBdSeleccionada("")
  }

  // Eliminar asociación
  const eliminarAsociacion = (id) => {
    dispatch({
      type: "ELIMINAR_ASOCIACION",
      payload: id,
    })
    toast.success("Asociación eliminada")
  }

  // Si no están conectadas las integraciones, mostrar mensaje
  if (slackConectado || notionConectado) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Conexiones</h1>
          <p className={styles.descripcion}>Asocia canales de Slack con bases de datos de Notion</p>
        </div>

        <div className={styles.alerta}>
          <AlertCircle size={24} />
          <div>
            <h3>Integraciones requeridas</h3>
            <p>
              Para crear conexiones, primero debes configurar las integraciones de Slack y Notion en la pestaña de{" "}
              <a href="/integrations">Integraciones</a>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Conexiones</h1>
        <p className={styles.descripcion}>
          Asocia canales de Slack con bases de datos de Notion. Las decisiones capturadas en cada canal se publicarán en
          la base de datos correspondiente.
        </p>
      </div>

      {/* Formulario para nueva asociación */}
      <div className={styles.tarjeta}>
        <h2 className={styles.subtitulo}>Nueva asociación</h2>
        <div className={styles.formulario}>
          <div className={styles.campo}>
            <label className={styles.label}>Canal de Slack:</label>
            <select
              className={styles.select}
              value={canalSeleccionado}
              onChange={(e) => setCanalSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un canal</option>
              {state.integraciones.slack.canalesDisponibles.map((canal) => {
                const yaAsociado = state.asociaciones.some((a) => a.canal === canal)
                return (
                  <option key={canal} value={canal} disabled={yaAsociado}>
                    {canal} {yaAsociado ? "(ya asociado)" : ""}
                  </option>
                )
              })}
            </select>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Base de datos de Notion:</label>
            <select
              className={styles.select}
              value={bdSeleccionada}
              onChange={(e) => setBdSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una base de datos</option>
              {state.integraciones.notion.basesDisponibles.map((bd) => (
                <option key={bd} value={bd}>
                  {bd}
                </option>
              ))}
            </select>
          </div>

          <button
            className={styles.botonAgregar}
            onClick={agregarAsociacion}
            disabled={!canalSeleccionado || !bdSeleccionada}
          >
            <Plus size={18} />
            Agregar asociación
          </button>
        </div>
      </div>

      {/* Lista de asociaciones existentes */}
      <div className={styles.tarjeta}>
        <h2 className={styles.subtitulo}>Asociaciones activas ({state.asociaciones.length})</h2>

        {state.asociaciones.length === 0 ? (
          <p className={styles.vacio}>No hay asociaciones creadas todavía</p>
        ) : (
          <div className={styles.lista}>
            {state.asociaciones.map((asociacion) => (
              <div key={asociacion.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemCanal}>{asociacion.canal}</div>
                  <div className={styles.itemFlecha}>→</div>
                  <div className={styles.itemBd}>{asociacion.baseDatos}</div>
                </div>
                <button className={styles.botonEliminar} onClick={() => eliminarAsociacion(asociacion.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className={styles.info}>
        <h3>Reglas de asociación:</h3>
        <ul>
          <li>Un canal de Slack solo puede estar asociado a una base de datos de Notion</li>
          <li>Múltiples canales pueden compartir la misma base de datos</li>
          <li>Las decisiones capturadas se publicarán automáticamente en la base de datos asociada</li>
        </ul>
      </div>
    </div>
  )
}
