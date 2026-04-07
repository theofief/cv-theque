export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button type="button" className="themeToggle" onClick={toggleTheme}>
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      <strong>{theme === 'dark' ? 'Sun' : 'Moon'}</strong>
    </button>
  )
}
