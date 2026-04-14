import { useMemo, useState } from 'react'

const emptyStudent = {
  firstName: '',
  lastName: '',
  age: 20,
  role: '',
  location: '',
  bio: '',
  email: '',
  availability: '',
  featured: false,
  skills: [{ name: '', level: 'beginner' }],
  projects: [{ name: '', technologies: '', description: '' }],
}

function getInitialState(student) {
  if (!student) {
    return emptyStudent
  }

  return {
    ...student,
    skills: student.skills.length ? student.skills : emptyStudent.skills,
    projects: student.projects.length
      ? student.projects.map((project) => ({
          ...project,
          technologies: project.technologies.join(', '),
        }))
      : emptyStudent.projects,
  }
}

function FieldError({ message }) {
  return message ? <div className="form-text text-danger">{message}</div> : null
}

export default function StudentForm({ student, onCancel, onSubmit }) {
  const [formData, setFormData] = useState(() => getInitialState(student))
  const [errors, setErrors] = useState({})

  const formTitle = useMemo(
    () => (student ? 'Modifier le profil' : 'Ajouter un profil'),
    [student],
  )

  function updateField(key, value) {
    setFormData((currentData) => ({ ...currentData, [key]: value }))
  }

  function updateArrayItem(section, index, key, value) {
    setFormData((currentData) => ({
      ...currentData,
      [section]: currentData[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  function addSkill() {
    setFormData((currentData) => ({
      ...currentData,
      skills: [...currentData.skills, { name: '', level: 'beginner' }],
    }))
  }

  function addProject() {
    setFormData((currentData) => ({
      ...currentData,
      projects: [...currentData.projects, { name: '', technologies: '', description: '' }],
    }))
  }

  function validate() {
    const nextErrors = {}

    if (!formData.firstName.trim()) nextErrors.firstName = 'Le prenom est requis.'
    if (!formData.lastName.trim()) nextErrors.lastName = 'Le nom est requis.'
    if (!formData.role.trim()) nextErrors.role = 'Le poste cible est requis.'
    if (!formData.location.trim()) nextErrors.location = 'La localisation est requise.'
    if (!formData.bio.trim()) nextErrors.bio = 'La biographie est requise.'
    if (!formData.email.trim()) nextErrors.email = 'L email est requis.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <section className="card border-0 shadow-sm surface-card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <span className="text-uppercase small fw-semibold text-secondary brand-kicker">
              Edition
            </span>
            <h2 className="h3 mt-2 mb-0">{formTitle}</h2>
          </div>
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onCancel}>
            Fermer
          </button>
        </div>

        <form className="d-grid gap-4" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Prenom</label>
              <input
                className="form-control"
                value={formData.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
              />
              <FieldError message={errors.firstName} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Nom</label>
              <input
                className="form-control"
                value={formData.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
              />
              <FieldError message={errors.lastName} />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Age</label>
              <input
                className="form-control"
                type="number"
                min="16"
                max="99"
                value={formData.age}
                onChange={(event) => updateField('age', Number(event.target.value))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Poste</label>
              <input
                className="form-control"
                value={formData.role}
                onChange={(event) => updateField('role', event.target.value)}
              />
              <FieldError message={errors.role} />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Localisation</label>
              <input
                className="form-control"
                value={formData.location}
                onChange={(event) => updateField('location', event.target.value)}
              />
              <FieldError message={errors.location} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                className="form-control"
                type="email"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
              <FieldError message={errors.email} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Disponibilite</label>
              <input
                className="form-control"
                value={formData.availability}
                onChange={(event) => updateField('availability', event.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Biographie</label>
              <textarea
                className="form-control"
                rows="4"
                value={formData.bio}
                onChange={(event) => updateField('bio', event.target.value)}
              />
              <FieldError message={errors.bio} />
            </div>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              id="featuredProfile"
              type="checkbox"
              checked={formData.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
            />
            <label className="form-check-label" htmlFor="featuredProfile">
              Profil mis en avant
            </label>
          </div>

          <div className="d-grid gap-3">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <h3 className="h5 mb-0">Competences</h3>
              <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={addSkill}>
                Ajouter une competence
              </button>
            </div>

            <div className="d-grid gap-3">
              {formData.skills.map((skill, index) => (
                <div key={`skill-${index}`} className="row g-3">
                  <div className="col-12 col-md-8">
                    <input
                      className="form-control"
                      placeholder="Nom de la competence"
                      value={skill.name}
                      onChange={(event) =>
                        updateArrayItem('skills', index, 'name', event.target.value)
                      }
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <select
                      className="form-select"
                      value={skill.level}
                      onChange={(event) =>
                        updateArrayItem('skills', index, 'level', event.target.value)
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-grid gap-3">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <h3 className="h5 mb-0">Projets</h3>
              <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={addProject}>
                Ajouter un projet
              </button>
            </div>

            <div className="d-grid gap-3">
              {formData.projects.map((project, index) => (
                <div key={`project-${index}`} className="card border-0 project-card">
                  <div className="card-body d-grid gap-3">
                    <input
                      className="form-control"
                      placeholder="Nom du projet"
                      value={project.name}
                      onChange={(event) =>
                        updateArrayItem('projects', index, 'name', event.target.value)
                      }
                    />
                    <input
                      className="form-control"
                      placeholder="Technologies separees par des virgules"
                      value={project.technologies}
                      onChange={(event) =>
                        updateArrayItem('projects', index, 'technologies', event.target.value)
                      }
                    />
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Description"
                      value={project.description}
                      onChange={(event) =>
                        updateArrayItem('projects', index, 'description', event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn btn-warning rounded-pill px-4">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
