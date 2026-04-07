import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../context/useAppStore'

export default function AppLayout() {
  const { state, actions, selectors } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="appShell">
      <header className="heroBanner">
        <div>
          <p className="eyebrow">CVTHEQUE</p>
          <h1>Plateforme ecoles, etudiants et entreprises</h1>
          <p>
            Front structure pour une integration backend directe: listes dynamiques,
            formulaires metier, workflows de moderation et dashboard.
          </p>
        </div>

        <div className="heroControls">
          <div className="topActions">
            <button
              type="button"
              className={location.pathname === '/' ? 'ghostBtn activeTop' : 'ghostBtn'}
              onClick={() => navigate('/')}
            >
              Accueil
            </button>
            <button
              type="button"
              className={
                location.pathname === '/profile' ? 'primaryBtn activeTop' : 'primaryBtn'
              }
              onClick={() => navigate('/profile')}
            >
              Mon profil
            </button>
          </div>

          <label>
            Role actif
            <select
              value={state.session.role}
              onChange={(event) => actions.setRole(event.target.value)}
            >
              <option value="guest">Invite</option>
              <option value="student">Etudiant</option>
              <option value="company">Entreprise</option>
              <option value="school">Ecole</option>
              <option value="prof">Professeur</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>
            Entreprise focus
            <select
              value={state.session.companyFocusId}
              onChange={(event) => actions.setCompanyFocus(event.target.value)}
            >
              {state.companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="toolbar">
        <div className="filters">
          <label>
            Region
            <select
              value={state.session.filters.region}
              onChange={(event) => actions.setFilter('region', event.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="Ile-de-France">Ile-de-France</option>
              <option value="Hauts-de-France">Hauts-de-France</option>
              <option value="Auvergne-Rhone-Alpes">Auvergne-Rhone-Alpes</option>
            </select>
          </label>

          <label>
            Skill
            <select
              value={state.session.filters.skill}
              onChange={(event) => actions.setFilter('skill', event.target.value)}
            >
              <option value="all">Toutes</option>
              {selectors.allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </label>

          <label>
            Age
            <select
              value={state.session.filters.ageRange}
              onChange={(event) => actions.setFilter('ageRange', event.target.value)}
            >
              <option value="all">Tous</option>
              <option value="18-22">18-22</option>
              <option value="23-26">23-26</option>
            </select>
          </label>

          <label>
            Contrat
            <select
              value={state.session.filters.contract}
              onChange={(event) => actions.setFilter('contract', event.target.value)}
            >
              <option value="all">Tous</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
            </select>
          </label>
        </div>

        <div className="statusBox">
          <strong>Apercu plateforme</strong>
          <span>{selectors.filteredStudents.length} profils visibles apres filtres</span>
          <span>{state.offers.length} offres actives</span>
          <small>Vue adaptee automatiquement selon le role actif</small>
        </div>
      </section>

      <main className="contentArea">
        <Outlet />
      </main>
    </div>
  )
}
