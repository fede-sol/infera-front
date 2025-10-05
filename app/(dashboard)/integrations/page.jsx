"use client"
import { useState, useEffect } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Github, Slack, FileText, Save, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./integrations.module.css"
import { useSession } from "next-auth/react"
import { getAuthenticatedUser, updateAuthCredentials } from "@lib/backend-helper"

export default function IntegrationsPage() {
  const { state, dispatch } = useAppState()

  const { data: session } = useSession()

  const [user, setUser] = useState(null)

  const fetchUser = async () => {
    const user = await getAuthenticatedUser({token: session.access_token})
    setUser(user.data)
  }
  useEffect(() => {
    if (session) {
      fetchUser()
    }
  }, [session])

  // Estado local para los tokens
  const [githubToken, setGithubToken] = useState(user?.github_token || "")
  const [notionToken, setNotionToken] = useState(user?.notion_token || "")

  // Guardar token de GitHub
  const guardarGitHub = async () => {
    if (!githubToken.trim()) {
      toast.error("Por favor ingresa un token válido")
      return
    }
    const response = await updateAuthCredentials({token: session.access_token, githubToken: githubToken})
    if (response.success) {
      fetchUser()
      toast.success("Token de GitHub guardado correctamente")
    } else {
      toast.error(response?.data?.message)
    }
  }

  // Guardar token de Notion
  const guardarNotion = async () => {
    if (!notionToken.trim()) {
      toast.error("Por favor ingresa un token válido")
      return
    }
    const response = await updateAuthCredentials({token: session.access_token, notionToken: notionToken})
    if (response.success) {
      fetchUser()
      toast.success("Token de Notion guardado correctamente")
    } else {
      toast.error(response?.data?.message)
    }
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
          {user?.has_github_token ? (
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
          {user?.has_slack_token ? (
            <CheckCircle size={24} className={styles.iconoConectado} />
          ) : (
            <XCircle size={24} className={styles.iconoDesconectado} />
          )}
        </div>
        <div className={styles.tarjetaBody}>
          <p className={styles.nota}>
            Conecta Infera a tu workspace de Slack para monitorear canales y capturar decisiones técnicas.
          </p>

          <a className={styles.botonSlack} href={`https://slack.com/oauth/v2/authorize?client_id=9434963026338.9433497656981&scope=&user_scope=channels:history,channels:read,users.profile:read,groups:read,im:read,mpim:read&state=${session && session.id}`}>
            <Slack size={18} />
            {user?.has_slack_token ? "Reconectar con Slack" : "Conectar con Slack"}
          </a>

          {user?.has_slack_token && (
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
          {user?.has_notion_token ? (
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
            placeholder="ntn_xxxxxxxxxxxxxxxxxxxx"
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
