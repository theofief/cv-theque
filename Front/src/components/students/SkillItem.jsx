import { getLevelLabel, getLevelScore } from '../../utils/studentHelpers'

export default function SkillItem({ skill, onClick }) {
  return (
    <button type="button" className="skillPill" onClick={() => onClick?.(skill.name)}>
      <span>{skill.name}</span>
      <small>{getLevelLabel(skill.level)}</small>
      <strong>{'★'.repeat(getLevelScore(skill.level))}</strong>
    </button>
  )
}
