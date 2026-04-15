import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function StudentsToolbar({
  filters,
  availableSkills,
  availableTechnologies,
  onFilterChange,
  onReset,
  onCreate,
}) {
  const { isAuthenticated, user } = useAuth()

  return (
    <section className="card border-0 shadow-sm surface-card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
          <div>
            <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
              Recherche intelligente
            </span>
            <h2 className="h3 mt-2 mb-2">Explorer les profils disponibles</h2>
            <p className="text-secondary mb-0">
              Filtrez par nom, niveau, compétence ou technologie.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2">
            {isAuthenticated ? (
              <span className="btn btn-outline-dark rounded-pill px-4 disabled">
                {user?.profileType === 'school' ? 'Profil ecole' : user?.profileType === 'company' ? 'Profil entreprise' : 'Profil student'}
                {user?.isAdmin ? ' · admin' : ''}
              </span>
            ) : (
              <Link to="/auth" className="btn btn-outline-dark rounded-pill px-4 text-decoration-none">
                Connexion / Inscription
              </Link>
            )}
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onReset}>
              Reinitialiser
            </button>
            <button type="button" className="btn btn-warning rounded-pill px-4" onClick={onCreate}>
              Ajouter un profil
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl">
            <label className="form-label fw-semibold">Recherche</label>
            <input
              className="form-control"
              value={filters.query}
              onChange={(event) => onFilterChange('query', event.target.value)}
              placeholder="Prenom, nom ou localisation"
            />
          </div>

          <div className="col-12 col-md-6 col-xl">
            <label className="form-label fw-semibold">Niveau</label>
            <select
              className="form-select"
              value={filters.skillLevel}
              onChange={(event) => onFilterChange('skillLevel', event.target.value)}
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Debutant</option>
              <option value="intermediate">Intermediaire</option>
              <option value="advanced">Avance</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl">
            <label className="form-label fw-semibold">Competence</label>
            <select
              className="form-select"
              value={filters.skillName}
              onChange={(event) => onFilterChange('skillName', event.target.value)}
            >
              <option value="all">Toutes les compétences</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl">
            <label className="form-label fw-semibold">Technologie</label>
            <select
              className="form-select"
              value={filters.technology}
              onChange={(event) => onFilterChange('technology', event.target.value)}
            >
              <option value="all">Toutes les technologies</option>
              {availableTechnologies.map((technology) => (
                <option key={technology} value={technology}>
                  {technology}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl">
            <label className="form-label fw-semibold">Trier par</label>
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(event) => onFilterChange('sortBy', event.target.value)}
            >
              <option value="featured">Priorité éditoriale</option>
              <option value="name">Nom</option>
              <option value="location">Localisation</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
