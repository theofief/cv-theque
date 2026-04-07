import { useState } from 'react'
import { useAppStore } from '../context/useAppStore'

export default function RequestsPage() {
  const { state, actions } = useAppStore()
  const [form, setForm] = useState({
    studentId: state.students[0].id,
    companyId: state.companies[0].id,
    type: 'Candidature spontanee',
    note: '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    actions.addStudentRequest({ ...form })
    setForm((current) => ({ ...current, note: '' }))
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Demandes par les students uniquement</h2>
        <p>Le formulaire ajoute une demande qui apparait instantanement dans la liste.</p>
      </div>

      <form className="formGrid" onSubmit={handleSubmit}>
        <label>
          Etudiant
          <select
            value={form.studentId}
            onChange={(event) => setForm((c) => ({ ...c, studentId: event.target.value }))}
          >
            {state.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Entreprise ciblee
          <select
            value={form.companyId}
            onChange={(event) => setForm((c) => ({ ...c, companyId: event.target.value }))}
          >
            {state.companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type de demande
          <select
            value={form.type}
            onChange={(event) => setForm((c) => ({ ...c, type: event.target.value }))}
          >
            <option value="Candidature spontanee">Candidature spontanee</option>
            <option value="Demande de mise en relation">Demande de mise en relation</option>
          </select>
        </label>
        <label className="formWide">
          Note
          <textarea
            rows="2"
            value={form.note}
            onChange={(event) => setForm((c) => ({ ...c, note: event.target.value }))}
          />
        </label>
        <button type="submit" className="primaryBtn">
          Ajouter demande
        </button>
      </form>

      <div className="cardGrid">
        {state.studentRequests.map((request) => {
          const studentName = state.students.find((s) => s.id === request.studentId)?.name
          const companyName = state.companies.find((c) => c.id === request.companyId)?.name
          return (
            <article className="card" key={request.id}>
              <h3>{request.type}</h3>
              <p>Etudiant: {studentName}</p>
              <p>Entreprise: {companyName}</p>
              <p>{request.note || 'Sans note'}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
