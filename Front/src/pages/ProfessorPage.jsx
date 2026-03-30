import { useState } from 'react'
import { useAppStore } from '../context/AppStore'

export default function ProfessorPage() {
  const { state, actions } = useAppStore()
  const [selectedStudents, setSelectedStudents] = useState([])
  const [targetCompanyId, setTargetCompanyId] = useState(state.companies[0].id)
  const [recommendationForm, setRecommendationForm] = useState({
    studentId: state.students[0].id,
    text: '',
  })

  const toggleStudent = (id) => {
    setSelectedStudents((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const handlePush = () => {
    if (selectedStudents.length === 0) {
      return
    }
    selectedStudents.forEach((studentId) => {
      actions.addProfessorPush({
        studentId,
        companyId: targetCompanyId,
        professorName: 'Professeur Demo',
      })
    })
    setSelectedStudents([])
  }

  const handleRecommendation = (event) => {
    event.preventDefault()
    if (!recommendationForm.text.trim()) {
      return
    }
    actions.addStudentRecommendation({
      studentId: recommendationForm.studentId,
      recommendation: `Prof. Demo: ${recommendationForm.text.trim()}`,
    })
    setRecommendationForm((current) => ({ ...current, text: '' }))
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Visu prof: push un ou plusieurs etudiants</h2>
        <p>
          Selection multiple + push batch: mecanique prete pour branchement API.
        </p>
      </div>

      <div className="formRow">
        <label>
          Entreprise cible
          <select
            value={targetCompanyId}
            onChange={(event) => setTargetCompanyId(event.target.value)}
          >
            {state.companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <button className="primaryBtn" type="button" onClick={handlePush}>
          Push selection ({selectedStudents.length})
        </button>
      </div>

      <form className="formGrid" onSubmit={handleRecommendation}>
        <label>
          Etudiant a recommander
          <select
            value={recommendationForm.studentId}
            onChange={(event) =>
              setRecommendationForm((current) => ({
                ...current,
                studentId: event.target.value,
              }))
            }
          >
            {state.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
        <label className="formWide">
          Recommandation
          <textarea
            rows="2"
            value={recommendationForm.text}
            onChange={(event) =>
              setRecommendationForm((current) => ({
                ...current,
                text: event.target.value,
              }))
            }
            placeholder="Ex: Excellente capacite d'analyse et grande rigueur."
          />
        </label>
        <button className="primaryBtn" type="submit">
          Ajouter recommandation
        </button>
      </form>

      <div className="cardGrid">
        {state.students.map((student) => {
          const school = state.schools.find((item) => item.id === student.schoolId)
          return (
            <article key={student.id} className="card">
              <div className="cardTitleLine">
                <h3>{student.name}</h3>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                />
              </div>
              <p>Ecole: {school?.name}</p>
              <p>Skills: {student.skills.join(', ')}</p>
            </article>
          )
        })}
      </div>

      <div className="subSection">
        <h3>Historique des push professeurs</h3>
        <div className="inlineCards">
          {state.professorPushes.map((push) => {
            const student = state.students.find((item) => item.id === push.studentId)
            const company = state.companies.find((item) => item.id === push.companyId)
            return (
              <article className="compactCard" key={push.id}>
                <strong>{student?.name}</strong>
                <span>Vers {company?.name}</span>
                <span>{push.date}</span>
              </article>
            )
          })}
          {state.professorPushes.length === 0 && (
            <article className="compactCard">
              <span>Aucun push pour le moment.</span>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
