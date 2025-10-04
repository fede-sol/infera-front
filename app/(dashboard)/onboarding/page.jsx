"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/context/AppStateContext"
import { Check, Slack, Github, FileText, ChevronRight, ChevronLeft } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./onboarding.module.css"

export default function OnboardingPage() {
  const router = useRouter()
  const { state, dispatch } = useAppState()
  const [pasoActual, setPasoActual] = useState(1)

  // Estado local para el wizard
  const [slackCanales, setSlackCanales] = useState([])
  const [githubRepos, setGithubRepos] = useState([])
  const [notionWorkspace, setNotionWorkspace] = useState("")
  const [notionBase, setNotionBase] = useState("")
  const [idioma, setIdioma] = useState("es")
  const [tipoPlantilla, setTipoPlantilla] = useState("ADR breve")
  const [palabrasClave, setPalabrasClave] = useState(["arquitectura", "decisión", "RFC", "ADR"])
  const [umbralConfianza, setUmbralConfianza] = useState(0.8)
  const [pesoTechLeads, setPesoTechLeads] = useState(true)

  // Conectar fuentes (mock)
  const conectarSlack = () => {
    dispatch({
      type: "GUARDAR_CONEXION",
      payload: {
        fuente: "slack",
        datos: {
          conectado: true,
          canales: slackCanales,
        },
      },
    })
    toast.success("Slack conectado correctamente")
  }

  const conectarGitHub = () => {
    dispatch({
      type: "GUARDAR_CONEXION",
      payload: {
        fuente: "github",
        datos: {
          conectado: true,
          repos: githubRepos,
        },
      },
    })
    toast.success("GitHub conectado correctamente")
  }

  const probarNotion = async () => {
    try {
      const res = await fetch("/api/test-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace: notionWorkspace, base: notionBase }),
      })
      const data = await res.json()

      if (data.ok) {
        dispatch({
          type: "GUARDAR_CONEXION",
          payload: {
            fuente: "notion",
            datos: {
              conectado: true,
              workspace: notionWorkspace,
              base: notionBase,
              ultimaPruebaOk: true,
            },
          },
        })
        toast.success("Conexión a Notion verificada")
      } else {
        toast.error("Error al conectar con Notion")
      }
    } catch (error) {
      console.error("[v0] Error probando Notion:", error)
      toast.error("Error al probar conexión")
    }
  }

  // Navegación entre pasos
  const siguientePaso = () => {
    if (pasoActual === 1) {
      // Validar que al menos una fuente esté conectada
      if (!state.conexiones.slack.conectado && !state.conexiones.github.conectado) {
        toast.error("Conecta al menos una fuente (Slack o GitHub)")
        return
      }
      if (!state.conexiones.notion.conectado) {
        toast.error("Debes conectar y probar Notion")
        return
      }
    }
    setPasoActual((prev) => Math.min(prev + 1, 3))
  }

  const pasoAnterior = () => {
    setPasoActual((prev) => Math.max(prev - 1, 1))
  }

  const finalizarOnboarding = () => {
    // Guardar configuración de plantilla
    dispatch({
      type: "SET_PLANTILLA",
      payload: {
        idioma,
        tipo: tipoPlantilla,
        umbralConfianza,
        pesoTechLeads,
        palabrasClave,
      },
    })

    toast.success("¡Configuración completada!")
    router.push("/")
  }

  // Toggle de canales/repos
  const toggleCanal = (canal) => {
    setSlackCanales((prev) => (prev.includes(canal) ? prev.filter((c) => c !== canal) : [...prev, canal]))
  }

  const toggleRepo = (repo) => {
    setGithubRepos((prev) => (prev.includes(repo) ? prev.filter((r) => r !== repo) : [...prev, repo]))
  }

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        {/* Header con progreso */}
        <div className={styles.header}>
          <h1 className={styles.titulo}>Configuración inicial</h1>
          <div className={styles.progreso}>
            {[1, 2, 3].map((paso) => (
              <div key={paso} className={`${styles.pasoIndicador} ${pasoActual >= paso ? styles.activo : ""}`}>
                {pasoActual > paso ? <Check size={16} /> : paso}
              </div>
            ))}
          </div>
        </div>

        {/* Paso 1: Conectar fuentes */}
        {pasoActual === 1 && (
          <div className={styles.paso}>
            <h2 className={styles.subtitulo}>
              <Slack size={24} />
              Conectar fuentes
            </h2>
            <p className={styles.descripcion}>
              Conecta Slack, GitHub y Notion para que Infera pueda capturar decisiones técnicas.
            </p>

            {/* Slack */}
            <div className={styles.tarjeta}>
              <div className={styles.tarjetaHeader}>
                <Slack size={20} />
                <h3>Slack</h3>
                <span className={state.conexiones.slack.conectado ? styles.badgeConectado : styles.badgeDesconectado}>
                  {state.conexiones.slack.conectado ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <div className={styles.tarjetaBody}>
                <label className={styles.label}>Canales a monitorear:</label>
                <div className={styles.checkboxGroup}>
                  {state.conexiones.slack.canalesDisponibles.map((canal) => (
                    <label key={canal} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={slackCanales.includes(canal)}
                        onChange={() => toggleCanal(canal)}
                      />
                      <span>{canal}</span>
                    </label>
                  ))}
                </div>
                <button className={styles.botonPrimario} onClick={conectarSlack} disabled={slackCanales.length === 0}>
                  Conectar Slack
                </button>
              </div>
            </div>

            {/* GitHub */}
            <div className={styles.tarjeta}>
              <div className={styles.tarjetaHeader}>
                <Github size={20} />
                <h3>GitHub</h3>
                <span className={state.conexiones.github.conectado ? styles.badgeConectado : styles.badgeDesconectado}>
                  {state.conexiones.github.conectado ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <div className={styles.tarjetaBody}>
                <label className={styles.label}>Repositorios a monitorear:</label>
                <div className={styles.checkboxGroup}>
                  {state.conexiones.github.reposDisponibles.map((repo) => (
                    <label key={repo} className={styles.checkbox}>
                      <input type="checkbox" checked={githubRepos.includes(repo)} onChange={() => toggleRepo(repo)} />
                      <span>{repo}</span>
                    </label>
                  ))}
                </div>
                <button className={styles.botonPrimario} onClick={conectarGitHub} disabled={githubRepos.length === 0}>
                  Conectar GitHub
                </button>
              </div>
            </div>

            {/* Notion */}
            <div className={styles.tarjeta}>
              <div className={styles.tarjetaHeader}>
                <FileText size={20} />
                <h3>Notion</h3>
                <span className={state.conexiones.notion.conectado ? styles.badgeConectado : styles.badgeDesconectado}>
                  {state.conexiones.notion.conectado ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <div className={styles.tarjetaBody}>
                <label className={styles.label}>Workspace:</label>
                <select
                  className={styles.select}
                  value={notionWorkspace}
                  onChange={(e) => setNotionWorkspace(e.target.value)}
                >
                  <option value="">Selecciona un workspace</option>
                  {state.conexiones.notion.workspacesDisponibles.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>

                <label className={styles.label}>Base de datos:</label>
                <select className={styles.select} value={notionBase} onChange={(e) => setNotionBase(e.target.value)}>
                  <option value="">Selecciona una base</option>
                  {state.conexiones.notion.basesDisponibles.map((base) => (
                    <option key={base} value={base}>
                      {base}
                    </option>
                  ))}
                </select>

                <button
                  className={styles.botonSecundario}
                  onClick={probarNotion}
                  disabled={!notionWorkspace || !notionBase}
                >
                  Probar escritura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Configurar plantilla */}
        {pasoActual === 2 && (
          <div className={styles.paso}>
            <h2 className={styles.subtitulo}>
              <FileText size={24} />
              Configurar plantilla
            </h2>
            <p className={styles.descripcion}>Define cómo quieres que se documenten las decisiones técnicas.</p>

            <div className={styles.tarjeta}>
              <div className={styles.tarjetaBody}>
                <label className={styles.label}>Idioma:</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radio}>
                    <input type="radio" checked={idioma === "es"} onChange={() => setIdioma("es")} />
                    <span>Español</span>
                  </label>
                  <label className={styles.radio}>
                    <input type="radio" checked={idioma === "en"} onChange={() => setIdioma("en")} />
                    <span>English</span>
                  </label>
                </div>

                <label className={styles.label}>Tipo de plantilla:</label>
                <select
                  className={styles.select}
                  value={tipoPlantilla}
                  onChange={(e) => setTipoPlantilla(e.target.value)}
                >
                  {state.configPlantilla.tiposDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>

                <div className={styles.preview}>
                  <h4>Vista previa:</h4>
                  <div className={styles.previewContent}>
                    <p>
                      <strong>Contexto:</strong> El monolito actual dificulta el escalado independiente de servicios
                    </p>
                    <p>
                      <strong>Decisión:</strong> Migrar gradualmente a microservicios usando Docker y Kubernetes
                    </p>
                    <p>
                      <strong>Consecuencias:</strong> Mayor complejidad operacional pero mejor escalabilidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Revisar y activar */}
        {pasoActual === 3 && (
          <div className={styles.paso}>
            <h2 className={styles.subtitulo}>
              <Check size={24} />
              Revisar y activar
            </h2>
            <p className={styles.descripcion}>Configura las reglas de captura y activa Infera.</p>

            <div className={styles.tarjeta}>
              <div className={styles.tarjetaBody}>
                <label className={styles.label}>Palabras clave (separadas por coma):</label>
                <input
                  type="text"
                  className={styles.input}
                  value={palabrasClave.join(", ")}
                  onChange={(e) => setPalabrasClave(e.target.value.split(",").map((p) => p.trim()))}
                  placeholder="arquitectura, decisión, RFC, ADR"
                />

                <label className={styles.label}>Umbral de confianza: {umbralConfianza.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.1"
                  value={umbralConfianza}
                  onChange={(e) => setUmbralConfianza(Number.parseFloat(e.target.value))}
                  className={styles.slider}
                />

                <label className={styles.checkbox}>
                  <input type="checkbox" checked={pesoTechLeads} onChange={(e) => setPesoTechLeads(e.target.checked)} />
                  <span>Dar más peso a Tech Leads y Arquitectos</span>
                </label>

                <div className={styles.resumen}>
                  <h4>Resumen de configuración:</h4>
                  <ul>
                    <li>
                      <strong>Fuentes:</strong> {state.conexiones.slack.conectado && "Slack"}{" "}
                      {state.conexiones.github.conectado && "GitHub"} → Notion
                    </li>
                    <li>
                      <strong>Idioma:</strong> {idioma === "es" ? "Español" : "English"}
                    </li>
                    <li>
                      <strong>Plantilla:</strong> {tipoPlantilla}
                    </li>
                    <li>
                      <strong>Umbral:</strong> {umbralConfianza.toFixed(1)}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className={styles.navegacion}>
          {pasoActual > 1 && (
            <button className={styles.botonSecundario} onClick={pasoAnterior}>
              <ChevronLeft size={20} />
              Anterior
            </button>
          )}
          {pasoActual < 3 ? (
            <button className={styles.botonPrimario} onClick={siguientePaso}>
              Siguiente
              <ChevronRight size={20} />
            </button>
          ) : (
            <button className={styles.botonPrimario} onClick={finalizarOnboarding}>
              Empezar a capturar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
