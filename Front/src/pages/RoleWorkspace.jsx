import { useAppStore } from '../context/useAppStore'
import HomePage from './HomePage'
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

function StudentWorkspace() {
  return (
    <>
      <SectionBlock title="Mon profil et CV">
        <StudentsPage />
      </SectionBlock>
      <SectionBlock title="Messagerie interne">
        <MessagingPage />
      </SectionBlock>
      <SectionBlock title="Mes demandes (students only)">
        <RequestsPage />
      </SectionBlock>
    </>
  )
}

function CompanyWorkspace() {
  return (
    <>
      <SectionBlock title="Home recommandations entreprise">
        <HomePage />
      </SectionBlock>
      <SectionBlock title="Page entreprise">
        <CompaniesPage />
      </SectionBlock>
      <SectionBlock title="Offres et missions">
        <OffersPage />
      </SectionBlock>
      <SectionBlock title="Messagerie interne">
        <MessagingPage />
      </SectionBlock>
      <SectionBlock title="Dashboard entreprise">
        <DashboardPage />
      </SectionBlock>
    </>
  )
}

function SchoolWorkspace() {
  return (
    <>
      <SectionBlock title="Vue ecole / school">
        <SchoolsPage />
      </SectionBlock>
      <SectionBlock title="Offres publiees par ecole">
        <OffersPage />
      </SectionBlock>
      <SectionBlock title="Moderation renforcee">
        <ModerationPage />
      </SectionBlock>
    </>
  )
}

function ProfessorWorkspace() {
  return (
    <>
      <SectionBlock title="Visu prof: push et recommandations">
        <ProfessorPage />
      </SectionBlock>
      <SectionBlock title="Vue des profils etudiants">
        <StudentsPage />
      </SectionBlock>
    </>
  )
}

function GuestWorkspace() {
  return (
    <>
      <SectionBlock title="Vue invite">
        <GuestPage />
      </SectionBlock>
      <SectionBlock title="Apercu des ecoles">
        <SchoolsPage />
      </SectionBlock>
      <SectionBlock title="Apercu des etudiants">
        <StudentsPage />
      </SectionBlock>
      <SectionBlock title="Apercu des entreprises">
        <CompaniesPage />
      </SectionBlock>
      <SectionBlock title="Apercu des offres">
        <OffersPage />
      </SectionBlock>
      <SectionBlock title="Home recommandations">
        <HomePage />
      </SectionBlock>
    </>
  )
}

function AdminWorkspace() {
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
      <SectionBlock title="Dashboard">
        <DashboardPage />
      </SectionBlock>
    </>
  )
}

export default function RoleWorkspace() {
  const { state } = useAppStore()

  if (state.session.role === 'student') {
    return <StudentWorkspace />
  }

  if (state.session.role === 'company') {
    return <CompanyWorkspace />
  }

  if (state.session.role === 'school') {
    return <SchoolWorkspace />
  }

  if (state.session.role === 'prof') {
    return <ProfessorWorkspace />
  }

  if (state.session.role === 'admin') {
    return <AdminWorkspace />
  }

  return <GuestWorkspace />
}
