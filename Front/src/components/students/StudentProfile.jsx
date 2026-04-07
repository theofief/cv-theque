import ProjectList from './ProjectList'
import SkillList from './SkillList'
import { getStudentFullName } from '../../utils/studentHelpers'

export default function StudentProfile({ student, onSkillClick }) {
  return (
    <article className="panel profilePanel">
      <div className="profileHero">
        <div>
          <span className="eyebrow">Profil selectionne</span>
          <h2>{getStudentFullName(student)}</h2>
          <p className="leadText">
            {student.role} • {student.age} ans • {student.location}
          </p>
        </div>
        <span className="availabilityBadge">{student.availability}</span>
      </div>

      <p className="profileBio">{student.bio}</p>

      <section className="profileSection">
        <div className="sectionTitleRow">
          <h3>Competences</h3>
          <span>{student.skills.length} skills</span>
        </div>
        <SkillList skills={student.skills} onSkillClick={onSkillClick} />
      </section>

      <section className="profileSection">
        <div className="sectionTitleRow">
          <h3>Projets</h3>
          <span>{student.projects.length} projets</span>
        </div>
        <ProjectList projects={student.projects} />
      </section>
    </article>
  )
}
