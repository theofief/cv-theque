import { Link, useParams } from 'react-router-dom'
import StudentProfile from '../components/students/StudentProfile'
import { useStudents } from '../hooks/useStudents'

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const { students, applySkillFilter, loading } = useStudents()
  const student = students.find((item) => item.id === studentId)

  if (loading) {
    return (
      <section className="card border-0 shadow-sm surface-card">
        <div className="card-body text-center py-5">
          <h2 className="h3 mb-0">Chargement du profil...</h2>
        </div>
      </section>
    )
  }

  if (!student) {
    return (
      <section className="card border-0 shadow-sm surface-card">
        <div className="card-body text-center py-5 d-grid gap-3">
          <h2 className="h3 mb-0">Profil introuvable</h2>
          <p className="text-secondary mb-0">
            Ce profil n existe plus ou n a pas encore ete charge.
          </p>
          <div>
            <Link className="link-primary fw-semibold text-decoration-none" to="/">
              Retour à Gott
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="d-grid gap-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3">
        <div>
          <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
            Profil
          </span>
          <h2 className="display-6 fw-bold mt-2 mb-0">Vue détaillée du profil</h2>
        </div>
        <Link className="link-primary fw-semibold text-decoration-none" to="/">
          Retour à Gott
        </Link>
      </div>
      <StudentProfile student={student} onSkillClick={applySkillFilter} />
    </div>
  )
}
