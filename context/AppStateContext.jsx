"use client"
import { createContext, useContext, useReducer, useEffect } from "react"

// Estado inicial con datos mock
const EstadoInicial = {
  // Configuración de integraciones con tokens
  integraciones: {
    github: {
      conectado: false,
      token: "",
    },
    slack: {
      conectado: false,
      token: "",
      workspace: "Equipo Demo",
      canalesDisponibles: ["#arquitectura", "#backend", "#producto", "#frontend", "#devops"],
    },
    notion: {
      conectado: false,
      token: "",
      basesDisponibles: ["Decisiones Técnicas", "ADRs", "Changelog", "Documentación"],
    },
  },

  // Configuración de asociaciones canal-BD
  asociaciones: [
    {
      id: "assoc-1",
      canal: "#arquitectura",
      baseDatos: "Decisiones Técnicas",
    },
  ],

  // Configuración de conexiones (legacy - mantener por compatibilidad)
  conexiones: {
    slack: {
      conectado: false,
      canales: [],
      canalesDisponibles: ["#arquitectura", "#backend", "#producto", "#frontend"],
      soloPublicos: true,
    },
    github: {
      conectado: false,
      repos: [],
      reposDisponibles: ["org/core", "org/webapp", "org/ml", "org/mobile"],
      incluirCommits: true,
      incluirPRs: true,
    },
    notion: {
      conectado: false,
      workspace: "",
      workspacesDisponibles: ["Equipo Infera", "Documentación Técnica"],
      base: "",
      basesDisponibles: ["Decisiones", "ADRs", "Changelog"],
      ultimaPruebaOk: false,
    },
  },

  // Configuración de plantillas y salida
  configPlantilla: {
    idioma: "es",
    tipo: "ADR",
    tiposDisponibles: ["ADR breve", "Changelog de decisiones", "Doc API/Componente"],
    notion: {
      baseDatos: "Decisiones",
      campos: {
        titulo: "Título",
        tipo: "Tipo",
        fecha: "Fecha",
        repositorio: "Repositorio",
        canal: "Canal",
      },
    },
    umbralConfianza: 0.8,
    pesoTechLeads: true,
    palabrasClave: ["arquitectura", "decisión", "RFC", "ADR"],
  },

  // Decisiones capturadas (mock inicial)
  decisiones: [
    {
      id: "1",
      titulo: "Migración a arquitectura de microservicios",
      fuente: "slack",
      canal: "#arquitectura",
      score: 0.91,
      estado: "created",
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notionUrl: "https://notion.so/fake-demo-1",
      preview:
        "Se decidió migrar el monolito actual a una arquitectura de microservicios usando Docker y Kubernetes para mejorar la escalabilidad y autonomía de los equipos.",
      contenido: {
        contexto: "El monolito actual dificulta el escalado independiente de servicios",
        decision: "Migrar gradualmente a microservicios usando Docker y Kubernetes",
        consecuencias: "Mayor complejidad operacional pero mejor escalabilidad",
      },
    },
    {
      id: "2",
      titulo: "Adopción de TypeScript en frontend",
      fuente: "github",
      repo: "org/webapp",
      score: 0.87,
      estado: "updated",
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notionUrl: "https://notion.so/fake-demo-2",
      preview:
        "El equipo acordó migrar gradualmente el codebase de JavaScript a TypeScript para reducir errores de tipo en runtime y mejorar la experiencia de desarrollo.",
      contenido: {
        contexto: "Errores de tipo en runtime causan bugs en producción",
        decision: "Migrar codebase de JavaScript a TypeScript",
        consecuencias: "Mejor DX y menos bugs, pero requiere tiempo de migración",
      },
    },
    {
      id: "3",
      titulo: "Implementación de cache distribuido con Redis",
      fuente: "slack",
      canal: "#backend",
      score: 0.72,
      estado: "created",
      fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notionUrl: "https://notion.so/fake-demo-3",
      preview:
        "Para reducir la latencia causada por queries repetitivas a la base de datos, se implementará Redis como capa de cache distribuido.",
      contenido: {
        contexto: "Queries repetitivas a la DB causan latencia alta",
        decision: "Implementar Redis como capa de cache",
        consecuencias: "Reducción de latencia pero mayor complejidad de invalidación",
      },
    },
  ],

  // Log de actividad
  actividad: [
    {
      id: "a1",
      tipo: "creado",
      mensaje: 'Decisión "Migración a arquitectura de microservicios" creada en Notion',
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "a2",
      tipo: "actualizado",
      mensaje: 'Decisión "Adopción de TypeScript en frontend" actualizada en Notion',
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "a3",
      tipo: "capturado",
      mensaje: 'Nueva decisión "Implementación de cache distribuido con Redis" capturada desde Slack',
      fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

// Reducer para manejar todas las acciones del estado global
function reducer(state, action) {
  switch (action.type) {
    case "GUARDAR_TOKEN":
      return {
        ...state,
        integraciones: {
          ...state.integraciones,
          [action.payload.servicio]: {
            ...state.integraciones[action.payload.servicio],
            conectado: true,
            token: action.payload.token,
          },
        },
      }

    case "AGREGAR_ASOCIACION":
      return {
        ...state,
        asociaciones: [
          ...state.asociaciones,
          {
            id: `assoc-${Date.now()}`,
            canal: action.payload.canal,
            baseDatos: action.payload.baseDatos,
          },
        ],
      }

    case "ELIMINAR_ASOCIACION":
      return {
        ...state,
        asociaciones: state.asociaciones.filter((a) => a.id !== action.payload),
      }

    // Conexiones (legacy)
    case "TOGGLE_CONEXION":
      return {
        ...state,
        conexiones: {
          ...state.conexiones,
          [action.payload.fuente]: {
            ...state.conexiones[action.payload.fuente],
            conectado: !state.conexiones[action.payload.fuente].conectado,
          },
        },
      }

    case "GUARDAR_CONEXION":
      return {
        ...state,
        conexiones: {
          ...state.conexiones,
          [action.payload.fuente]: {
            ...state.conexiones[action.payload.fuente],
            ...action.payload.datos,
          },
        },
      }

    // Plantillas
    case "SET_PLANTILLA":
      return {
        ...state,
        configPlantilla: {
          ...state.configPlantilla,
          ...action.payload,
        },
      }

    // Decisiones
    case "PUSH_DECISIONES":
      return {
        ...state,
        decisiones: [...action.payload, ...state.decisiones],
      }

    case "APROBAR_DECISION":
      return {
        ...state,
        decisiones: state.decisiones.map((d) =>
          d.id === action.payload
            ? { ...d, estado: "updated", notionUrl: d.notionUrl || "https://notion.so/fake-approved" }
            : d,
        ),
      }

    case "EDITAR_Y_APROBAR_DECISION":
      return {
        ...state,
        decisiones: state.decisiones.map((d) =>
          d.id === action.payload.id
            ? {
                ...d,
                preview: action.payload.contenido,
                estado: "updated",
                notionUrl: d.notionUrl || "https://notion.so/fake-edited-approved",
              }
            : d,
        ),
      }

    case "DESCARTAR_DECISION":
      return {
        ...state,
        decisiones: state.decisiones.filter((d) => d.id !== action.payload),
      }

    case "ACTUALIZAR_DECISION":
      return {
        ...state,
        decisiones: state.decisiones.map((d) => (d.id === action.payload.id ? { ...d, ...action.payload.datos } : d)),
      }

    // Actividad
    case "LOG_EVENTO":
      return {
        ...state,
        actividad: [
          {
            id: `a${Date.now()}`,
            tipo: action.payload.tipo,
            mensaje: action.payload.mensaje,
            fecha: action.payload.fecha || new Date().toISOString(),
          },
          ...state.actividad,
        ],
      }

    default:
      return state
  }
}

// Contexto
const AppStateContext = createContext(undefined)

// Hook personalizado para usar el contexto
export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState debe usarse dentro de AppStateProvider")
  }
  return context
}

// Provider del contexto
export default function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, EstadoInicial)

  // Opcional: sincronizar con localStorage
  useEffect(() => {
    const estadoGuardado = localStorage.getItem("infera-state")
    if (estadoGuardado) {
      try {
        const parsed = JSON.parse(estadoGuardado)
        // Restaurar solo configuraciones, no datos mock
        if (parsed.configPlantilla) {
          dispatch({ type: "SET_PLANTILLA", payload: parsed.configPlantilla })
        }
      } catch (error) {
        console.error("[v0] Error al cargar estado:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Guardar solo configuraciones relevantes
    const estadoParaGuardar = {
      configPlantilla: state.configPlantilla,
    }
    localStorage.setItem("infera-state", JSON.stringify(estadoParaGuardar))
  }, [state.configPlantilla])

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}
