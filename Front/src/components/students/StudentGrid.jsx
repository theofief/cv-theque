import StudentCard from './StudentCard'

export default function StudentGrid({
  students,
  selectedStudentId,
  onSelect,
  onEdit,
  onDelete,
  onSkillClick,
}) {
  if (!students.length) {
    return (
      <section className="card border-0 shadow-sm surface-card">
        <div className="card-body text-center py-5">
          <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
            Aucun resultat
          </span>
          <h3 className="h4 mt-2">Aucun profil ne correspond a vos filtres.</h3>
          <p className="text-secondary mb-0">
            Essayez une autre combinaison de recherche, de niveau ou de technologie.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="row g-3">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          isActive={student.id === selectedStudentId}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onSkillClick={onSkillClick}
        />
      ))}
    </section>
  )
}
