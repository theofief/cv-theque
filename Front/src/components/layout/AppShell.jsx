import { Outlet } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import ThemeToggle from './ThemeToggle'

function Header({ theme, toggleTheme }) {
  return (
    <header className="appHeader">
      <div className="brandBlock">
        <span className="eyebrow">CVTHEQUE</span>
        <h1>Student profiles, filters and polished UX in one clean React frontend.</h1>
        <p>
          Une CVtheque moderne, lisible et evolutive avec architecture claire, CRUD local,
          filtres combines et base solide pour la future API.
        </p>
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
  )
}

function Footer() {
  return (
    <footer className="appFooter">
      <p>Frontend only, structuree pour evoluer ensuite vers React + API Symfony.</p>
    </footer>
  )
}

export default function AppShell() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="appShell">
      <div className="ambientGlow ambientGlowLeft" />
      <div className="ambientGlow ambientGlowRight" />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="appMain">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
