import { useAppStore } from '../context/useAppStore'
import SchoolsPage from './SchoolsPage'
import StudentsPage from './StudentsPage'
import CompaniesPage from './CompaniesPage'
import MessagingPage from './MessagingPage'
import RequestsPage from './RequestsPage'
import OffersPage from './OffersPage'
import ModerationPage from './ModerationPage'
import ProfessorPage from './ProfessorPage'
import GuestPage from './GuestPage'
import DashboardPage from './DashboardPage'

function SectionBlock({ title, children }) {
  return (
    <section className="stackSection">
      <h2 className="stackTitle">{title}</h2>
      {children}
    </section>
  )
}

function StudentDashboard() {
  return (
    <>
      <SectionBlock title="Profil etudiant">
        <StudentsPage />
      </SectionBlock>
      <SectionBlock title="Messagerie interne">
        <MessagingPage />
      </SectionBlock>
      <SectionBlock title="Demandes etudiant">
        <RequestsPage />
      </SectionBlock>
    </>
  )
}

function CompanyDashboard() {
  return (
    <>
      <SectionBlock title="Profil entreprise">
        <CompaniesPage />
      </SectionBlock>
      <SectionBlock title="Dashboard entreprise">
        <DashboardPage />
      </SectionBlock>
      <SectionBlock title="Offres et missions">
        <OffersPage />
      </SectionBlock>
      <SectionBlock title="Messagerie interne">
        <MessagingPage />
      </SectionBlock>
    </>
  )
}

function SchoolDashboard() {
  return (
    <>
      <SectionBlock title="Profil ecole">
        <SchoolsPage />
      </SectionBlock>
      <SectionBlock title="Offres ecole">
        <OffersPage />
      </SectionBlock>
      <SectionBlock title="Moderation">
        <ModerationPage />
      </SectionBlock>
    </>
  )
}

function ProfessorDashboard() {
  return (
    <>
      <SectionBlock title="Profil professeur">
        <ProfessorPage />
      </SectionBlock>
    </>
  )
}

function GuestDashboard() {
  return (
    <>
      <SectionBlock title="Profil invite">
        <GuestPage />
      </SectionBlock>
    </>
  )
}

function AdminDashboard() {
  return (
    <>
      <SectionBlock title="Moderation globale">
        <ModerationPage />
      </SectionBlock>
      <SectionBlock title="Pilotage ecoles">
        <SchoolsPage />
      </SectionBlock>
      <SectionBlock title="Pilotage entreprises">
        <CompaniesPage />
      </SectionBlock>
      <SectionBlock title="KPI entreprise">
        <DashboardPage />
      </SectionBlock>
    </>
  )
}

export default function ProfileDashboardPage() {
  const { state } = useAppStore()

  if (state.session.role === 'student') {
    return <StudentDashboard />
  }

  if (state.session.role === 'company') {
    return <CompanyDashboard />
  }

  if (state.session.role === 'school') {
    return <SchoolDashboard />
  }

  if (state.session.role === 'prof') {
    return <ProfessorDashboard />
  }

  if (state.session.role === 'admin') {
    return <AdminDashboard />
  }

  return <GuestDashboard />
}
