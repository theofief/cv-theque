import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function CompanyPage() {
  const { companyName } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setError('')
        const response = await fetch(`/api/companies/${encodeURIComponent(companyName ?? '')}`)
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Entreprise introuvable')
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
  }, [companyName])

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
          <p className="text-secondary mb-0">Page entreprise generee automatiquement</p>
        </div>

        <div className="row g-3">
          <div className="col-md-6"><div className="profile-fact"><span className="profile-fact-label">Eleves presents</span><strong className="profile-fact-value">{data.studentsCount}</strong></div></div>
          <div className="col-md-6"><div className="profile-fact"><span className="profile-fact-label">Profils en vue</span><strong className="profile-fact-value">{data.featuredCount}</strong></div></div>
        </div>

        <div>
          <h2 className="h5 mb-2">Ecoles representees</h2>
          <div className="d-grid gap-2">
            {data.schools.length ? data.schools.map((school) => (
              <Link key={school.name} to={`/schools/${encodeURIComponent(school.name)}`} className="text-decoration-none">
                {school.name} ({school.studentsCount})
              </Link>
            )) : <p className="text-secondary mb-0">Aucune ecole liee.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
