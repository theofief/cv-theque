import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { catalogService } from '../services/catalogService'
import { studentsService } from '../services/studentsService'
import {
  buildStudentStats,
  getUniqueCompanies,
  getStudentFullName,
  getUniqueSkills,
  getUniqueSchools,
  getUniqueTechnologies,
  normalizeStudentPayload,
} from '../utils/studentHelpers'

const defaultFilters = {
  query: '',
  skillLevel: 'all',
  skillName: 'all',
  technology: 'all',
  sortBy: 'featured',
}

export function useStudents() {
  const [students, setStudents] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [catalogSchools, setCatalogSchools] = useState([])
  const [catalogCompanies, setCatalogCompanies] = useState([])

  const deferredQuery = useDeferredValue(filters.query)

  useEffect(() => {
    let active = true

    async function loadStudents() {
      try {
        setLoading(true)
        setError('')
        const [data, schools, companies] = await Promise.all([
          studentsService.getAll(),
          catalogService.getSchools(),
          catalogService.getCompanies(),
        ])

        if (!active) {
          return
        }

        setStudents(data)
        setCatalogSchools(schools)
        setCatalogCompanies(companies)
        setSelectedStudentId((currentId) => currentId ?? data[0]?.id ?? null)
      } catch {
        if (active) {
          setError('Impossible de charger les profils etudiants.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadStudents()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!successMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
    }, 2600)

    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const availableSkills = useMemo(() => getUniqueSkills(students), [students])
  const availableTechnologies = useMemo(() => getUniqueTechnologies(students), [students])
  const availableSchools = useMemo(
    () => [...new Set([...catalogSchools, ...getUniqueSchools(students)])].sort((a, b) => a.localeCompare(b, 'fr')),
    [catalogSchools, students],
  )
  const availableCompanies = useMemo(
    () => [...new Set([...catalogCompanies, ...getUniqueCompanies(students)])].sort((a, b) => a.localeCompare(b, 'fr')),
    [catalogCompanies, students],
  )
  const stats = useMemo(() => buildStudentStats(students), [students])

  const filteredStudents = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    const filtered = students.filter((student) => {
      const fullName = getStudentFullName(student).toLowerCase()
      const location = student.location.toLowerCase()
      const matchesQuery =
        !normalizedQuery ||
        fullName.includes(normalizedQuery) ||
        location.includes(normalizedQuery)

      const matchesLevel =
        filters.skillLevel === 'all' ||
        student.skills.some((skill) => skill.level === filters.skillLevel)

      const matchesSkill =
        filters.skillName === 'all' ||
        student.skills.some((skill) => skill.name === filters.skillName)

      const matchesTechnology =
        filters.technology === 'all' ||
        student.projects.some((project) =>
          project.technologies.includes(filters.technology),
        )

      return matchesQuery && matchesLevel && matchesSkill && matchesTechnology
    })

    if (filters.sortBy === 'name') {
      return [...filtered].sort((left, right) =>
        getStudentFullName(left).localeCompare(getStudentFullName(right), 'fr'),
      )
    }

    if (filters.sortBy === 'location') {
      return [...filtered].sort((left, right) => left.location.localeCompare(right.location, 'fr'))
    }

    return [...filtered].sort((left, right) => Number(right.featured) - Number(left.featured))
  }, [deferredQuery, filters.skillLevel, filters.skillName, filters.sortBy, filters.technology, students])

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? filteredStudents[0] ?? null

  async function createStudent(studentDraft) {
    try {
      const payload = normalizeStudentPayload(studentDraft)
      const createdStudent = await studentsService.create(payload)
      setStudents((currentStudents) => [createdStudent, ...currentStudents])
      setSelectedStudentId(createdStudent.id)
      setEditingStudentId(null)
      setSuccessMessage('Profil ajoute avec succes.')
    } catch {
      setError('Impossible de creer le profil.')
    }
  }

  async function updateStudent(studentId, studentDraft) {
    try {
      const payload = normalizeStudentPayload(studentDraft)
      const updatedStudent = await studentsService.update(studentId, payload)

      setStudents((currentStudents) =>
        currentStudents.map((student) => (student.id === studentId ? updatedStudent : student)),
      )
      setSelectedStudentId(studentId)
      setEditingStudentId(null)
      setSuccessMessage('Profil mis a jour.')
    } catch {
      setError('Impossible de modifier ce profil.')
    }
  }

  async function deleteStudent(studentId) {
    try {
      await studentsService.remove(studentId)
      const nextStudents = students.filter((student) => student.id !== studentId)
      setStudents(nextStudents)
      setSelectedStudentId(nextStudents[0]?.id ?? null)
      setEditingStudentId((currentId) => (currentId === studentId ? null : currentId))
      setSuccessMessage('Profil supprime.')
    } catch {
      setError('Impossible de supprimer ce profil.')
    }
  }

  function updateFilter(key, value) {
    startTransition(() => {
      setFilters((currentFilters) => ({ ...currentFilters, [key]: value }))
    })
  }

  function applySkillFilter(skillName) {
    updateFilter('skillName', skillName)
  }

  function resetFilters() {
    setFilters(defaultFilters)
  }

  function openCreateForm() {
    setEditingStudentId('new')
  }

  function openEditForm(studentId) {
    setEditingStudentId(studentId)
    setSelectedStudentId(studentId)
  }

  function closeForm() {
    setEditingStudentId(null)
  }

  return {
    students,
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
    availableSchools,
    availableCompanies,
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
  }
}
