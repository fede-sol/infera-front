"use client"
import { useEffect, useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Plus, Trash2, AlertCircle, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./connections.module.css"
import { useSession } from "next-auth/react"
import {
  getAuthenticatedUser,
  getSlackChannels,
  getNotionDatabases,
  getSlackAssociations,
  createSmartSlackAssociations,
  deleteSlackAssociation,
} from "@lib/backend-helper"

export default function ConnectionsPage() {
  const { state } = useAppState()

  const { data: session } = useSession()

  // Estado local para datos remotos
  const [canalesSlack, setCanalesSlack] = useState([])
  const [basesNotion, setBasesNotion] = useState([])
  const [asociaciones, setAsociaciones] = useState([])

  // Estado local para el formulario de nueva asociación
  const [canalSeleccionado, setCanalSeleccionado] = useState("")
  const [bdSeleccionada, setBdSeleccionada] = useState("")

  const [cargandoAsociaciones, setCargandoAsociaciones] = useState(false)
  const [user, setUser] = useState(null)

  const [slackConectado, setSlackConectado] = useState(true)
  const [notionConectado, setNotionConectado] = useState(true)

  const fetchData = async () => {
    if (!session) return

    const user = await getAuthenticatedUser({token: session.access_token})
    setUser(user.data)

    setSlackConectado(user.data.has_slack_token)
    setNotionConectado(user.data.has_notion_token)

    const [canalesResponse, basesResponse] = await Promise.all([
      getSlackChannels({ token: session.access_token }),
      getNotionDatabases({ token: session.access_token }),
    ])

    if (!canalesResponse.success) {
      toast.error("No pudimos obtener los canales de Slack")
    } else {
      setCanalesSlack(canalesResponse.data?.channels ?? [])
    }

    if (!basesResponse.success) {
      toast.error("No pudimos obtener las bases de Notion")
    } else {
      setBasesNotion(basesResponse.data?.databases ?? [])
    }
  }

  const fetchAssociations = async () => {
    if (!session) return

    setCargandoAsociaciones(true)

    const asociacionesResponse = await getSlackAssociations({ token: session.access_token })
    console.log('asociacionesResponse', asociacionesResponse)

    if (!asociacionesResponse.success) {
      toast.error("No pudimos obtener las asociaciones")
    } else {
      setAsociaciones(asociacionesResponse.data ?? [])
    }

    setCargandoAsociaciones(false)
  }

  useEffect(() => {
    if (session) {
      fetchData()
      fetchAssociations()
    }
  }, [session])

  const agregarAsociacion = async () => {
    if (!session) {
      toast.error("Sesión no encontrada")
      return
    }

    if (!canalSeleccionado || !bdSeleccionada) {
      toast.error("Selecciona un canal y una base de datos")
      return
    }

    const response = await createSmartSlackAssociations({
      token: session.access_token,
      notionDatabaseIdExternal: bdSeleccionada,
      slackChannelIdsExternal: [canalSeleccionado],
    })

    if (!response.success) {
      toast.error(response.error?.message ?? "No pudimos crear la asociación")
      return
    }

    toast.success("Asociación creada correctamente")
    setCanalSeleccionado("")
    setBdSeleccionada("")
    fetchAssociations()
  }

  const eliminarAsociacion = async (asociacion) => {
    if (!session) {
      toast.error("Sesión no encontrada")
      return
    }

    const response = await deleteSlackAssociation({
      token: session.access_token,
      associationId: asociacion.id,
    })

    if (!response.success) {
      toast.error(response.error?.message ?? "No pudimos eliminar la asociación")
      return
    }

    toast.success("Asociación eliminada correctamente")
    fetchAssociations()
  }

  if (!slackConectado || !notionConectado) {
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
              {canalesSlack.map((canal,index) => (
                <option key={index} value={canal.slack_channel_id}>
                  {canal.channel_name}
                </option>
              ))}
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
              {basesNotion.map((db,index) => (
                <option key={index} value={db.notion_database_id}>
                  {db.database_name}
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
        <div className={styles.listaHeader}>
          <h2 className={styles.subtitulo}>Asociaciones activas ({asociaciones?.count})</h2>
          <button className={styles.botonPrimario} onClick={fetchAssociations} disabled={cargandoAsociaciones}>
            <RefreshCw size={16} className={cargandoAsociaciones ? styles.spin : ""} />
            Actualizar
          </button>
        </div>

        {cargandoAsociaciones && asociaciones && Array.isArray(asociaciones?.associations) ? (
          <p className={styles.vacio}>Cargando asociaciones...</p>
        ) : asociaciones?.count === 0 ? (
          <p className={styles.vacio}>No hay asociaciones creadas todavía</p>
        ) : (
          <div className={styles.lista}>
            {asociaciones && Array.isArray(asociaciones?.associations) && asociaciones?.associations.map((asociacion, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemCanal}>{asociacion.slack_channel?.channel_name ?? asociacion.slack_channel_id}</div>
                  <div className={styles.itemFlecha}>→</div>
                  <div className={styles.itemBd}>{asociacion.notion_database?.database_name ?? asociacion.notion_database_id}</div>
                </div>
                <button className={styles.botonEliminar} onClick={() => eliminarAsociacion(asociacion)}>
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
