import { getLevelLabel, getLevelScore } from '../../utils/studentHelpers'

export default function SkillItem({ skill, onClick }) {
  return (
    <button
      type="button"
      className="btn btn-light border skill-chip d-inline-flex align-items-center gap-2 rounded-pill"
      onClick={() => onClick?.(skill.name)}
    >
      <span>{skill.name}</span>
      <small className="text-secondary">{getLevelLabel(skill.level)}</small>
      <strong className="text-warning-emphasis">{'★'.repeat(getLevelScore(skill.level))}</strong>
    </button>
  )
}
