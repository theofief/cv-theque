import SkillItem from './SkillItem'

export default function SkillList({ skills, onSkillClick }) {
  if (!skills.length) {
    return <p className="text-secondary mb-0">Aucune competence renseignee.</p>
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {skills.map((skill) => (
        <SkillItem key={`${skill.name}-${skill.level}`} skill={skill} onClick={onSkillClick} />
      ))}
    </div>
  )
}
