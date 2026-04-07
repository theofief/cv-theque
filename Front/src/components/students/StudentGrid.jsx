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
      <section className="panel emptyState">
        <span className="eyebrow">Aucun resultat</span>
        <h3>Aucun profil ne correspond a vos filtres.</h3>
        <p>Essayez une autre combinaison de recherche, de niveau ou de technologie.</p>
      </section>
    )
  }

  return (
    <section className="studentGrid">
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
