"use client"
import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { FileText, Save, Eye } from "lucide-react"
import toast from "react-hot-toast"
import styles from "./templates.module.css"

const idiomas = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
]

const tiposPlantilla = [
  { value: "ADR", label: "ADR breve" },
  { value: "Changelog", label: "Changelog de decisiones" },
  { value: "DocAPI", label: "Doc API/Componente" },
]

const camposNotion = [
  { key: "titulo", label: "Título", default: "Título" },
  { key: "tipo", label: "Tipo", default: "Tipo" },
  { key: "fecha", label: "Fecha", default: "Fecha" },
  { key: "repositorio", label: "Repositorio", default: "Repositorio" },
  { key: "canal", label: "Canal", default: "Canal" },
]

export default function TemplatesPage() {
  const { state, dispatch } = useAppState()
  const [idioma, setIdioma] = useState(state.configPlantilla.idioma)
  const [tipo, setTipo] = useState(state.configPlantilla.tipo)
  const [baseDatos, setBaseDatos] = useState(state.configPlantilla.notion.baseDatos)
  const [campos, setCampos] = useState(state.configPlantilla.notion.campos)
  const [mostrarPreview, setMostrarPreview] = useState(false)

  const handleGuardar = () => {
    dispatch({
      type: "SET_PLANTILLA",
      payload: {
        idioma,
        tipo,
        notion: { baseDatos, campos },
      },
    })
    toast.success("Configuración de plantilla guardada")
  }

  const adrMock = {
    titulo: "Migración a arquitectura de microservicios",
    contexto: "El monolito actual dificulta el escalado independiente de servicios y ralentiza los despliegues.",
    decision: "Migrar gradualmente a una arquitectura de microservicios, comenzando por el módulo de autenticación.",
    consecuencias: "Mayor complejidad operacional pero mejor escalabilidad y autonomía de equipos.",
    links: ["#arquitectura (Slack)", "org/core#PR-234 (GitHub)"],
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Plantillas y Salida</h1>
          <p className={styles.subtitle}>Configura cómo se generan y publican las decisiones</p>
        </div>
        <button className={styles.previewButton} onClick={() => setMostrarPreview(!mostrarPreview)}>
          <Eye size={18} />
          {mostrarPreview ? "Ocultar" : "Vista previa"}
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FileText size={20} />
            Configuración de Plantilla
          </h2>

          <div className={styles.formGroup}>
            <label>Idioma de salida</label>
            <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              {idiomas.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tipo de plantilla</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {tiposPlantilla.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Base de datos Notion</label>
            <input
              type="text"
              value={baseDatos}
              onChange={(e) => setBaseDatos(e.target.value)}
              placeholder="Nombre de la base de datos"
            />
          </div>

          <h3 className={styles.subsectionTitle}>Mapeo de campos</h3>
          {camposNotion.map((campo) => (
            <div key={campo.key} className={styles.formGroup}>
              <label>{campo.label}</label>
              <input
                type="text"
                value={campos[campo.key] || campo.default}
                onChange={(e) => setCampos({ ...campos, [campo.key]: e.target.value })}
                placeholder={campo.default}
              />
            </div>
          ))}

          <button className={styles.saveButton} onClick={handleGuardar}>
            <Save size={18} />
            Guardar configuración
          </button>
        </div>

        {mostrarPreview && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Vista previa ADR</h2>
            <div className={styles.preview}>
              <h3>{adrMock.titulo}</h3>

              <div className={styles.previewSection}>
                <h4>Contexto</h4>
                <p>{adrMock.contexto}</p>
              </div>

              <div className={styles.previewSection}>
                <h4>Decisión</h4>
                <p>{adrMock.decision}</p>
              </div>

              <div className={styles.previewSection}>
                <h4>Consecuencias</h4>
                <p>{adrMock.consecuencias}</p>
              </div>

              <div className={styles.previewSection}>
                <h4>Links</h4>
                <ul>
                  {adrMock.links.map((link, i) => (
                    <li key={i}>{link}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
