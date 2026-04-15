export function getStudentFullName(student) {
  return `${student.firstName} ${student.lastName}`
}

export function getInitials(student) {
  return `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase()
}

export function getLevelLabel(level) {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }

  return labels[level] ?? level
}

export function getLevelScore(level) {
  const scores = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }

  return scores[level] ?? 0
}

export function normalizeStudentPayload(student) {
  return {
    ...student,
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    role: student.role.trim(),
    location: student.location.trim(),
    bio: student.bio.trim(),
    email: student.email.trim(),
    availability: student.availability.trim(),
    schoolName: student.schoolName.trim(),
    companyName: student.companyName?.trim() || null,
    skills: student.skills
      .map((skill) => ({
        name: skill.name.trim(),
        level: skill.level,
      }))
      .filter((skill) => skill.name),
    projects: student.projects
      .map((project) => ({
        name: project.name.trim(),
        technologies: project.technologies
          .split(',')
          .map((technology) => technology.trim())
          .filter(Boolean),
        description: project.description.trim(),
      }))
      .filter((project) => project.name && project.description),
  }
}

export function getUniqueSkills(students) {
  return [...new Set(students.flatMap((student) => student.skills.map((skill) => skill.name)))]
    .sort((left, right) => left.localeCompare(right, 'fr'))
}

export function getUniqueTechnologies(students) {
  return [
    ...new Set(
      students.flatMap((student) =>
        student.projects.flatMap((project) => project.technologies),
      ),
    ),
  ].sort((left, right) => left.localeCompare(right, 'fr'))
}

export function getUniqueSchools(students) {
  return [...new Set(students.map((student) => student.schoolName).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'fr'))
}

export function getUniqueCompanies(students) {
  return [...new Set(students.map((student) => student.companyName).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'fr'))
}

export function buildStudentStats(students) {
  const totalSkills = students.reduce((count, student) => count + student.skills.length, 0)
  const advancedSkills = students.reduce(
    (count, student) =>
      count + student.skills.filter((skill) => skill.level === 'advanced').length,
    0,
  )

  return {
    studentsCount: students.length,
    featuredCount: students.filter((student) => student.featured).length,
    advancedSkills,
    totalSkills,
  }
}
