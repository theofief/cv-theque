import { useEffect, useRef, useState } from 'react'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import ThemeToggle from './ThemeToggle'

const promiseItems = [
  {
    title: 'Fiches profil',
    description: 'Parcours, compétences, projets.',
    icon: 'bi-stars',
  },
  {
    title: 'Recherche',
    description: 'Filtres rapides et ciblés.',
    icon: 'bi-people',
  },
  {
    title: 'Base évolutive',
    description: 'Conçue pour s’intégrer facilement.',
    icon: 'bi-diagram-3',
  },
]

function Header({ theme, toggleTheme, headerRef, isAuthenticated, onLogout, isAdmin }) {
  return (
    <header ref={headerRef} className="app-hero rounded-5 overflow-hidden shadow-lg text-white">
      <div className="container-fluid p-4 p-lg-5 position-relative">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <div className="text-uppercase small fw-semibold opacity-75 brand-kicker">
              Gott
            </div>
            <div className="fs-5 fw-semibold">Gott</div>
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
            <span className="badge rounded-pill text-bg-light px-3 py-2 text-primary-emphasis">
              Gott
            </span>
            {isAuthenticated ? (
              <button type="button" className="btn btn-outline-light rounded-pill px-3 py-2" onClick={onLogout}>
                {isAdmin ? 'Admin connecté · Se déconnecter' : 'Se déconnecter'}
              </button>
            ) : (
              <Link to="/auth" className="btn btn-outline-light rounded-pill px-3 py-2 text-decoration-none">
                Connexion
              </Link>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-xl-7">
            <div className="d-grid gap-3">
              <span className="text-uppercase small fw-semibold text-warning brand-kicker">
                Talents disponibles
              </span>
              <h1 className="display-4 fw-bold lh-1 mb-0">
                Une vitrine sobre pour présenter les profils disponibles.
              </h1>
              <p className="lead text-white-50 mb-0 col-xl-10">
                Un espace clair pour consulter les profils, comparer les parcours et repérer les
                bons talents.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                <a className="btn btn-warning btn-lg rounded-pill px-4" href="#talent-space">
                  Consulter les profils
                </a>
                <a className="btn btn-outline-light btn-lg rounded-pill px-4" href="#talent-form">
                  Ajouter un profil
                </a>
              </div>
            </div>
          </div>

          <div className="col-xl-5">
            <div className="row g-3 h-100">
              <div className="col-12">
                <div className="glass-panel h-100 p-4 rounded-4 border border-white border-opacity-10">
                  <div className="text-uppercase small fw-semibold text-warning brand-kicker mb-2">
                    Informations
                  </div>
                  <p className="mb-0 text-white-50">
                    Consultation des profils, filtres avancés et accès rapide aux informations
                    clés.
                  </p>
                </div>
              </div>

              {promiseItems.map((item) => (
                <div key={item.title} className="col-md-4 col-xl-12">
                  <article className="glass-panel h-100 p-4 rounded-4 border border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className={`bi ${item.icon} text-warning`} />
                      <h2 className="h6 mb-0 text-white">{item.title}</h2>
                    </div>
                    <p className="mb-0 text-white-50 small">{item.description}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function FloatingNav({ visible, theme, toggleTheme, isAuthenticated, onLogout, windStyle }) {
  return (
    <div className={`floating-nav-wrapper ${visible ? 'is-visible' : ''}`}>
      <nav className="floating-nav rounded-pill" aria-label="Navigation principale" style={windStyle}>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <Link to="/" className="floating-nav-brand text-decoration-none">
            Gott
          </Link>
          <div className="floating-nav-links d-flex align-items-center gap-2 gap-lg-3">
            <Link to="/" className="text-decoration-none small fw-semibold">
              Accueil
            </Link>
            <Link to="/auth" className="text-decoration-none small fw-semibold">
              Compte
            </Link>
            <Link to="/legal" className="text-decoration-none small fw-semibold">
              Mentions
            </Link>
            <Link to="/privacy" className="text-decoration-none small fw-semibold">
              Confidentialite
            </Link>
            <Link to="/contact" className="text-decoration-none small fw-semibold">
              Contact
            </Link>
          </div>
          {isAuthenticated ? (
            <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onLogout}>
              Deconnexion
            </button>
          ) : null}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </nav>
    </div>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="surface-card rounded-5 px-4 py-4 mt-4 site-footer">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
        <div>
          <p className="mb-1 fw-semibold text-body">Gott</p>
          <p className="mb-0 small text-secondary">© {year} Gott. Tous droits réservés.</p>
        </div>

        <nav className="d-flex flex-wrap gap-3 site-footer-links" aria-label="Liens légaux">
          <Link to="/legal" className="text-secondary text-decoration-none small">
            Mentions légales
          </Link>
          <Link to="/privacy" className="text-secondary text-decoration-none small">
            Politique de confidentialité
          </Link>
          <Link to="/contact" className="text-secondary text-decoration-none small">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const headerRef = useRef(null)
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const [navWindStyle, setNavWindStyle] = useState({})
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    let rafId = 0

    const handleScroll = () => {
      const headerElement = headerRef.current
      const scrollY = window.scrollY || 0
      const sway = Math.sin(scrollY / 42) * 4
      const drift = Math.cos(scrollY / 58) * 2
      const tilt = Math.sin(scrollY / 75) * 0.9

      setNavWindStyle({
        '--nav-wind-x': `${drift}px`,
        '--nav-wind-y': `${sway}px`,
        '--nav-wind-rot': `${tilt}deg`,
      })

      if (!headerElement) {
        setShowFloatingNav(true)

        return
      }

      const { top } = headerElement.getBoundingClientRect()
      setShowFloatingNav(top < -12)
    }

    const scheduleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(handleScroll)
    }

    scheduleScroll()
    window.addEventListener('scroll', scheduleScroll, { passive: true })
    window.addEventListener('resize', scheduleScroll)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleScroll)
      window.removeEventListener('resize', scheduleScroll)
    }
  }, [isHomePage])

  return (
    <div className="app-shell container-xxl py-4 py-lg-5">
      <FloatingNav
        visible={isHomePage ? showFloatingNav : true}
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        windStyle={navWindStyle}
      />
      {isHomePage ? (
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          headerRef={headerRef}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          isAdmin={isAdmin}
        />
      ) : null}
      <main className="mt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
