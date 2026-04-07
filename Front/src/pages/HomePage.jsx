import StudentForm from '../components/students/StudentForm'
import StudentGrid from '../components/students/StudentGrid'
import StudentProfile from '../components/students/StudentProfile'
import StudentsToolbar from '../components/students/StudentsToolbar'
import StatsStrip from '../components/students/StatsStrip'
import { useStudents } from '../hooks/useStudents'

export default function HomePage() {
  const {
    filteredStudents,
    selectedStudent,
    selectedStudentId,
    editingStudentId,
    loading,
    error,
    successMessage,
    filters,
    stats,
    availableSkills,
    availableTechnologies,
    setSelectedStudentId,
    updateFilter,
    applySkillFilter,
    resetFilters,
    openCreateForm,
    openEditForm,
    closeForm,
    createStudent,
    updateStudent,
    deleteStudent,
    students,
  } = useStudents()

  const editingStudent =
    editingStudentId && editingStudentId !== 'new'
      ? students.find((student) => student.id === editingStudentId)
      : null

  return (
    <div className="pageStack">
      <StatsStrip stats={stats} />

      <StudentsToolbar
        filters={filters}
        availableSkills={availableSkills}
        availableTechnologies={availableTechnologies}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onCreate={openCreateForm}
      />

      {error ? <div className="feedbackBanner feedbackError">{error}</div> : null}
      {successMessage ? (
        <div className="feedbackBanner feedbackSuccess">{successMessage}</div>
      ) : null}

      {editingStudentId ? (
        <StudentForm
          student={editingStudent}
          onCancel={closeForm}
          onSubmit={(payload) =>
            editingStudent
              ? updateStudent(editingStudent.id, payload)
              : createStudent(payload)
          }
        />
      ) : null}

      <section className="contentGrid">
        <div>
          {loading ? (
            <section className="panel emptyState">
              <h3>Chargement des profils...</h3>
            </section>
          ) : (
            <StudentGrid
              students={filteredStudents}
              selectedStudentId={selectedStudentId}
              onSelect={setSelectedStudentId}
              onEdit={openEditForm}
              onDelete={deleteStudent}
              onSkillClick={applySkillFilter}
            />
          )}
        </div>

        <div className="stickyColumn">
          {selectedStudent ? (
            <StudentProfile student={selectedStudent} onSkillClick={applySkillFilter} />
          ) : (
            <section className="panel emptyState">
              <h3>Selectionnez un profil</h3>
              <p>Le detail d un etudiant apparaitra ici.</p>
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
