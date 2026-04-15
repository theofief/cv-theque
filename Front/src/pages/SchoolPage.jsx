import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function SchoolPage() {
  const { schoolName } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setError('')
        const response = await fetch(`/api/schools/${encodeURIComponent(schoolName ?? '')}`)
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Ecole introuvable')
        }

        if (active) {
          setData(payload)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Erreur')
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [schoolName])

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!data) {
    return <div className="card border-0 shadow-sm surface-card"><div className="card-body">Chargement...</div></div>
  }

  return (
    <section className="card border-0 shadow-sm surface-card legal-page">
      <div className="card-body p-4 p-lg-5 d-grid gap-4">
        <div>
          <h1 className="h2 mb-1">{data.name}</h1>
          <p className="text-secondary mb-0">Page ecole generee automatiquement</p>
        </div>

        <div className="row g-3">
          <div className="col-md-4"><div className="profile-fact"><span className="profile-fact-label">Eleves</span><strong className="profile-fact-value">{data.studentsCount}</strong></div></div>
          <div className="col-md-4"><div className="profile-fact"><span className="profile-fact-label">Profils en vue</span><strong className="profile-fact-value">{data.featuredCount}</strong></div></div>
          <div className="col-md-4"><div className="profile-fact"><span className="profile-fact-label">Age moyen</span><strong className="profile-fact-value">{data.averageAge}</strong></div></div>
        </div>

        <div>
          <h2 className="h5 mb-2">Entreprises partenaires</h2>
          <div className="d-grid gap-2">
            {data.companies.length ? data.companies.map((company) => (
              <Link key={company.name} to={`/companies/${encodeURIComponent(company.name)}`} className="text-decoration-none">
                {company.name} ({company.studentsCount})
              </Link>
            )) : <p className="text-secondary mb-0">Aucune entreprise liee.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
