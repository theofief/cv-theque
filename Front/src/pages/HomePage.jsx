import { useAppStore } from '../context/AppStore'

export default function HomePage() {
  const { selectors, state, actions } = useAppStore()

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Profils recommandes pour {selectors.companyFocus?.name}</h2>
        <p>
          Les cartes ci-dessous sont calculees automatiquement selon les filtres et les
          skills cibles de l'entreprise.
        </p>
      </div>

      <div className="cardGrid">
        {selectors.recommendedProfiles.slice(0, 6).map(({ student, score, matchingSkills }) => (
          <article className="card" key={student.id}>
            <div className="cardTitleLine">
              <h3>{student.name}</h3>
              <button
                type="button"
                className="ghostBtn"
                onClick={() => actions.toggleFavorite('students', student.id)}
              >
                {state.favorites.students.includes(student.id) ? 'Retirer favori' : 'Favori'}
              </button>
            </div>
            <p>
              Match: <strong>{score}</strong>
            </p>
            <p>{matchingSkills.join(', ')}</p>
            <p>
              {student.contract} - {student.region}
            </p>
          </article>
        ))}
      </div>

      <div className="subSection">
        <h3>Tops profils pour vous</h3>
        <div className="inlineCards">
          {selectors.topProfiles.map((student) => (
            <article key={student.id} className="compactCard">
              <strong>{student.name}</strong>
              <span>{student.skills.join(' | ')}</span>
              <span>{student.recommendations.length} recommandations</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
