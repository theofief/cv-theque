import SkillItem from './SkillItem'

export default function SkillList({ skills, onSkillClick }) {
  if (!skills.length) {
    return <p className="mutedText">Aucune competence renseignee.</p>
  }

  return (
    <div className="skillList">
      {skills.map((skill) => (
        <SkillItem key={`${skill.name}-${skill.level}`} skill={skill} onClick={onSkillClick} />
      ))}
    </div>
  )
}
