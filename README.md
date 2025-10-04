# Infera MVP

Aplicación MVP para capturar decisiones técnicas desde Slack/GitHub y publicar resúmenes en Notion.

## Características

- **Dashboard**: Vista general con estado de conexiones, métricas y últimas decisiones
- **Conexiones**: Configuración de integraciones con Slack, GitHub y Notion (mock)
- **Plantillas**: Configuración de plantillas ADR y mapeo de campos a Notion
- **Revisión**: Aprobar, editar o descartar decisiones antes de publicar
- **Actividad**: Log completo de todas las acciones del sistema

## Tecnologías

- Next.js 14 (App Router)
- React 18 (sin TypeScript)
- CSS Modules para estilos de componentes
- React Context + useReducer para estado global
- react-hot-toast para notificaciones
- lucide-react para iconos

## Modo Demo

Esta aplicación funciona completamente en **modo demo** sin necesidad de configuración externa:

- ✅ Sin variables de entorno requeridas
- ✅ Sin bases de datos
- ✅ Sin SDKs externos
- ✅ Datos mock en memoria
- ✅ Todas las integraciones simuladas

## Instalación y Ejecución

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
\`\`\`

## Verificación

1. **Health Check**: Visita `/api/health` → debe retornar `{ ok: true }`
2. **Dashboard**: Navega a `/` → verás el dashboard con datos mock
3. **Sincronización**: Click en "Forzar sincronización" → se agregan nuevas decisiones
4. **Navegación**: Prueba todas las páginas desde el sidebar

## Estructura del Proyecto

\`\`\`
app/
├── (auth)/              # Páginas de autenticación (login/registro)
├── (dashboard)/         # Páginas del dashboard
│   ├── page.jsx        # Dashboard principal
│   ├── connections/    # Configuración de conexiones
│   ├── templates/      # Configuración de plantillas
│   ├── review/         # Revisión de decisiones
│   ├── activity/       # Log de actividad
│   └── onboarding/     # Wizard de onboarding
├── api/                # API routes mock
│   ├── decisions/      # CRUD de decisiones
│   ├── test-notion/    # Test de conexión Notion
│   └── health/         # Health check
└── layout.jsx          # Layout principal

components/
├── Sidebar.jsx         # Navegación lateral
└── Topbar.jsx          # Barra superior con búsqueda y sync

context/
└── AppStateContext.jsx # Estado global con React Context + useReducer
\`\`\`

## Estado Global

El estado se maneja con React Context + useReducer (sin Zustand):

- **conexiones**: Estado de Slack, GitHub y Notion
- **configPlantilla**: Configuración de idioma, tipo y mapeo Notion
- **decisiones**: Array de decisiones capturadas
- **actividad**: Log de eventos del sistema

## Acciones Disponibles

- `TOGGLE_CONEXION`: Conectar/desconectar fuentes
- `GUARDAR_CONEXION`: Guardar configuración de conexión
- `SET_PLANTILLA`: Actualizar configuración de plantilla
- `PUSH_DECISIONES`: Agregar nuevas decisiones
- `APROBAR_DECISION`: Aprobar y publicar decisión
- `EDITAR_Y_APROBAR_DECISION`: Editar contenido y aprobar
- `DESCARTAR_DECISION`: Eliminar decisión
- `LOG_EVENTO`: Registrar evento en actividad

## Datos Mock

La aplicación incluye:
- 3 decisiones iniciales con diferentes estados
- 3 eventos en el log de actividad
- Métricas de los últimos 7 días
- Canales y repositorios disponibles para conectar

## Próximos Pasos (Producción)

Para convertir esto en una aplicación real:

1. Reemplazar datos mock con APIs reales
2. Implementar autenticación real (NextAuth con OAuth)
3. Conectar con SDKs de Slack, GitHub y Notion
4. Agregar base de datos (PostgreSQL/MongoDB)
5. Implementar procesamiento de lenguaje natural para scoring
6. Agregar tests unitarios e integración

## Licencia

MIT
