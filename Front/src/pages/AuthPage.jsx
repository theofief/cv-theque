import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchSelect from '../components/forms/SearchSelect'
import { catalogService } from '../services/catalogService'

const COMPANY_NOT_AVAILABLE = 'Entreprise non disponible'

const defaultRegister = {
  displayName: '',
  email: '',
  password: '',
  profileType: 'student',
  schoolName: '',
  companyName: '',
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState(defaultRegister)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [schools, setSchools] = useState([])
  const [companies, setCompanies] = useState([])
  const [companyInput, setCompanyInput] = useState('')
  const [customCompanyName, setCustomCompanyName] = useState('')

  useEffect(() => {
    let active = true

    async function loadCatalogs() {
      try {
        const [schoolsData, companiesData] = await Promise.all([
          catalogService.getSchools(),
          catalogService.getCompanies(),
        ])

        if (!active) {
          return
        }

        setSchools(schoolsData)
        setCompanies(companiesData)
      } catch {
        // non bloquant
      }
    }

    loadCatalogs()

    return () => {
      active = false
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(loginData.email, loginData.password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Echec de connexion')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const finalSchoolName = registerData.profileType === 'student' ? registerData.schoolName.trim() : registerData.schoolName

      if (registerData.profileType === 'student' && schools.length && !schools.includes(finalSchoolName)) {
        throw new Error('Selectionnez une ecole du catalogue.')
      }

      if (
        companyInput &&
        companyInput !== COMPANY_NOT_AVAILABLE &&
        companies.length &&
        !companies.includes(companyInput)
      ) {
        throw new Error('Selectionnez une entreprise du catalogue ou Entreprise non disponible.')
      }

      const finalCompanyName =
        companyInput === COMPANY_NOT_AVAILABLE ? customCompanyName.trim() : companyInput.trim()

      await register({
        ...registerData,
        schoolName: finalSchoolName,
        companyName: finalCompanyName || null,
      })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Echec de creation de compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card border-0 shadow-sm surface-card legal-page">
      <div className="card-body p-4 p-lg-5 d-grid gap-4">
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn rounded-pill px-4 ${mode === 'login' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setMode('login')}
          >
            Connexion
          </button>
          <button
            type="button"
            className={`btn rounded-pill px-4 ${mode === 'register' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setMode('register')}
          >
            Creer un compte
          </button>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {mode === 'login' ? (
          <form className="d-grid gap-3" onSubmit={handleLogin}>
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(event) => setLoginData((v) => ({ ...v, email: event.target.value }))}
              required
            />
            <input
              className="form-control"
              type="password"
              placeholder="Mot de passe"
              value={loginData.password}
              onChange={(event) => setLoginData((v) => ({ ...v, password: event.target.value }))}
              required
            />
            <button className="btn btn-warning rounded-pill px-4" disabled={loading} type="submit">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form className="d-grid gap-3" onSubmit={handleRegister}>
            <input
              className="form-control"
              placeholder="Nom du profil"
              value={registerData.displayName}
              onChange={(event) => setRegisterData((v) => ({ ...v, displayName: event.target.value }))}
              required
            />
            <select
              className="form-select"
              value={registerData.profileType}
              onChange={(event) => setRegisterData((v) => ({ ...v, profileType: event.target.value }))}
            >
              <option value="student">Student</option>
              <option value="school">Ecole</option>
              <option value="company">Entreprise</option>
            </select>
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(event) => setRegisterData((v) => ({ ...v, email: event.target.value }))}
              required
            />
            <input
              className="form-control"
              type="password"
              placeholder="Mot de passe (8+ caracteres)"
              value={registerData.password}
              onChange={(event) => setRegisterData((v) => ({ ...v, password: event.target.value }))}
              required
            />
            <SearchSelect
              label="Ecole"
              placeholder="Ecole (obligatoire pour student)"
              value={registerData.schoolName}
              onChange={(nextValue) => setRegisterData((v) => ({ ...v, schoolName: nextValue }))}
              options={schools}
              helpText="Choisissez une ecole du catalogue"
            />
            <SearchSelect
              label="Entreprise (optionnel)"
              placeholder="Rechercher une entreprise"
              value={companyInput}
              onChange={setCompanyInput}
              options={companies}
              helpText="Ou saisissez une entreprise non encore listée"
              specialOption={{ label: COMPANY_NOT_AVAILABLE, value: COMPANY_NOT_AVAILABLE }}
            />
            {companyInput === COMPANY_NOT_AVAILABLE ? (
              <input
                className="form-control"
                placeholder="Nom de l entreprise"
                value={customCompanyName}
                onChange={(event) => setCustomCompanyName(event.target.value)}
              />
            ) : null}
            <button className="btn btn-warning rounded-pill px-4" disabled={loading} type="submit">
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
