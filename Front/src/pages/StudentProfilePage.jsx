import { Link, useParams } from 'react-router-dom'
import StudentProfile from '../components/students/StudentProfile'
import { useStudents } from '../hooks/useStudents'

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const { students, applySkillFilter, loading } = useStudents()
  const student = students.find((item) => item.id === studentId)

  if (loading) {
    return (
      <section className="panel emptyState">
        <h2>Chargement du profil...</h2>
      </section>
    )
  }

  if (!student) {
    return (
      <section className="panel emptyState">
        <h2>Profil introuvable</h2>
        <p>Ce profil n existe plus ou n a pas encore ete charge.</p>
        <Link className="inlineLink" to="/">
          Retour a la CVtheque
        </Link>
      </section>
    )
  }

  return (
    <div className="pageStack">
      <Link className="inlineLink" to="/">
        Retour a la CVtheque
      </Link>
      <StudentProfile student={student} onSkillClick={applySkillFilter} />
    </div>
  )
}
