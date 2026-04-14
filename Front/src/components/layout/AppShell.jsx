import { Outlet } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import ThemeToggle from './ThemeToggle'

const promiseItems = [
  {
    title: 'Profils valorises',
    description: 'Des pages lisibles pour presenter parcours, competences et projets.',
    icon: 'bi-stars',
  },
  {
    title: 'Mise en relation',
    description: 'Une recherche rapide pour aider les entreprises a trouver les bons talents.',
    icon: 'bi-people',
  },
  {
    title: 'Base evolutive',
    description: 'Une interface claire, prete pour l integration avec l API et les logos.',
    icon: 'bi-diagram-3',
  },
]

function Header({ theme, toggleTheme }) {
  return (
    <header className="app-hero rounded-5 overflow-hidden shadow-lg text-white">
      <div className="container-fluid p-4 p-lg-5 position-relative">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <div className="text-uppercase small fw-semibold opacity-75 brand-kicker">
              Ecole Hexagone
            </div>
            <div className="fs-5 fw-semibold">Hexagone (got) Talents</div>
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
            <span className="badge rounded-pill text-bg-light px-3 py-2 text-primary-emphasis">
              CVtheque digitale
            </span>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-xl-7">
            <div className="d-grid gap-3">
              <span className="text-uppercase small fw-semibold text-warning brand-kicker">
                Talents etudiants
              </span>
              <h1 className="display-4 fw-bold lh-1 mb-0">
                Une vitrine plus propre, plus claire et plus credible pour les profils Hexagone.
              </h1>
              <p className="lead text-white-50 mb-0 col-xl-10">
                La plateforme valorise les etudiants, facilite la consultation des profils et
                pose une base serieuse pour la mise en relation avec les entreprises.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                <a className="btn btn-warning btn-lg rounded-pill px-4" href="#talent-space">
                  Explorer les talents
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
                    Promesse produit
                  </div>
                  <p className="mb-0 text-white-50">
                    Une experience plus editoriale et plus rassurante qu un dashboard generique,
                    tout en restant fluide, responsive et simple a faire evoluer.
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

function Footer() {
  return (
    <footer className="surface-card rounded-5 px-4 py-3 small text-secondary mt-4">
      Interface alignee sur l esprit du brief Hexagone (got) Talents. Les logos officiels
      pourront etre integres ensuite sans refaire la structure.
    </footer>
  )
}

export default function AppShell() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell container-xxl py-4 py-lg-5">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="mt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
