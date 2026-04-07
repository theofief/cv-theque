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
    <article className={`studentCard ${isActive ? 'studentCardActive' : ''}`}>
      <div
        className="studentCardMain"
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
        <div className="studentCardTop">
          <span className="avatarBadge">{getInitials(student)}</span>
          <div>
            <h3>{getStudentFullName(student)}</h3>
            <p>
              {student.role} • {student.location}
            </p>
          </div>
        </div>

        <p className="cardBio">{student.bio}</p>
        <SkillList skills={student.skills.slice(0, 3)} onSkillClick={onSkillClick} />
      </div>

      <div className="studentCardFooter">
        <Link className="inlineLink" to={`/students/${student.id}`}>
          Voir le profil
        </Link>
        <div className="cardActions">
          <button type="button" className="ghostButton" onClick={() => onEdit(student.id)}>
            Modifier
          </button>
          <button type="button" className="dangerButton" onClick={() => onDelete(student.id)}>
            Supprimer
          </button>
        </div>
      </div>
    </article>
  )
}
