import ProjectList from './ProjectList'
import SkillList from './SkillList'
import { getStudentFullName } from '../../utils/studentHelpers'

export default function StudentProfile({ student, onSkillClick }) {
  return (
    <article className="card border-0 shadow-sm surface-card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
          <div>
            <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
              Profil selectionne
            </span>
            <h2 className="h3 mt-2 mb-2">{getStudentFullName(student)}</h2>
            <p className="text-secondary mb-0">
              {student.role} • {student.age} ans • {student.location}
            </p>
          </div>
          <span className="badge rounded-pill availability-pill align-self-start">
            {student.availability}
          </span>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 meta-card">
              <div className="card-body">
                <div className="small text-secondary text-uppercase fw-semibold brand-kicker mb-2">
                  Email
                </div>
                <div className="fw-semibold">{student.email}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 meta-card">
              <div className="card-body">
                <div className="small text-secondary text-uppercase fw-semibold brand-kicker mb-2">
                  Positionnement
                </div>
                <div className="fw-semibold">
                  {student.featured ? 'Profil mis en avant' : 'Profil standard'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-secondary mb-4">{student.bio}</p>

        <section className="mb-4">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <h3 className="h5 mb-0">Competences</h3>
            <span className="text-secondary small">{student.skills.length} competences</span>
          </div>
          <SkillList skills={student.skills} onSkillClick={onSkillClick} />
        </section>

        <section>
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <h3 className="h5 mb-0">Projets</h3>
            <span className="text-secondary small">{student.projects.length} projets</span>
          </div>
          <ProjectList projects={student.projects} />
        </section>
      </div>
    </article>
  )
}
