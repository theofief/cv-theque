const API_URL = '/api/students'

async function request(path = '', options = {}) {
  const token = window.localStorage.getItem('gott.jwt')
  const method = options.method ?? 'GET'
  const requiresAuth = method !== 'GET'

  if (requiresAuth && !token) {
    throw new Error('Connexion admin requise pour modifier les profils.')
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.error ?? 'Erreur API'
    throw new Error(message)
  }

  return data
}

export const studentsService = {
  async getAll() {
    return request('')
  },

  async create(student) {
    return request('', {
      method: 'POST',
      body: JSON.stringify(student),
    })
  },

  async update(studentId, studentData) {
    return request(`/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    })
  },

  async remove(studentId) {
    await request(`/${studentId}`, {
      method: 'DELETE',
    })
    return studentId
  },
}
