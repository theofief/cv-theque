import { useAppStore } from '../context/AppStore'

export default function GuestPage() {
  const { selectors } = useAppStore()

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Espace invite</h2>
        <p>
          Consultation complete des profils, offres et statistiques sans interaction
          de publication.
        </p>
      </div>

      <article className="card focusCard readonly">
        <h3>Acces de consultation</h3>
        <p>
          Cette vue est ideale pour la decouverte de la plateforme et le suivi des
          indicateurs publics.
        </p>
      </article>

      <div className="statGrid">
        <article className="statCard">
          <span>Profils visibles</span>
          <strong>{selectors.filteredStudents.length}</strong>
        </article>
        <article className="statCard">
          <span>Ecoles</span>
          <strong>{selectors.filteredStudents.length > 0 ? '2' : '0'}</strong>
        </article>
        <article className="statCard">
          <span>Entreprises</span>
          <strong>2</strong>
        </article>
        <article className="statCard">
          <span>Offres</span>
          <strong>Visibles</strong>
        </article>
      </div>
    </section>
  )
}
