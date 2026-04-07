import { useMemo, useState } from 'react'
import { useAppStore } from '../context/useAppStore'

export default function SchoolsPage() {
  const { state, actions } = useAppStore()
  const [schoolId, setSchoolId] = useState(state.schools[0]?.id)

  const selectedSchool = useMemo(
    () => state.schools.find((school) => school.id === schoolId),
    [schoolId, state.schools],
  )

  const pendingAccounts = state.pendingStudentAccounts.filter(
    (account) => account.schoolId === schoolId,
  )

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Une page par ecole</h2>
        <p>
          Les ecoles pilotent la verification des comptes et la publication des profils.
        </p>
      </div>

      <div className="switches">
        {state.schools.map((school) => (
          <button
            key={school.id}
            type="button"
            className={schoolId === school.id ? 'chip active' : 'chip'}
            onClick={() => setSchoolId(school.id)}
          >
            {school.name}
          </button>
        ))}
      </div>

      <article className="card focusCard">
        <h3>{selectedSchool?.name}</h3>
        <p>Region: {selectedSchool?.region}</p>
        <p>
          Etudiants en poste: <strong>{selectedSchool?.studentsInJob}</strong>
        </p>
        <p>
          Etudiants en recherche: <strong>{selectedSchool?.studentsSearching}</strong>
        </p>
      </article>

      <div className="subSection">
        <h3>Comptes a verifier avant publication</h3>
        <div className="cardGrid">
          {pendingAccounts.map((account) => (
            <article className="card" key={account.id}>
              <h4>{account.name}</h4>
              <p>Etape: {account.step}</p>
              <button
                type="button"
                className="primaryBtn"
                onClick={() => actions.verifyStudentAccount(account.id)}
              >
                Verifier et publier
              </button>
            </article>
          ))}
          {pendingAccounts.length === 0 && (
            <article className="card">
              <h4>File vide</h4>
              <p>Tous les comptes de cette ecole sont valides.</p>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
