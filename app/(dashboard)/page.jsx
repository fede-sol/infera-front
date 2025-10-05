"use client"
import { useState, useEffect } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Slack, Github, FileText, MessageSquare, FileCheck } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./dashboard.module.css"
import { getAuthenticatedUser, getDashboardStats, getRecentMessages } from "@lib/backend-helper"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { state } = useAppState()
  const { data: session } = useSession()

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalMessagesProcessed: 0,
    decisionsDetected: 0,
    slackChannelsAnalyzed: 0,
  })
  const [recentMessages, setRecentMessages] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, statsResponse, messagesResponse] = await Promise.all([
          getAuthenticatedUser({ token: session.access_token }),
          getDashboardStats({ token: session.access_token }),
          getRecentMessages({ token: session.access_token }),
        ])

        if (userResponse.success) {
          setUser(userResponse.data)
        } else {
          toast.error("No pudimos obtener la información del usuario")
        }

        if (statsResponse.success && statsResponse.data) {
          const statistics = statsResponse.data.statistics ?? {}
          setStats({
            totalMessagesProcessed: statistics.total_messages_processed ?? 0,
            decisionsDetected: statistics.decisions_detected ?? 0,
            slackChannelsAnalyzed: statistics.slack_channels_analyzed ?? 0,
          })
        } else {
          toast.error("No pudimos obtener las métricas del dashboard")
        }

        if (messagesResponse.success && messagesResponse.data) {
          setRecentMessages(messagesResponse.data.messages ?? [])
        } else {
          toast.error("No pudimos obtener las decisiones recientes")
          setRecentMessages([])
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard", error)
        toast.error("Ocurrió un error al cargar el dashboard")
      }
    }

    if (session?.access_token) {
      fetchData()
    }
  }, [session])

  const metricas = [
    {
      label: "Mensajes procesados",
      value: stats.totalMessagesProcessed,
      icon: MessageSquare,
    },
    {
      label: "Decisiones detectadas",
      value: stats.decisionsDetected,
      icon: FileCheck,
    },
    {
      label: "Canales de Slack analizados",
      value: stats.slackChannelsAnalyzed,
      icon: Slack,
    },
  ]

  return (
    <div className={styles.container}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <h1 className={styles.titulo}>Dashboard</h1>
        <div className={styles.topbarActions}></div>
      </div>

      {/* Estado de conexiones */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Estado de conexiones</h2>
        <div className={styles.grid}>
          <div className={`${styles.tarjetaConexion} ${state.conexiones.slack.conectado ? styles.conectado : ""}`}>
            <Slack size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>Slack</h3>
              <p>{user?.has_slack_token ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.slack.conectado && (
                <span className={styles.detalle}>{state.conexiones.slack.canales.length} canales</span>
              )}
            </div>
          </div>

          <div className={`${styles.tarjetaConexion} ${state.conexiones.github.conectado ? styles.conectado : ""}`}>
            <Github size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>GitHub</h3>
              <p>{user?.has_github_token ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.github.conectado && (
                <span className={styles.detalle}>{state.conexiones.github.repos.length} repositorios</span>
              )}
            </div>
          </div>

          <div className={`${styles.tarjetaConexion} ${state.conexiones.notion.conectado ? styles.conectado : ""}`}>
            <FileText size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>Notion</h3>
              <p>{user?.has_notion_token ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.notion.conectado && (
                <span className={styles.detalle}>{state.conexiones.notion.workspace}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Métricas</h2>
        <div className={styles.grid}>
          {metricas.map((metrica) => {
            const Icon = metrica.icon
            return (
              <div key={metrica.label} className={styles.tarjetaMetrica}>
                <Icon size={24} className={styles.iconoMetrica} />
                <div className={styles.metricaInfo}>
                  <p className={styles.metricaValor}>{metrica.value}</p>
                  <p className={styles.metricaLabel}>{metrica.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Últimas decisiones */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Últimas decisiones</h2>
        <div className={styles.tabla}>
          <div className={styles.tablaHeader}>
            <div className={styles.columna}>Mensaje</div>
            <div className={styles.columna}>Clasificación</div>
            <div className={styles.columna}>Confianza</div>
          </div>
          {recentMessages.length === 0 ? (
            <div className={styles.vacio}>
              <p>No hay decisiones capturadas aún</p>
            </div>
          ) : (
            recentMessages.map((message) => {
              const confidence = Number(message.confidence)
              const processedDate = message.processed_date || message.datetime

              return (
                <div key={message.message_id} className={styles.tablaFila}>
                  <div className={styles.columna}>
                    <p className={styles.decisionTitulo}>{message.message_text}</p>
                    {processedDate && (
                      <p className={styles.decisionFecha}>
                        {new Date(processedDate).toLocaleString("es-ES")}
                      </p>
                    )}
                  </div>
                  <div className={styles.columna}>
                    <span className={styles.badge}>{message.classification ?? "—"}</span>
                  </div>
                  <div className={styles.columna}>
                    <span className={styles.score}>
                      {Number.isFinite(confidence) ? `${(confidence * 100).toFixed(1)}%` : "—"}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
