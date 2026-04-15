async function getList(path) {
  const response = await fetch(path)
  const text = await response.text()
  const data = text ? JSON.parse(text) : []

  if (!response.ok) {
    throw new Error('Impossible de charger le catalogue')
  }

  return Array.isArray(data) ? data : []
}

export const catalogService = {
  getSchools() {
    return getList('/api/catalog/schools')
  },
  getCompanies() {
    return getList('/api/catalog/companies')
  },
}
