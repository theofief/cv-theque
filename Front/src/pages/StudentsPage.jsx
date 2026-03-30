import { useMemo, useState } from 'react'
import { useAppStore } from '../context/AppStore'

export default function StudentsPage() {
  const { state, actions } = useAppStore()
  const [studentId, setStudentId] = useState(state.students[0]?.id)

  const selectedStudent = useMemo(
    () => state.students.find((student) => student.id === studentId),
    [studentId, state.students],
  )

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Page par student + CV en bas</h2>
        <p>
          Recommandations professeurs, infos profil et historique CV sont regroupes.
        </p>
      </div>

      <div className="switches">
        {state.students.map((student) => (
          <button
            key={student.id}
            type="button"
            className={studentId === student.id ? 'chip active' : 'chip'}
            onClick={() => setStudentId(student.id)}
          >
            {student.name}
          </button>
        ))}
      </div>

      <article className="card focusCard">
        <div className="cardTitleLine">
          <h3>{selectedStudent?.name}</h3>
          <button
            type="button"
            className="ghostBtn"
            onClick={() => actions.toggleFavorite('students', selectedStudent.id)}
          >
            {state.favorites.students.includes(selectedStudent?.id)
              ? 'Retirer favori'
              : 'Favori'}
          </button>
        </div>
        <p>
          {selectedStudent?.age} ans - {selectedStudent?.region} - {selectedStudent?.contract}
        </p>
        <p>Statut: {selectedStudent?.status}</p>
        <p>Skills: {selectedStudent?.skills.join(', ')}</p>
      </article>

      <div className="subSection">
        <h3>Recommandations professeurs</h3>
        <div className="inlineCards">
          {selectedStudent?.recommendations.map((item) => (
            <article className="compactCard" key={item}>
              <span>{item}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="subSection">
        <h3>CV en bas</h3>
        <ul className="timeline">
          {selectedStudent?.cv.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
