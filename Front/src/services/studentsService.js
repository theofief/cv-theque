import { seedStudents } from '../data/seedStudents'

const STORAGE_KEY = 'cvtheque.students'

function wait(ms = 180) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function readStorage() {
  const rawValue = window.localStorage.getItem(STORAGE_KEY)
  if (!rawValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStudents))
    return seedStudents
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : seedStudents
  } catch {
    return seedStudents
  }
}

function writeStorage(students) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  return students
}

function createId() {
  return `stu-${crypto.randomUUID()}`
}

export const studentsService = {
  async getAll() {
    await wait()
    return readStorage()
  },

  async create(student) {
    await wait()
    const nextStudent = { ...student, id: createId() }
    const currentStudents = readStorage()
    writeStorage([nextStudent, ...currentStudents])
    return nextStudent
  },

  async update(studentId, studentData) {
    await wait()
    const updatedStudents = readStorage().map((student) =>
      student.id === studentId ? { ...student, ...studentData, id: studentId } : student,
    )
    writeStorage(updatedStudents)
    return updatedStudents.find((student) => student.id === studentId) ?? null
  },

  async remove(studentId) {
    await wait()
    const filteredStudents = readStorage().filter((student) => student.id !== studentId)
    writeStorage(filteredStudents)
    return studentId
  },
}
