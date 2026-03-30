import { useMemo, useState } from 'react'
import { useAppStore } from '../context/AppStore'

export default function CompaniesPage() {
  const { state, actions } = useAppStore()
  const [companyId, setCompanyId] = useState(state.companies[0]?.id)
  const [missionTitle, setMissionTitle] = useState('')

  const selectedCompany = useMemo(
    () => state.companies.find((company) => company.id === companyId),
    [companyId, state.companies],
  )

  const handleAddMission = (event) => {
    event.preventDefault()
    if (!missionTitle.trim()) {
      return
    }
    actions.addCompanyMission({ companyId, title: missionTitle.trim() })
    setMissionTitle('')
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Une page par entreprise</h2>
        <p>
          Missions dynamiques, stats de recrutement et suivi de placement via plateforme.
        </p>
      </div>

      <div className="switches">
        {state.companies.map((company) => (
          <button
            key={company.id}
            type="button"
            className={company.id === companyId ? 'chip active' : 'chip'}
            onClick={() => setCompanyId(company.id)}
          >
            {company.name}
          </button>
        ))}
      </div>

      <article className="card focusCard">
        <div className="cardTitleLine">
          <h3>{selectedCompany?.name}</h3>
          <button
            type="button"
            className="ghostBtn"
            onClick={() => actions.toggleFavorite('companies', selectedCompany.id)}
          >
            {state.favorites.companies.includes(selectedCompany?.id)
              ? 'Retirer favori'
              : 'Favori'}
          </button>
        </div>
        <p>Region: {selectedCompany?.region}</p>
        <p>
          En poste actuellement grace a la plateforme:{' '}
          <strong>{selectedCompany?.activeEmployeesFromPlatform}</strong>
        </p>
        <p>
          En poste auparavant via la plateforme:{' '}
          <strong>{selectedCompany?.formerEmployeesFromPlatform}</strong>
        </p>
      </article>

      <div className="subSection">
        <h3>Missions proposees par l'entreprise</h3>
        <form className="formRow" onSubmit={handleAddMission}>
          <input
            value={missionTitle}
            onChange={(event) => setMissionTitle(event.target.value)}
            placeholder="Nouvelle mission"
          />
          <button className="primaryBtn" type="submit">
            Ajouter mission
          </button>
        </form>
        <div className="inlineCards">
          {selectedCompany?.openMissions.map((mission) => (
            <article className="compactCard" key={mission.id}>
              <span>{mission.title}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
