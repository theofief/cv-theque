import { Link } from 'react-router-dom'
import SkillList from './SkillList'
import { getInitials, getStudentFullName } from '../../utils/studentHelpers'

export default function StudentCard({
  student,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onSkillClick,
}) {
  return (
    <article className="col-12 col-md-6">
      <div className={`card h-100 border-0 shadow-sm surface-card ${isActive ? 'active-student-card' : ''}`}>
        <div
          className="card-body d-grid gap-3 cursor-pointer"
          onClick={() => onSelect(student.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onSelect(student.id)
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div className="d-flex align-items-start gap-3">
              <span className="avatar-badge">{getInitials(student)}</span>
              <div className="d-grid gap-2">
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge rounded-pill text-bg-light text-primary-emphasis">
                    {student.location}
                  </span>
                  {student.featured ? (
                    <span className="badge rounded-pill text-bg-warning">En vue</span>
                  ) : null}
                </div>
                <div>
                  <h3 className="h5 mb-1">{getStudentFullName(student)}</h3>
                  <p className="text-secondary mb-0">{student.role}</p>
                </div>
              </div>
            </div>
            <span className="badge rounded-pill availability-pill">{student.availability}</span>
          </div>

          <p className="text-secondary mb-0">{student.bio}</p>
          <SkillList skills={student.skills.slice(0, 3)} onSkillClick={onSkillClick} />
        </div>

        <div className="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-sm-center">
            <Link className="link-primary fw-semibold text-decoration-none" to={`/students/${student.id}`}>
              Voir le profil complet
            </Link>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => onEdit(student.id)}>
                Modifier
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => onDelete(student.id)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
