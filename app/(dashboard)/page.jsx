"use client"
import { useAppState } from "@/context/AppStateContext"
import { Slack, Github, FileText, TrendingUp, MessageSquare, FileCheck, RefreshCw, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const { state, dispatch } = useAppState()

  // Calcular métricas mock (últimos 7 días)
  const metricas = {
    mensajesEvaluados: 247,
    hilosRelevantes: 18,
    docsCreados: 8,
    docsActualizados: 4,
  }

  // Forzar sincronización (agregar decisiones mock)
  const forzarSincronizacion = () => {
    const nuevasDecisiones = [
      {
        id: `${Date.now()}-1`,
        titulo: "Adopción de GraphQL para API pública",
        fuente: "slack",
        canal: "#arquitectura",
        score: 0.89,
        estado: "created",
        fecha: new Date().toISOString(),
        notionUrl: "https://notion.so/fake-demo-graphql",
        preview:
          "Se decidió implementar GraphQL para la API pública para resolver problemas de over-fetching y mejorar la experiencia de desarrollo.",
        contenido: {
          contexto: "La API REST actual tiene problemas de over-fetching",
          decision: "Implementar GraphQL para la API pública",
          consecuencias: "Mejor experiencia de desarrollo pero curva de aprendizaje",
        },
      },
      {
        id: `${Date.now()}-2`,
        titulo: "Migración de base de datos a PostgreSQL",
        fuente: "github",
        repo: "org/core",
        score: 0.85,
        estado: "created",
        fecha: new Date().toISOString(),
        notionUrl: "https://notion.so/fake-demo-postgres",
        preview:
          "El equipo acordó migrar de MySQL a PostgreSQL para aprovechar mejor soporte de JSON y queries avanzadas, mejorando el rendimiento a largo plazo.",
        contenido: {
          contexto: "MySQL presenta limitaciones para queries complejas",
          decision: "Migrar a PostgreSQL para mejor soporte de JSON y queries avanzadas",
          consecuencias: "Requiere migración de datos pero mejor rendimiento a largo plazo",
        },
      },
    ]

    dispatch({ type: "PUSH_DECISIONES", payload: nuevasDecisiones })
    dispatch({
      type: "LOG_EVENTO",
      payload: {
        tipo: "capturado",
        mensaje: `${nuevasDecisiones.length} decisiones capturadas mediante sincronización manual`,
      },
    })
    toast.success(`${nuevasDecisiones.length} nuevas decisiones capturadas`)
  }

  // Obtener últimas 5 decisiones
  const ultimasDecisiones = state.decisiones.slice(0, 5)

  return (
    <div className={styles.container}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <h1 className={styles.titulo}>Dashboard</h1>
        <div className={styles.topbarActions}>
          <button className={styles.botonSync} onClick={forzarSincronizacion}>
            <RefreshCw size={18} />
            Forzar sincronización
          </button>
        </div>
      </div>

      {/* Estado de conexiones */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Estado de conexiones</h2>
        <div className={styles.grid}>
          <div className={`${styles.tarjetaConexion} ${state.conexiones.slack.conectado ? styles.conectado : ""}`}>
            <Slack size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>Slack</h3>
              <p>{state.conexiones.slack.conectado ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.slack.conectado && (
                <span className={styles.detalle}>{state.conexiones.slack.canales.length} canales</span>
              )}
            </div>
          </div>

          <div className={`${styles.tarjetaConexion} ${state.conexiones.github.conectado ? styles.conectado : ""}`}>
            <Github size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>GitHub</h3>
              <p>{state.conexiones.github.conectado ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.github.conectado && (
                <span className={styles.detalle}>{state.conexiones.github.repos.length} repositorios</span>
              )}
            </div>
          </div>

          <div className={`${styles.tarjetaConexion} ${state.conexiones.notion.conectado ? styles.conectado : ""}`}>
            <FileText size={32} />
            <div className={styles.tarjetaConexionInfo}>
              <h3>Notion</h3>
              <p>{state.conexiones.notion.conectado ? "Conectado" : "Desconectado"}</p>
              {state.conexiones.notion.conectado && (
                <span className={styles.detalle}>{state.conexiones.notion.workspace}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Métricas (últimos 7 días)</h2>
        <div className={styles.grid}>
          <div className={styles.tarjetaMetrica}>
            <MessageSquare size={24} className={styles.iconoMetrica} />
            <div className={styles.metricaInfo}>
              <p className={styles.metricaValor}>{metricas.mensajesEvaluados}</p>
              <p className={styles.metricaLabel}>Mensajes evaluados</p>
            </div>
          </div>

          <div className={styles.tarjetaMetrica}>
            <TrendingUp size={24} className={styles.iconoMetrica} />
            <div className={styles.metricaInfo}>
              <p className={styles.metricaValor}>{metricas.hilosRelevantes}</p>
              <p className={styles.metricaLabel}>Hilos relevantes</p>
            </div>
          </div>

          <div className={styles.tarjetaMetrica}>
            <FileCheck size={24} className={styles.iconoMetrica} />
            <div className={styles.metricaInfo}>
              <p className={styles.metricaValor}>{metricas.docsCreados}</p>
              <p className={styles.metricaLabel}>Docs creados</p>
            </div>
          </div>

          <div className={styles.tarjetaMetrica}>
            <FileText size={24} className={styles.iconoMetrica} />
            <div className={styles.metricaInfo}>
              <p className={styles.metricaValor}>{metricas.docsActualizados}</p>
              <p className={styles.metricaLabel}>Docs actualizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Últimas decisiones */}
      <div className={styles.seccion}>
        <h2 className={styles.subtitulo}>Últimas decisiones</h2>
        <div className={styles.tabla}>
          <div className={styles.tablaHeader}>
            <div className={styles.columna}>Título</div>
            <div className={styles.columna}>Fuente</div>
            <div className={styles.columna}>Score</div>
            <div className={styles.columna}>Estado</div>
            <div className={styles.columna}>Acciones</div>
          </div>
          {ultimasDecisiones.length === 0 ? (
            <div className={styles.vacio}>
              <p>No hay decisiones capturadas aún</p>
              <button className={styles.botonPrimario} onClick={forzarSincronizacion}>
                Forzar sincronización
              </button>
            </div>
          ) : (
            ultimasDecisiones.map((decision) => (
              <div key={decision.id} className={styles.tablaFila}>
                <div className={styles.columna}>
                  <p className={styles.decisionTitulo}>{decision.titulo}</p>
                  <p className={styles.decisionFecha}>{new Date(decision.fecha).toLocaleDateString("es-ES")}</p>
                </div>
                <div className={styles.columna}>
                  <div className={styles.fuente}>
                    {decision.fuente === "slack" ? <Slack size={16} /> : <Github size={16} />}
                    <span>{decision.fuente === "slack" ? decision.canal : decision.repo}</span>
                  </div>
                </div>
                <div className={styles.columna}>
                  <span className={styles.score}>{(decision.score * 100).toFixed(0)}%</span>
                </div>
                <div className={styles.columna}>
                  <span className={`${styles.badge} ${styles[decision.estado]}`}>
                    {decision.estado === "created" && "Creado"}
                    {decision.estado === "updated" && "Actualizado"}
                    {decision.estado === "pending" && "Pendiente"}
                  </span>
                </div>
                <div className={styles.columna}>
                  {decision.notionUrl && (
                    <a
                      href={decision.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.enlace}
                      aria-label="Ver en Notion"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
