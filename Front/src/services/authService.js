const TOKEN_KEY = 'gott.jwt'
const USER_KEY = 'gott.user'

function getToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

function setUser(user) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function getUser() {
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}

async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data?.error ?? 'Echec de connexion')
  }

  if (!data?.token) {
    throw new Error('Token JWT non recu')
  }

  setToken(data.token)
  if (data.user) {
    setUser(data.user)
  }
  return data
}

async function register(payload) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data?.error ?? 'Echec de creation de compte')
  }

  if (!data?.token) {
    throw new Error('Token JWT non recu')
  }

  setToken(data.token)
  if (data.user) {
    setUser(data.user)
  }

  return data
}

async function fetchMe() {
  const token = getToken()
  if (!token) {
    return null
  }

  const response = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    clearToken()
    return null
  }

  const data = await response.json()
  if (data?.user) {
    setUser(data.user)
  }

  return data?.user ?? null
}

export const authService = {
  login,
  register,
  fetchMe,
  getToken,
  setToken,
  getUser,
  setUser,
  clearToken,
  isAuthenticated() {
    return Boolean(getToken())
  },
}
