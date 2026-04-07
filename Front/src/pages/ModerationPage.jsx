import { useAppStore } from '../context/useAppStore'

export default function ModerationPage() {
  const { state, actions } = useAppStore()

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Moderation renforcee</h2>
        <p>
          Chaque item passe par un statut. Cette mecanique sera reutilisable avec l'API.
        </p>
      </div>

      <div className="cardGrid">
        {state.moderationQueue.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.label}</h3>
            <p>{item.details}</p>
            <p>
              Statut: <strong>{item.status}</strong>
            </p>
            <button
              className="primaryBtn"
              type="button"
              onClick={() => actions.approveModerationItem(item.id)}
            >
              Approuver
            </button>
            <button
              className="ghostBtn"
              type="button"
              onClick={() => actions.rejectModerationItem(item.id)}
            >
              Rejeter
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
