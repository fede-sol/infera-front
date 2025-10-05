const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000'

function resolveBaseUrl(baseUrl) {
  return baseUrl ?? DEFAULT_BASE_URL
}

function buildHeaders(token, contentType) {
  if (!token) {
    throw new Error('Se requiere un token Bearer para autenticar la solicitud')
  }

  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)

  if (contentType) {
    headers.append('Content-Type', contentType)
  }

  return headers
}

function normalizeBody(payload) {
  if (payload === undefined || payload === null) {
    return undefined
  }

  return typeof payload === 'string' ? payload : JSON.stringify(payload)
}

async function parseResponseBody(response) {
  try {
    return await response.clone().json()
  } catch (_) {
    try {
      const text = await response.text()

      if (!text) {
        return null
      }

      try {
        return JSON.parse(text)
      } catch (_) {
        return text
      }
    } catch (_) {
      return null
    }
  }
}

async function handleResponse(response) {
  const parsed = await parseResponseBody(response)

  if (response.ok) {
    return {
      success: true,
      status: response.status,
      data: parsed
    }
  }

  const errorPayload = parsed ?? response.statusText ?? 'Error desconocido'

  return {
    success: false,
    status: response.status,
    error: errorPayload
  }
}

async function inferaRequest({
  path,
  method = 'GET',
  token,
  contentType,
  body,
  baseUrl,
  signal
}) {
  const headers = buildHeaders(token, contentType ?? (body ? 'application/json' : undefined))

  const requestInit = {
    method,
    headers,
    redirect: 'follow',
    signal
  }

  if (body !== undefined) {
    requestInit.body = body
  }

  const url = `${resolveBaseUrl(baseUrl)}${path}`

  const response = await fetch(url, requestInit)

  return handleResponse(response)
}

export async function getNotionDatabases({
  token,
  message,
  baseUrl,
  signal
} = {}) {
  const body = normalizeBody(message)

  return inferaRequest({
    path: '/notion/databases',
    token,
    baseUrl,
    signal,
    contentType: 'text/plain',
    body
  })
}

export async function getSlackChannels({
  token,
  message,
  baseUrl,
  signal
} = {}) {
  const body = normalizeBody(message)

  return inferaRequest({
    path: '/slack/channels',
    token,
    baseUrl,
    signal,
    contentType: 'text/plain',
    body
  })
}

export async function createSmartSlackAssociations({
  token,
  notionDatabaseIdExternal,
  slackChannelIdsExternal,
  baseUrl,
  signal
} = {}) {
  const payload = {
    notion_database_id_external: notionDatabaseIdExternal,
    slack_channel_ids_external: slackChannelIdsExternal
  }

  return inferaRequest({
    path: '/slack/associations/smart',
    method: 'POST',
    token,
    baseUrl,
    signal,
    contentType: 'application/json',
    body: normalizeBody(payload)
  })
}

export async function getSlackAssociations({
  token,
  filters,
  baseUrl,
  signal
} = {}) {
  const body = normalizeBody(filters)

  return inferaRequest({
    path: '/slack/associations',
    token,
    baseUrl,
    signal,
    contentType: 'text/plain',
    body
  })
}

export async function deleteSlackAssociation({
  token,
  associationId,
  baseUrl,
  signal
} = {}) {
  if (!associationId) {
    throw new Error('Se requiere el identificador de la asociación a eliminar')
  }

  return inferaRequest({
    path: `/slack/associations/${associationId}`,
    method: 'DELETE',
    token,
    baseUrl,
    signal
  })
}

export async function getAuthenticatedUser({
  token,
  baseUrl,
  signal
} = {}) {
  return inferaRequest({
    path: '/auth/me',
    token,
    baseUrl,
    signal
  })
}

export const getDashboardStats = ({ token, baseUrl, signal } = {}) =>
  inferaRequest({
    path: '/stats/dashboard',
    token,
    baseUrl,
    signal
  })

export const getRecentMessages = ({ token, baseUrl, signal } = {}) =>
  inferaRequest({
    path: '/stats/recent-messages',
    token,
    baseUrl,
    signal
  })

export async function updateAuthCredentials({
  token,
  githubToken,
  slackToken,
  notionToken,
  baseUrl,
  signal
} = {}) {
  const payload = {
    ...(githubToken !== undefined ? { github_token: githubToken } : {}),
    ...(slackToken !== undefined ? { slack_token: slackToken } : {}),
    ...(notionToken !== undefined ? { notion_token: notionToken } : {})
  }

  return inferaRequest({
    path: '/auth/credentials',
    method: 'PUT',
    token,
    baseUrl,
    signal,
    contentType: 'application/json',
    body: normalizeBody(payload)
  })
}


