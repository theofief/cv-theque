import { useMemo, useReducer } from 'react'
import { initialData } from '../data/mockData'
import { AppStoreContext } from './useAppStore'

const ROLE_PERMISSIONS = {
  guest: { canEdit: false, canPush: false },
  student: { canEdit: true, canPush: true },
  company: { canEdit: true, canPush: true },
  school: { canEdit: true, canPush: true },
  prof: { canEdit: true, canPush: true },
  admin: { canEdit: true, canPush: true },
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
}

function canEdit(role) {
  return ROLE_PERMISSIONS[role]?.canEdit === true
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE': {
      return {
        ...state,
        session: { ...state.session, role: action.payload },
      }
    }
    case 'SET_COMPANY_FOCUS': {
      return {
        ...state,
        session: { ...state.session, companyFocusId: action.payload },
      }
    }
    case 'SET_FILTER': {
      return {
        ...state,
        session: {
          ...state.session,
          filters: {
            ...state.session.filters,
            [action.payload.key]: action.payload.value,
          },
        },
      }
    }
    case 'TOGGLE_FAVORITE': {
      if (!canEdit(state.session.role)) {
        return state
      }
      const { bucket, id } = action.payload
      const exists = state.favorites[bucket].includes(id)
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [bucket]: exists
            ? state.favorites[bucket].filter((item) => item !== id)
            : [...state.favorites[bucket], id],
        },
      }
    }
    case 'VERIFY_STUDENT_ACCOUNT': {
      if (!(state.session.role === 'school' || state.session.role === 'admin')) {
        return state
      }
      return {
        ...state,
        pendingStudentAccounts: state.pendingStudentAccounts.filter(
          (account) => account.id !== action.payload,
        ),
      }
    }
    case 'ADD_MESSAGE': {
      if (!canEdit(state.session.role)) {
        return state
      }
      const nextMessage = {
        id: uid('msg'),
        date: new Date().toISOString().slice(0, 10),
        ...action.payload,
      }
      return {
        ...state,
        messages: [nextMessage, ...state.messages],
      }
    }
    case 'ADD_STUDENT_REQUEST': {
      if (!(state.session.role === 'student' || state.session.role === 'admin')) {
        return state
      }
      const nextRequest = {
        id: uid('req'),
        date: new Date().toISOString().slice(0, 10),
        ...action.payload,
      }
      return {
        ...state,
        studentRequests: [nextRequest, ...state.studentRequests],
      }
    }
    case 'ADD_OFFER': {
      if (
        !(
          state.session.role === 'company' ||
          state.session.role === 'school' ||
          state.session.role === 'admin'
        )
      ) {
        return state
      }
      const nextOffer = {
        id: uid('off'),
        ...action.payload,
      }
      return {
        ...state,
        offers: [nextOffer, ...state.offers],
      }
    }
    case 'ADD_COMPANY_MISSION': {
      if (!(state.session.role === 'company' || state.session.role === 'admin')) {
        return state
      }
      const { companyId, title } = action.payload
      return {
        ...state,
        companies: state.companies.map((company) => {
          if (company.id !== companyId) {
            return company
          }
          return {
            ...company,
            openMissions: [{ id: uid('mission'), title }, ...company.openMissions],
          }
        }),
      }
    }
    case 'APPROVE_MODERATION_ITEM': {
      if (!(state.session.role === 'school' || state.session.role === 'admin')) {
        return state
      }
      return {
        ...state,
        moderationQueue: state.moderationQueue.map((item) =>
          item.id === action.payload ? { ...item, status: 'approved' } : item,
        ),
      }
    }
    case 'REJECT_MODERATION_ITEM': {
      if (!(state.session.role === 'school' || state.session.role === 'admin')) {
        return state
      }
      return {
        ...state,
        moderationQueue: state.moderationQueue.map((item) =>
          item.id === action.payload ? { ...item, status: 'rejected' } : item,
        ),
      }
    }
    case 'ADD_PROF_PUSH': {
      if (!(state.session.role === 'prof' || state.session.role === 'admin')) {
        return state
      }
      const nextPush = {
        id: uid('push'),
        date: new Date().toISOString().slice(0, 10),
        ...action.payload,
      }
      return {
        ...state,
        professorPushes: [nextPush, ...state.professorPushes],
      }
    }
    case 'ADD_STUDENT_RECOMMENDATION': {
      if (!(state.session.role === 'prof' || state.session.role === 'admin')) {
        return state
      }
      const { studentId, recommendation } = action.payload
      return {
        ...state,
        students: state.students.map((student) => {
          if (student.id !== studentId) {
            return student
          }
          return {
            ...student,
            recommendations: [recommendation, ...student.recommendations],
          }
        }),
      }
    }
    default:
      return state
  }
}

function computeAgeMatch(ageRange, age) {
  if (ageRange === 'all') {
    return true
  }
  if (ageRange === '18-22') {
    return age >= 18 && age <= 22
  }
  if (ageRange === '23-26') {
    return age >= 23 && age <= 26
  }
  return true
}

function buildSelectors(state) {
  const filters = state.session.filters
  const companyFocus = state.companies.find(
    (company) => company.id === state.session.companyFocusId,
  )

  const allSkills = Array.from(
    new Set(state.students.flatMap((student) => student.skills)),
  ).sort((a, b) => a.localeCompare(b, 'fr'))

  const filteredStudents = state.students.filter((student) => {
    const regionOk = filters.region === 'all' || student.region === filters.region
    const skillOk =
      filters.skill === 'all' ||
      student.skills.some((skill) => skill.toLowerCase() === filters.skill.toLowerCase())
    const contractOk = filters.contract === 'all' || student.contract === filters.contract
    const ageOk = computeAgeMatch(filters.ageRange, student.age)

    return regionOk && skillOk && contractOk && ageOk
  })

  const recommendedProfiles = filteredStudents
    .map((student) => {
      const matchingSkills = student.skills.filter((skill) =>
        companyFocus?.wantedSkills.includes(skill),
      )
      return {
        student,
        score: matchingSkills.length,
        matchingSkills,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const topProfiles = [...filteredStudents]
    .sort((a, b) => b.recommendations.length - a.recommendations.length)
    .slice(0, 5)

  return {
    allSkills,
    filteredStudents,
    recommendedProfiles,
    topProfiles,
    companyFocus,
    rolePermissions: ROLE_PERMISSIONS[state.session.role],
  }
}

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialData)

  const actions = useMemo(
    () => ({
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
      setCompanyFocus: (companyId) =>
        dispatch({ type: 'SET_COMPANY_FOCUS', payload: companyId }),
      setFilter: (key, value) => dispatch({ type: 'SET_FILTER', payload: { key, value } }),
      toggleFavorite: (bucket, id) =>
        dispatch({ type: 'TOGGLE_FAVORITE', payload: { bucket, id } }),
      verifyStudentAccount: (accountId) =>
        dispatch({ type: 'VERIFY_STUDENT_ACCOUNT', payload: accountId }),
      addMessage: (payload) => dispatch({ type: 'ADD_MESSAGE', payload }),
      addStudentRequest: (payload) => dispatch({ type: 'ADD_STUDENT_REQUEST', payload }),
      addOffer: (payload) => dispatch({ type: 'ADD_OFFER', payload }),
      addCompanyMission: (payload) => dispatch({ type: 'ADD_COMPANY_MISSION', payload }),
      approveModerationItem: (id) =>
        dispatch({ type: 'APPROVE_MODERATION_ITEM', payload: id }),
      rejectModerationItem: (id) =>
        dispatch({ type: 'REJECT_MODERATION_ITEM', payload: id }),
      addProfessorPush: (payload) => dispatch({ type: 'ADD_PROF_PUSH', payload }),
      addStudentRecommendation: (payload) =>
        dispatch({ type: 'ADD_STUDENT_RECOMMENDATION', payload }),
    }),
    [],
  )

  const selectors = useMemo(() => buildSelectors(state), [state])
  const value = useMemo(() => ({ state, actions, selectors }), [state, actions, selectors])

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}
