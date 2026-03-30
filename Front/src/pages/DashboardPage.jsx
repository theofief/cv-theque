import { useAppStore } from '../context/AppStore'

export default function DashboardPage() {
  const { selectors } = useAppStore()
  const company = selectors.companyFocus

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Dashboard entreprise</h2>
        <p>
          Vue KPI dynamique basee sur l'entreprise selectionnee dans le header global.
        </p>
      </div>

      <article className="card focusCard">
        <h3>{company?.name}</h3>
        <p>Region: {company?.region}</p>
        <p>
          En poste actuellement grace a la plateforme:{' '}
          <strong>{company?.activeEmployeesFromPlatform}</strong>
        </p>
        <p>
          En poste auparavant via la plateforme:{' '}
          <strong>{company?.formerEmployeesFromPlatform}</strong>
        </p>
      </article>

      <div className="statGrid">
        <article className="statCard">
          <span>Candidatures</span>
          <strong>{company?.dashboard.applications}</strong>
        </article>
        <article className="statCard">
          <span>Entretiens</span>
          <strong>{company?.dashboard.interviews}</strong>
        </article>
        <article className="statCard">
          <span>Acceptations</span>
          <strong>{company?.dashboard.accepted}</strong>
        </article>
        <article className="statCard">
          <span>Conversion</span>
          <strong>{company?.dashboard.conversionRate}</strong>
        </article>
      </div>
    </section>
  )
}
