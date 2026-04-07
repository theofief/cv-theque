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
    <section className="panel formPanel">
      <div className="sectionTitleRow">
        <div>
          <span className="eyebrow">Edition</span>
          <h2>{formTitle}</h2>
        </div>
        <button type="button" className="ghostButton" onClick={onCancel}>
          Fermer
        </button>
      </div>

      <form className="studentForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          <label>
            Prenom
            <input
              value={formData.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
            />
            {errors.firstName ? <small className="errorText">{errors.firstName}</small> : null}
          </label>

          <label>
            Nom
            <input
              value={formData.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
            />
            {errors.lastName ? <small className="errorText">{errors.lastName}</small> : null}
          </label>

          <label>
            Age
            <input
              type="number"
              min="16"
              max="99"
              value={formData.age}
              onChange={(event) => updateField('age', Number(event.target.value))}
            />
          </label>

          <label>
            Poste
            <input
              value={formData.role}
              onChange={(event) => updateField('role', event.target.value)}
            />
            {errors.role ? <small className="errorText">{errors.role}</small> : null}
          </label>

          <label>
            Localisation
            <input
              value={formData.location}
              onChange={(event) => updateField('location', event.target.value)}
            />
            {errors.location ? <small className="errorText">{errors.location}</small> : null}
          </label>

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            {errors.email ? <small className="errorText">{errors.email}</small> : null}
          </label>

          <label className="formFullWidth">
            Disponibilite
            <input
              value={formData.availability}
              onChange={(event) => updateField('availability', event.target.value)}
            />
          </label>

          <label className="formFullWidth">
            Biographie
            <textarea
              rows="4"
              value={formData.bio}
              onChange={(event) => updateField('bio', event.target.value)}
            />
            {errors.bio ? <small className="errorText">{errors.bio}</small> : null}
          </label>
        </div>

        <div className="formSwitchRow">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
            />
            Profil featured
          </label>
        </div>

        <div className="formSection">
          <div className="sectionTitleRow">
            <h3>Competences</h3>
            <button type="button" className="ghostButton" onClick={addSkill}>
              Ajouter une skill
            </button>
          </div>
          <div className="dynamicStack">
            {formData.skills.map((skill, index) => (
              <div key={`skill-${index}`} className="inlineFormRow">
                <input
                  placeholder="Nom de la competence"
                  value={skill.name}
                  onChange={(event) =>
                    updateArrayItem('skills', index, 'name', event.target.value)
                  }
                />
                <select
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
            ))}
          </div>
        </div>

        <div className="formSection">
          <div className="sectionTitleRow">
            <h3>Projets</h3>
            <button type="button" className="ghostButton" onClick={addProject}>
              Ajouter un projet
            </button>
          </div>
          <div className="dynamicStack">
            {formData.projects.map((project, index) => (
              <div key={`project-${index}`} className="projectEditor">
                <input
                  placeholder="Nom du projet"
                  value={project.name}
                  onChange={(event) =>
                    updateArrayItem('projects', index, 'name', event.target.value)
                  }
                />
                <input
                  placeholder="Technologies separees par des virgules"
                  value={project.technologies}
                  onChange={(event) =>
                    updateArrayItem('projects', index, 'technologies', event.target.value)
                  }
                />
                <textarea
                  rows="3"
                  placeholder="Description"
                  value={project.description}
                  onChange={(event) =>
                    updateArrayItem('projects', index, 'description', event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="toolbarActions">
          <button type="button" className="ghostButton" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="primaryButton">
            Enregistrer
          </button>
        </div>
      </form>
    </section>
  )
}
