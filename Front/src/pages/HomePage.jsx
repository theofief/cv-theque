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
    <div className="d-grid gap-4">
      <StatsStrip stats={stats} filteredCount={filteredStudents.length} />

      <section className="row g-3 align-items-end">
        <div className="col-lg-7">
          <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
            Mission produit
          </span>
          <h2 className="display-6 fw-bold mt-2 mb-2">
            Identifier rapidement les bons profils etudiants.
          </h2>
        </div>
        <div className="col-lg-5">
          <p className="text-secondary mb-0">
            Cette vue regroupe les talents, les filtres utiles et un apercu detaille pour
            faciliter la consultation cote entreprise comme cote ecole.
          </p>
        </div>
      </section>

      <div id="talent-space">
        <StudentsToolbar
          filters={filters}
          availableSkills={availableSkills}
          availableTechnologies={availableTechnologies}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          onCreate={openCreateForm}
        />
      </div>

      {error ? (
        <div className="alert alert-danger shadow-sm mb-0" role="alert">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="alert alert-success shadow-sm mb-0" role="alert">
          {successMessage}
        </div>
      ) : null}

      {editingStudentId ? (
        <div id="talent-form">
          <StudentForm
            student={editingStudent}
            onCancel={closeForm}
            onSubmit={(payload) =>
              editingStudent
                ? updateStudent(editingStudent.id, payload)
                : createStudent(payload)
            }
          />
        </div>
      ) : null}

      <section className="row g-4 align-items-start">
        <div className="col-xl-8">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-3">
            <div>
              <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
                Selection de profils
              </span>
              <h2 className="h2 mt-2 mb-0">{filteredStudents.length} profils visibles</h2>
            </div>
            <p className="text-secondary mb-0 col-lg-5">
              Une grille plus sobre pour parcourir les talents sans surcharger la lecture.
            </p>
          </div>

          {loading ? (
            <section className="card border-0 shadow-sm surface-card">
              <div className="card-body text-center py-5">
                <h3 className="h4 mb-0">Chargement des profils...</h3>
              </div>
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

        <div className="col-xl-4">
          <div className="sticky-panel">
            {selectedStudent ? (
              <StudentProfile student={selectedStudent} onSkillClick={applySkillFilter} />
            ) : (
              <section className="card border-0 shadow-sm surface-card">
                <div className="card-body text-center py-5">
                  <h3 className="h4">Selectionnez un profil</h3>
                  <p className="text-secondary mb-0">Le detail d un etudiant apparaitra ici.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
