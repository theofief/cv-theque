import ProjectList from './ProjectList'
import SkillList from './SkillList'
import { getInitials, getStudentFullName } from '../../utils/studentHelpers'

export default function StudentProfile({ student, onSkillClick }) {
  return (
    <article className="card border-0 shadow-sm surface-card profile-card">
      <div className="profile-header">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <span className="profile-avatar profile-avatar--soft">{getInitials(student)}</span>
            <div className="d-grid gap-2">
              <div>
                <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
                  Profil selectionne
                </span>
                <h2 className="h3 mt-2 mb-1 mb-lg-2">{getStudentFullName(student)}</h2>
                <p className="mb-0 text-secondary">
                  {student.role} • {student.age} ans • {student.location}
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill text-bg-light text-primary-emphasis">
                  {student.location}
                </span>
                <span className="badge rounded-pill text-bg-light text-primary-emphasis">
                  {student.age} ans
                </span>
                {student.featured ? (
                  <span className="badge rounded-pill text-bg-warning">En vue</span>
                ) : (
                  <span className="badge rounded-pill text-bg-secondary">Profil standard</span>
                )}
              </div>
            </div>
          </div>
          <span className="badge rounded-pill availability-pill align-self-start">
            {student.availability}
          </span>
        </div>
      </div>

      <div className="card-body p-4 p-lg-4 d-grid gap-3">
        <section className="profile-meta-grid">
          <div className="profile-fact profile-fact--inline">
            <span className="profile-fact-label">Email</span>
            <strong className="profile-fact-value text-break">{student.email}</strong>
          </div>
          <div className="profile-fact profile-fact--inline">
            <span className="profile-fact-label">Role</span>
            <strong className="profile-fact-value">{student.role}</strong>
          </div>
          <div className="profile-fact profile-fact--inline">
            <span className="profile-fact-label">Localisation</span>
            <strong className="profile-fact-value">{student.location}</strong>
          </div>
          <div className="profile-fact profile-fact--inline">
            <span className="profile-fact-label">Positionnement</span>
            <strong className="profile-fact-value">
              {student.featured ? 'Profil mis en avant' : 'Profil standard'}
            </strong>
          </div>
        </section>

        <section className="profile-section">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <div>
              <h3 className="h5 mb-1">A propos</h3>
              <p className="text-secondary small mb-0">
                Presentation rapide pour comprendre le profil sans surcharge visuelle.
              </p>
            </div>
          </div>
          <div className="profile-bio">{student.bio}</div>
        </section>

        <section className="profile-section">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <div>
              <h3 className="h5 mb-1">Competences</h3>
              <p className="text-secondary small mb-0">
                {student.skills.length} competences disponibles et selectionnables.
              </p>
            </div>
          </div>
          <SkillList skills={student.skills} onSkillClick={onSkillClick} />
        </section>

        <section className="profile-section">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <div>
              <h3 className="h5 mb-1">Projets</h3>
              <p className="text-secondary small mb-0">
                {student.projects.length} realisations pour evaluer le niveau et les outils.
              </p>
            </div>
          </div>
          <ProjectList projects={student.projects} />
        </section>
      </div>
    </article>
  )
}
