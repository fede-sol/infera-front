"use client"
import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Github, Slack, FileText, Save, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./integrations.module.css"

export default function IntegrationsPage() {
  const { state, dispatch } = useAppState()

  // Estado local para los tokens
  const [githubToken, setGithubToken] = useState(state.integraciones.github.token || "")
  const [notionToken, setNotionToken] = useState(state.integraciones.notion.token || "")

  // Guardar token de GitHub
  const guardarGitHub = () => {
    if (!githubToken.trim()) {
      toast.error("Por favor ingresa un token válido")
      return
    }
    dispatch({
      type: "GUARDAR_TOKEN",
      payload: {
        servicio: "github",
        token: githubToken,
      },
    })
    toast.success("Token de GitHub guardado correctamente")
  }

  // Guardar token de Notion
  const guardarNotion = () => {
    if (!notionToken.trim()) {
      toast.error("Por favor ingresa un token válido")
      return
    }
    dispatch({
      type: "GUARDAR_TOKEN",
      payload: {
        servicio: "notion",
        token: notionToken,
      },
    })
    toast.success("Token de Notion guardado correctamente")
  }

  // Conectar Slack (simulado con link)
  const conectarSlack = () => {
    // En producción, esto redigiría a OAuth de Slack
    dispatch({
      type: "GUARDAR_TOKEN",
      payload: {
        servicio: "slack",
        token: "mock-slack-token-" + Date.now(),
      },
    })
    toast.success("Slack conectado correctamente")
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Integraciones</h1>
        <p className={styles.descripcion}>Configura los access tokens para conectar Infera con tus herramientas</p>
      </div>

      {/* GitHub */}
      <div className={styles.tarjeta}>
        <div className={styles.tarjetaHeader}>
          <Github size={28} />
          <div>
            <h2>GitHub</h2>
            <p className={styles.subtitulo}>Conecta tu cuenta de GitHub</p>
          </div>
          {state.integraciones.github.conectado ? (
            <CheckCircle size={24} className={styles.iconoConectado} />
          ) : (
            <XCircle size={24} className={styles.iconoDesconectado} />
          )}
        </div>
        <div className={styles.tarjetaBody}>
          <p className={styles.nota}>
            Necesitas un Personal Access Token con permisos de lectura en repositorios.{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Crear token <ExternalLink size={14} />
            </a>
          </p>

          <label className={styles.label}>Access Token:</label>
          <input
            type="password"
            className={styles.input}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
          />

          <button className={styles.botonPrimario} onClick={guardarGitHub} disabled={!githubToken.trim()}>
            <Save size={18} />
            Guardar token
          </button>
        </div>
      </div>

      {/* Slack */}
      <div className={styles.tarjeta}>
        <div className={styles.tarjetaHeader}>
          <Slack size={28} />
          <div>
            <h2>Slack</h2>
            <p className={styles.subtitulo}>Conecta tu workspace de Slack</p>
          </div>
          {state.integraciones.slack.conectado ? (
            <CheckCircle size={24} className={styles.iconoConectado} />
          ) : (
            <XCircle size={24} className={styles.iconoDesconectado} />
          )}
        </div>
        <div className={styles.tarjetaBody}>
          <p className={styles.nota}>
            Conecta Infera a tu workspace de Slack para monitorear canales y capturar decisiones técnicas.
          </p>

          <button className={styles.botonSlack} onClick={conectarSlack}>
            <Slack size={18} />
            {state.integraciones.slack.conectado ? "Reconectar con Slack" : "Conectar con Slack"}
          </button>

          {state.integraciones.slack.conectado && (
            <p className={styles.exito}>✓ Conectado al workspace: {state.integraciones.slack.workspace}</p>
          )}
        </div>
      </div>

      {/* Notion */}
      <div className={styles.tarjeta}>
        <div className={styles.tarjetaHeader}>
          <FileText size={28} />
          <div>
            <h2>Notion</h2>
            <p className={styles.subtitulo}>Conecta tu workspace de Notion</p>
          </div>
          {state.integraciones.notion.conectado ? (
            <CheckCircle size={24} className={styles.iconoConectado} />
          ) : (
            <XCircle size={24} className={styles.iconoDesconectado} />
          )}
        </div>
        <div className={styles.tarjetaBody}>
          <p className={styles.nota}>
            Necesitas un Integration Token de Notion con permisos de escritura.{" "}
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Crear integración <ExternalLink size={14} />
            </a>
          </p>

          <label className={styles.label}>Integration Token:</label>
          <input
            type="password"
            className={styles.input}
            placeholder="secret_xxxxxxxxxxxxxxxxxxxx"
            value={notionToken}
            onChange={(e) => setNotionToken(e.target.value)}
          />

          <button className={styles.botonPrimario} onClick={guardarNotion} disabled={!notionToken.trim()}>
            <Save size={18} />
            Guardar token
          </button>
        </div>
      </div>
    </div>
  )
}
