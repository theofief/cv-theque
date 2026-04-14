export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      type="button"
      className="btn btn-outline-light d-inline-flex align-items-center gap-2 rounded-pill px-3"
      onClick={toggleTheme}
    >
      <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
      <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
    </button>
  )
}
